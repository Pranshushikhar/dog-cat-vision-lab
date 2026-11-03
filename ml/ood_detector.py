"""
ml/ood_detector.py

Independent Out-of-Distribution (OOD) Screening Stage for PAWVISION AI.
Validates whether an uploaded image contains a feline or canine subject
prior to passing it to the downstream binary classifier.

Architecture:
  - Uses a lightweight MobileNetV2 pretrained on ImageNet-1K (1,000 diverse real-world classes).
  - Canidae (domestic dogs, wild canines, foxes, wolves) span ImageNet indices 151 to 280.
  - Felidae (domestic cats, cougars, lynx, leopards, lions, tigers, cheetahs) span indices 281 to 293.
  - Together, indices 151 to 293 define the valid feline/canine semantic domain (143 fine-grained classes).
  - The remaining 857 ImageNet classes cover non-cat/non-dog entities: vehicles, buildings, food,
    human apparel, landscapes, household tools, and inanimate objects.

Integrity & Conservative Thresholding:
  - An image is accepted if:
    1. The top-1 predicted class is an identified feline or canine breed, OR
    2. The accumulated probability across all 143 feline/canine classes is at least 0.15 (15%).
  - Otherwise, the image is rejected as Out-of-Distribution (OOD).
  - Rejection does NOT depend on the binary classifier's confidence score, preventing low binary
    uncertainty from being conflated with proof of an unrelated image.
"""

import io
import json
from pathlib import Path
from typing import Union, Tuple, Dict, Any
import numpy as np
from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parent.parent
LOCAL_OOD_MODEL_PATH = PROJECT_ROOT / "models" / "ood_mobilenet_v2.keras"
CLASS_INDEX_PATH = PROJECT_ROOT / "ml" / "imagenet_class_index.json"

# ImageNet class indices for Canidae (151..280) and Felidae (281..293)
CANINE_START_IDX = 151
CANINE_END_IDX = 280  # Inclusive
FELINE_START_IDX = 281
FELINE_END_IDX = 293  # Inclusive
FELINE_CANINE_INDICES = set(range(CANINE_START_IDX, FELINE_END_IDX + 1))

# Conservative accumulated probability cutoff for non-top1 cases
CONSERVATIVE_CAT_DOG_THRESHOLD = 0.15

_OOD_MODEL = None
_CLASS_INDEX = None


def get_class_index() -> Dict[str, list]:
    """Loads ImageNet class index mapping {index_str: [wnid, human_readable_name]}."""
    global _CLASS_INDEX
    if _CLASS_INDEX is not None:
        return _CLASS_INDEX

    if CLASS_INDEX_PATH.exists():
        try:
            _CLASS_INDEX = json.loads(CLASS_INDEX_PATH.read_text(encoding="utf-8"))
            return _CLASS_INDEX
        except Exception:
            pass

    # Fallback to Keras internal class index loader
    try:
        from tensorflow.keras.applications.mobilenet_v2 import decode_predictions
        dummy = np.zeros((1, 1000), dtype=np.float32)
        decode_predictions(dummy, top=1)
        cache_path = Path.home() / ".keras" / "models" / "imagenet_class_index.json"
        if cache_path.exists():
            _CLASS_INDEX = json.loads(cache_path.read_text(encoding="utf-8"))
            return _CLASS_INDEX
    except Exception:
        pass

    _CLASS_INDEX = {}
    return _CLASS_INDEX


def get_ood_detector():
    """Singleton accessor for the OOD screening model."""
    global _OOD_MODEL
    if _OOD_MODEL is not None:
        return _OOD_MODEL

    import tensorflow as tf

    if LOCAL_OOD_MODEL_PATH.exists() and LOCAL_OOD_MODEL_PATH.stat().st_size > 1024 * 1024:
        try:
            _OOD_MODEL = tf.keras.models.load_model(str(LOCAL_OOD_MODEL_PATH))
            return _OOD_MODEL
        except Exception as e:
            print(f"[OOD Detector] Could not load local model at {LOCAL_OOD_MODEL_PATH}: {e}. Falling back to Keras download.")

    _OOD_MODEL = tf.keras.applications.MobileNetV2(weights="imagenet")
    try:
        if not LOCAL_OOD_MODEL_PATH.exists():
            _OOD_MODEL.save(str(LOCAL_OOD_MODEL_PATH))
    except Exception:
        pass

    return _OOD_MODEL


def format_category_name(raw_name: str) -> str:
    """Formats an ImageNet class identifier into a clean, human-readable label."""
    if not raw_name:
        return "Unrelated object"
    cleaned = raw_name.replace("_", " ").strip()
    return cleaned.capitalize()


def validate_image_is_cat_or_dog(image_input: Union[bytes, bytearray, str, Path, Image.Image, np.ndarray]) -> Dict[str, Any]:
    """
    Independent OOD screening: evaluates whether the image contains a cat or dog subject.
    Accepts raw images or pre-extracted (1, 224, 224, 3) numpy arrays for maximum performance.
    
    Returns:
      {
        "is_cat_or_dog": bool,
        "cat_dog_score": float,
        "top1_category": str,
        "top1_label": str,
        "top1_confidence": float,
        "top_predictions": list of {category, confidence},
        "reason": str
      }
    """
    try:
        # Fast path if input is already a pre-processed (1, 224, 224, 3) or (224, 224, 3) numpy tensor
        if isinstance(image_input, np.ndarray):
            arr = image_input
            if arr.ndim == 3:
                arr = np.expand_dims(arr, axis=0)
            # MobileNetV2 scaling: maps [0, 255] to [-1, 1]
            tensor = (arr / 127.5) - 1.0
        else:
            # Load and normalize image to RGB (224, 224)
            if isinstance(image_input, (bytes, bytearray)):
                img = Image.open(io.BytesIO(image_input))
            elif isinstance(image_input, (str, Path)):
                img = Image.open(image_input)
            elif isinstance(image_input, Image.Image):
                img = image_input
            else:
                raise ValueError(f"Unsupported image type: {type(image_input)}")

            img.load()
            if img.width < 10 or img.height < 10:
                raise ValueError(f"Image is too small ({img.width}x{img.height}). Minimum dimensions are 10x10 pixels.")

            if img.mode != "RGB":
                img = img.convert("RGB")

            img_resized = img.resize((224, 224), Image.Resampling.BILINEAR)
            arr = np.array(img_resized, dtype=np.float32)
            tensor = (np.expand_dims(arr, axis=0) / 127.5) - 1.0

        model = get_ood_detector()
        # Direct callable tensor evaluation is 2-3x faster than model.predict(tensor)
        preds_tensor = model(tensor, training=False)
        raw_preds = preds_tensor.numpy()[0]

        # Calculate accumulated feline & canine probability across all 143 classes
        cat_dog_score = float(np.sum(raw_preds[CANINE_START_IDX:FELINE_END_IDX + 1]))

        # Top predicted class
        top1_idx = int(np.argmax(raw_preds))
        top1_prob = float(raw_preds[top1_idx])
        top1_is_cat_or_dog = top1_idx in FELINE_CANINE_INDICES

        class_idx = get_class_index()
        top1_raw_name = class_idx.get(str(top1_idx), ["", "unknown_object"])[1] if class_idx else "unknown_object"
        top1_label = format_category_name(top1_raw_name)

        # Top 5 predictions for diagnostic tracking
        top5_indices = np.argsort(raw_preds)[-5:][::-1]
        top_predictions = []
        for idx in top5_indices:
            idx_int = int(idx)
            raw_c = class_idx.get(str(idx_int), ["", "unknown"])[1] if class_idx else "unknown"
            top_predictions.append({
                "index": idx_int,
                "category": raw_c,
                "label": format_category_name(raw_c),
                "confidence": round(float(raw_preds[idx_int]), 4),
                "is_cat_or_dog": idx_int in FELINE_CANINE_INDICES
            })

        # Decision rule:
        # Accepted if top-1 class is a cat/dog breed, OR accumulated cat/dog probability >= 0.15
        is_accepted = bool(top1_is_cat_or_dog or (cat_dog_score >= CONSERVATIVE_CAT_DOG_THRESHOLD))

        if is_accepted:
            reason = f"Image identified as feline/canine subject (Score: {cat_dog_score:.2%}, Primary: {top1_label})."
        else:
            reason = f"Non-canine/non-feline subject detected: primary visual pattern aligns with '{top1_label}' ({top1_prob:.1%})."

        return {
            "is_cat_or_dog": is_accepted,
            "cat_dog_score": round(cat_dog_score, 4),
            "top1_category": top1_raw_name,
            "top1_label": top1_label,
            "top1_confidence": round(top1_prob, 4),
            "top1_is_cat_or_dog": top1_is_cat_or_dog,
            "top_predictions": top_predictions,
            "reason": reason
        }

    except ValueError:
        raise
    except Exception as e:
        # Fail safe: In case of an unexpected inspection error, default to accepting the image
        # so normal inference can proceed, while logging the diagnostic error.
        print(f"[OOD Detector] Warning during validation: {e}")
        return {
            "is_cat_or_dog": True,
            "cat_dog_score": 1.0,
            "top1_category": "unknown",
            "top1_label": "Unknown",
            "top1_confidence": 1.0,
            "top1_is_cat_or_dog": True,
            "top_predictions": [],
            "reason": f"Fallback acceptance due to inspection exception: {e}"
        }
