"""
tests/test_dataset.py

Unit tests for dataset setup, Kaggle auth detection, and image preprocessing.
"""

import io
import json
import pytest
from pathlib import Path
from PIL import Image
import numpy as np

from scripts.download_dataset import check_kaggle_auth
from scripts.setup_dataset import write_metadata, METADATA_FILE
from ml.predict import preprocess_image


def test_kaggle_auth_detection():
    """Verify Kaggle auth check detects state without throwing exceptions."""
    is_authed, msg = check_kaggle_auth()
    assert isinstance(is_authed, bool)
    assert isinstance(msg, str)
    assert len(msg) > 0


def test_metadata_serialization(tmp_path):
    """Verify metadata writing creates valid JSON without mutating production metadata."""
    test_data = {
        "connected": False,
        "status": "KAGGLE_AUTH_REQUIRED",
        "total_images": None,
        "dog_images": None,
        "cat_images": None,
        "corrupted_images": 0
    }
    temp_target = tmp_path / "dataset_metadata.json"
    write_metadata(test_data, filepath=temp_target)
    assert temp_target.exists()
    with open(temp_target, "r", encoding="utf-8") as f:
        loaded = json.load(f)
    assert loaded["status"] == "KAGGLE_AUTH_REQUIRED"


def test_image_preprocessing_pil():
    """Verify PIL image is correctly standardized to (1, 224, 224, 3) float32 tensor."""
    img = Image.new("RGB", (400, 300), color=(128, 64, 32))
    tensor = preprocess_image(img, target_size=(224, 224))
    
    assert isinstance(tensor, np.ndarray)
    assert tensor.shape == (1, 224, 224, 3)
    assert tensor.dtype == np.float32


def test_image_preprocessing_bytes():
    """Verify byte stream input is correctly parsed and standardized."""
    img = Image.new("RGB", (100, 100), color=(255, 0, 128))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    raw_bytes = buf.getvalue()

    tensor = preprocess_image(raw_bytes, target_size=(224, 224))
    assert tensor.shape == (1, 224, 224, 3)


def test_image_preprocessing_invalid_input():
    """Verify passing non-image data raises an error."""
    with pytest.raises(Exception):
        preprocess_image(b"not an image file")
