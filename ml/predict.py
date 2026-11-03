"""
ml/predict.py

Inference engine for the trained Dog vs Cat CNN classifier.
Preprocesses single images and runs real model inference via TensorFlow / Keras.
Features:
  - Independent Out-of-Distribution (OOD) screening stage before binary classification.
  - Rejects non-cat and non-dog images with an informative advisory.
  - Never outputs 'CAT' or 'DOG' for rejected out-of-domain images.
  - Does not confuse low binary confidence with proof that an image is unrelated.
  - Enforces strict integrity: predictions come exclusively from trained models.
"""

import io
from pathlib import Path
import numpy as np
from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = PROJECT_ROOT / "models" / "dog_cat_cnn.keras"

_LOADED_MODEL = None
_LOADED_MODEL_PATH = None


def get_inference_model(model_path=MODEL_PATH):
    """Singleton accessor for the loaded model in memory."""
    global _LOADED_MODEL, _LOADED_MODEL_PATH

    path = Path(model_path)
    if not path.exists():
        raise FileNotFoundError("MODEL_NOT_TRAINED")

    if _LOADED_MODEL is not None and _LOADED_MODEL_PATH == str(path.resolve()):
        return _LOADED_MODEL

    import tensorflow as tf
    print(f"Loading CNN weights from: {path}...")
    _LOADED_MODEL = tf.keras.models.load_model(str(path))
    _LOADED_MODEL_PATH = str(path.resolve())
    return _LOADED_MODEL


def is_model_ready(model_path=MODEL_PATH) -> tuple[bool, str]:
    """
    Checks whether the CNN model is loaded or ready to be loaded.
    Returns (is_ready, status_message).
    """
    global _LOADED_MODEL, _LOADED_MODEL_PATH
    path = Path(model_path)
    if not path.exists():
        return False, "Model weights not found. Execute 'python run_pipeline.py' or 'python ml/train.py' to generate checkpoint."

    if _LOADED_MODEL is not None and _LOADED_MODEL_PATH == str(path.resolve()):
        return True, "CNN model is loaded in memory and ready for real-time inference."

    if path.stat().st_size < 1024:
        return False, f"Model checkpoint at {path} is suspiciously small ({path.stat().st_size} bytes)."

    return True, f"CNN model checkpoint found at {path} ({path.stat().st_size / 1024 / 1024:.2f} MB)."


def load_and_validate_image(image_input) -> Image.Image:
    """
    Standardizes image input and enforces minimum resolution (10x10)
    and valid decodable raster formats.
    """
    try:
        if isinstance(image_input, (bytes, bytearray)):
            img = Image.open(io.BytesIO(image_input))
        elif isinstance(image_input, (str, Path)):
            img = Image.open(image_input)
        elif isinstance(image_input, Image.Image):
            img = image_input
        else:
            raise ValueError(f"Unsupported image input type: {type(image_input)}")
        
        # Force load to catch truncated or corrupted image data early
        img.load()
    except Exception as e:
        raise ValueError(f"Invalid or unreadable image file: {e}")

    # Validate image dimensions
    if img.width < 10 or img.height < 10:
        raise ValueError(f"Image is too small ({img.width}x{img.height}). Minimum dimensions are 10x10 pixels.")

    return img


def preprocess_image(image_input, target_size=(224, 224)) -> np.ndarray:
    """
    Standardizes image input (bytes, path, or PIL Image) to float32 tensor
    with shape (1, 224, 224, 3) in RGB color space.
    """
    img = load_and_validate_image(image_input)

    # Ensure RGB
    if img.mode != "RGB":
        img = img.convert("RGB")

    # Bilinear resize to 224x224
    img_resized = img.resize(target_size, Image.Resampling.BILINEAR)
    arr = np.array(img_resized, dtype=np.float32)

    # Add batch dimension: (1, 224, 224, 3)
    tensor = np.expand_dims(arr, axis=0)
    return tensor


def predict_image(image_input, threshold=0.5, model_path=MODEL_PATH, validate_ood=True) -> dict:
    """
    Executes real inference pipeline on an image:
    1. Input validation & corrupt file check (<10x10 px raises ValueError).
    2. Single-pass fast resize to 224x224 tensor.
    3. Independent Out-of-Distribution (OOD) screening stage.
       If unrelated (non-cat/non-dog), safely rejects without binary classification.
    4. Fast compiled binary CNN prediction on verified feline/canine images.
    
    Returns structured result dict.
    """
    # 1. Validation gate & single-pass RGB normalization
    validated_img = load_and_validate_image(image_input)
    if validated_img.mode != "RGB":
        validated_img = validated_img.convert("RGB")

    # Single-pass resize: shared by both OOD detector and CNN classifier
    img_resized = validated_img.resize((224, 224), Image.Resampling.BILINEAR)
    arr_224 = np.array(img_resized, dtype=np.float32)
    tensor = np.expand_dims(arr_224, axis=0)  # Shape (1, 224, 224, 3) in [0, 255]

    # 2. OOD Screening gate (reuses the 224x224 tensor directly)
    ood_result = None
    if validate_ood:
        from ml.ood_detector import validate_image_is_cat_or_dog
        ood_result = validate_image_is_cat_or_dog(tensor)

        if not ood_result.get("is_cat_or_dog", True):
            # Safe rejection: never output CAT or DOG, never return misleading binary confidence
            return {
                "prediction": "UNSUPPORTED",
                "is_supported": False,
                "message": "Unsupported Image — Please upload a photograph of a cat or dog.",
                "confidence": None,
                "probabilities": None,
                "ood_metrics": {
                    "is_cat_or_dog": False,
                    "top1_category": ood_result.get("top1_category"),
                    "top1_label": ood_result.get("top1_label"),
                    "top1_confidence": ood_result.get("top1_confidence"),
                    "cat_dog_score": ood_result.get("cat_dog_score"),
                    "reason": ood_result.get("reason"),
                    "top_predictions": ood_result.get("top_predictions", [])[:3]
                },
                "model_version": "DogCat_CNN_v1_with_OOD_Guard"
            }

    # 3. Binary classifier stage (only executed for supported images)
    # Model includes internal Rescaling layer (1./255.)
    model = get_inference_model(model_path=model_path)
    # Direct callable tensor evaluation is 2-3x faster than model.predict(tensor)
    raw_pred = model(tensor, training=False).numpy()
    dog_prob = float(raw_pred[0][0])
    cat_prob = float(1.0 - dog_prob)

    if dog_prob >= threshold:
        prediction = "dog"
        confidence = dog_prob
    else:
        prediction = "cat"
        confidence = cat_prob

    result = {
        "prediction": prediction,
        "is_supported": True,
        "confidence": round(confidence, 4),
        "probabilities": {
            "dog": round(dog_prob, 4),
            "cat": round(cat_prob, 4)
        },
        "model_version": "DogCat_CNN_v1_with_OOD_Guard"
    }

    if ood_result:
        result["ood_metrics"] = {
            "is_cat_or_dog": True,
            "cat_dog_score": ood_result.get("cat_dog_score"),
            "top1_label": ood_result.get("top1_label")
        }

    return result


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python ml/predict.py <path_to_image>")
        sys.exit(1)

    try:
        res = predict_image(sys.argv[1])
        if not res.get("is_supported", True):
            print(f"[REJECTED] {res['message']}")
            print(f"Details: {res['ood_metrics']}")
        else:
            print(f"Prediction: {res['prediction'].upper()} ({res['confidence']*100:.1f}% confidence)")
            print(f"Details: {res}")
    except FileNotFoundError:
        print("[!] ERROR: MODEL_NOT_TRAINED. Please run 'python ml/train.py' first.")
        sys.exit(2)

