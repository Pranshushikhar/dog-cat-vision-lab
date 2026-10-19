"""
ml/predict.py

Inference engine for the trained Dog vs Cat CNN classifier.
Preprocesses single images and runs real model inference via TensorFlow / Keras.
Enforces strict integrity:
  - Prediction comes exclusively from the trained CNN.
  - Never guesses by filename.
  - If model weights are missing, raises FileNotFoundError('MODEL_NOT_TRAINED').
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


def preprocess_image(image_input, target_size=(224, 224)) -> np.ndarray:
    """
    Standardizes image input (bytes, path, or PIL Image) to float32 tensor
    with shape (1, 224, 224, 3) in RGB color space.
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

    # Ensure RGB
    if img.mode != "RGB":
        img = img.convert("RGB")

    # Bilinear resize to 224x224
    img_resized = img.resize(target_size, Image.Resampling.BILINEAR)
    arr = np.array(img_resized, dtype=np.float32)

    # Add batch dimension: (1, 224, 224, 3)
    tensor = np.expand_dims(arr, axis=0)
    return tensor


def predict_image(image_input, threshold=0.5, model_path=MODEL_PATH) -> dict:
    """
    Executes real CNN prediction on an image.
    Returns prediction ('dog' or 'cat'), confidence float, and probabilities.
    """
    model = get_inference_model(model_path=model_path)
    tensor = preprocess_image(image_input)

    # Model includes internal Rescaling layer (1./255.)
    raw_pred = model.predict(tensor, verbose=0)
    dog_prob = float(raw_pred[0][0])
    cat_prob = float(1.0 - dog_prob)

    if dog_prob >= threshold:
        prediction = "dog"
        confidence = dog_prob
    else:
        prediction = "cat"
        confidence = cat_prob

    return {
        "prediction": prediction,
        "confidence": round(confidence, 4),
        "probabilities": {
            "dog": round(dog_prob, 4),
            "cat": round(cat_prob, 4)
        },
        "model_version": "DogCat_CNN_v1"
    }


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python ml/predict.py <path_to_image>")
        sys.exit(1)

    try:
        res = predict_image(sys.argv[1])
        print(f"Prediction: {res['prediction'].upper()} ({res['confidence']*100:.1f}% confidence)")
        print(f"Details: {res}")
    except FileNotFoundError:
        print("[!] ERROR: MODEL_NOT_TRAINED. Please run 'python ml/train.py' first.")
        sys.exit(2)
