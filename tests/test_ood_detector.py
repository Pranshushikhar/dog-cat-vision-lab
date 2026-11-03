"""
tests/test_ood_detector.py

Comprehensive tests for the Out-of-Distribution (OOD) Screening Stage in PAWVISION AI:
  1. Cat photograph acceptance
  2. Dog photograph acceptance
  3. Vehicle / car rejection
  4. Human portrait rejection
  5. Food rejection
  6. Architecture / building rejection
  7. Landscape rejection
  8. Random noise / unrelated image rejection
  9. Guarantee that rejected images NEVER return 'CAT' or 'DOG'
  10. Full FastAPI POST /api/predict end-to-end integration
"""

import io
from pathlib import Path
import pytest
import numpy as np
from PIL import Image, ImageDraw
from fastapi.testclient import TestClient

from backend.app import app
from ml.ood_detector import validate_image_is_cat_or_dog, FELINE_CANINE_INDICES
from ml.predict import predict_image

PROJECT_ROOT = Path(__file__).resolve().parent.parent
client = TestClient(app)


def _create_car_image() -> bytes:
    """Generate a synthetic vehicle-like image with wheels, body, and windshield."""
    img = Image.new("RGB", (224, 224), color=(200, 210, 225))
    draw = ImageDraw.Draw(img)
    # Road
    draw.rectangle([0, 160, 224, 224], fill=(70, 70, 70))
    # Car body (red chassis)
    draw.rectangle([30, 110, 194, 160], fill=(210, 30, 30))
    # Cabin / windshield
    draw.polygon([(60, 110), (80, 75), (145, 75), (165, 110)], fill=(120, 180, 230))
    # Wheels
    draw.ellipse([50, 145, 80, 175], fill=(20, 20, 20))
    draw.ellipse([145, 145, 175, 175], fill=(20, 20, 20))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


def _create_human_portrait_image() -> bytes:
    """Generate a synthetic portrait silhouette (face oval, eyes, mouth, neck, torso)."""
    img = Image.new("RGB", (224, 224), color=(240, 240, 245))
    draw = ImageDraw.Draw(img)
    # Torso / shirt
    draw.rectangle([40, 160, 184, 224], fill=(45, 85, 125))
    # Neck
    draw.rectangle([95, 135, 129, 165], fill=(225, 185, 155))
    # Head / face
    draw.ellipse([70, 45, 154, 145], fill=(235, 195, 165))
    # Hair
    draw.chord([68, 40, 156, 100], 180, 360, fill=(40, 25, 15))
    # Eyes & mouth
    draw.ellipse([88, 85, 98, 92], fill=(40, 40, 40))
    draw.ellipse([126, 85, 136, 92], fill=(40, 40, 40))
    draw.line([(98, 120), (126, 120)], fill=(180, 60, 60), width=3)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


def _create_food_image() -> bytes:
    """Generate a pizza/food-like image with crust, cheese, and pepperoni."""
    img = Image.new("RGB", (224, 224), color=(250, 245, 235))
    draw = ImageDraw.Draw(img)
    # Crust
    draw.ellipse([20, 20, 204, 204], fill=(210, 150, 75))
    # Sauce & Cheese
    draw.ellipse([32, 32, 192, 192], fill=(245, 200, 60))
    # Pepperoni slices
    for cx, cy in [(75, 75), (145, 75), (110, 110), (75, 145), (145, 145), (110, 65)]:
        draw.ellipse([cx - 14, cy - 14, cx + 14, cy + 14], fill=(175, 35, 30))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


def _create_building_image() -> bytes:
    """Generate an architectural skyscraper / building with repetitive windows."""
    img = Image.new("RGB", (224, 224), color=(180, 215, 245))
    draw = ImageDraw.Draw(img)
    # Tower
    draw.rectangle([50, 30, 174, 224], fill=(100, 110, 125))
    # Window grid
    for y in range(45, 210, 16):
        for x in range(60, 165, 18):
            draw.rectangle([x, y, x + 10, y + 10], fill=(255, 255, 200))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


def _create_landscape_image() -> bytes:
    """Generate an outdoor landscape with blue sky, mountain peaks, and green ground."""
    img = Image.new("RGB", (224, 224), color=(135, 206, 235))
    draw = ImageDraw.Draw(img)
    # Mountains
    draw.polygon([(0, 150), (70, 70), (140, 150)], fill=(120, 120, 130))
    draw.polygon([(90, 150), (160, 85), (224, 150)], fill=(100, 100, 110))
    # Ground
    draw.rectangle([0, 150, 224, 224], fill=(60, 140, 60))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


def _create_noise_image() -> bytes:
    """Generate uniform random RGB noise."""
    rng = np.random.default_rng(seed=42)
    noise_arr = rng.integers(0, 256, (224, 224, 3), dtype=np.uint8)
    img = Image.fromarray(noise_arr)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def _get_real_pet_image(animal_type: str = "dog") -> Path:
    """Locates a real pet image from data/processed if present."""
    plural = "dogs" if animal_type == "dog" else "cats"
    sample_dir = PROJECT_ROOT / "data" / "processed" / "train" / plural
    if sample_dir.exists():
        candidates = list(sample_dir.glob("*.jpg"))
        if candidates:
            return candidates[0]
    return None


# -------------------------------------------------------------
# Unit Tests: OOD Detector Module
# -------------------------------------------------------------

def test_ood_real_pets_accepted():
    """Verify that genuine cat and dog samples pass the OOD screening."""
    dog_path = _get_real_pet_image("dog")
    cat_path = _get_real_pet_image("cat")

    if dog_path and dog_path.exists():
        dog_res = validate_image_is_cat_or_dog(dog_path)
        assert dog_res["is_cat_or_dog"] is True, f"Real dog falsely rejected: {dog_res}"
        assert dog_res["cat_dog_score"] >= 0.15

    if cat_path and cat_path.exists():
        cat_res = validate_image_is_cat_or_dog(cat_path)
        assert cat_res["is_cat_or_dog"] is True, f"Real cat falsely rejected: {cat_res}"
        assert cat_res["cat_dog_score"] >= 0.15


def test_ood_car_rejected():
    """Verify vehicles are cleanly rejected."""
    car_bytes = _create_car_image()
    res = validate_image_is_cat_or_dog(car_bytes)
    assert res["is_cat_or_dog"] is False
    assert res["cat_dog_score"] < 0.15


def test_ood_human_portrait_rejected():
    """Verify human portraits are cleanly rejected."""
    portrait_bytes = _create_human_portrait_image()
    res = validate_image_is_cat_or_dog(portrait_bytes)
    assert res["is_cat_or_dog"] is False
    assert res["cat_dog_score"] < 0.15


def test_ood_food_rejected():
    """Verify food items are cleanly rejected."""
    food_bytes = _create_food_image()
    res = validate_image_is_cat_or_dog(food_bytes)
    assert res["is_cat_or_dog"] is False
    assert res["cat_dog_score"] < 0.15


def test_ood_building_rejected():
    """Verify architectural structures are cleanly rejected."""
    bldg_bytes = _create_building_image()
    res = validate_image_is_cat_or_dog(bldg_bytes)
    assert res["is_cat_or_dog"] is False
    assert res["cat_dog_score"] < 0.15


def test_ood_landscape_rejected():
    """Verify outdoor landscapes are cleanly rejected."""
    landscape_bytes = _create_landscape_image()
    res = validate_image_is_cat_or_dog(landscape_bytes)
    assert res["is_cat_or_dog"] is False
    assert res["cat_dog_score"] < 0.15


def test_ood_noise_rejected():
    """Verify random noise is cleanly rejected."""
    noise_bytes = _create_noise_image()
    res = validate_image_is_cat_or_dog(noise_bytes)
    assert res["is_cat_or_dog"] is False
    assert res["cat_dog_score"] < 0.15


# -------------------------------------------------------------
# End-to-End Pipeline & Prediction Contract Tests
# -------------------------------------------------------------

def test_predict_image_rejected_payload_integrity():
    """
    Verify that predict_image NEVER outputs 'cat' or 'dog' for a rejected image,
    and returns exact required message and null confidence.
    """
    car_bytes = _create_car_image()
    result = predict_image(car_bytes)

    assert result["is_supported"] is False
    assert result["prediction"] == "UNSUPPORTED"
    assert result["prediction"] not in ["cat", "dog", "CAT", "DOG"]
    assert result["confidence"] is None
    assert result["probabilities"] is None
    assert "Unsupported Image" in result["message"]
    assert "Please upload a photograph of a cat or dog." in result["message"]
    assert "ood_metrics" in result


def test_api_predict_rejection_endpoint():
    """
    Verify POST /api/predict returns 200 with rejection metadata
    when a non-cat/non-dog image is submitted.
    """
    car_bytes = _create_car_image()
    response = client.post(
        "/api/predict",
        files={"image": ("test_car.jpg", car_bytes, "image/jpeg")},
        data={"threshold": 0.5}
    )
    assert response.status_code == 200
    data = response.json()

    assert data["is_supported"] is False
    assert data["prediction"] == "UNSUPPORTED"
    assert data["prediction"] not in ["cat", "dog", "CAT", "DOG"]
    assert data["confidence"] is None
    assert data["probabilities"] is None
    assert data["message"] == "Unsupported Image — Please upload a photograph of a cat or dog."
    assert "ood_metrics" in data
    assert data["ood_metrics"]["is_cat_or_dog"] is False


def test_api_predict_accepted_for_real_dog():
    """Verify POST /api/predict correctly accepts and classifies real dog image."""
    dog_path = _get_real_pet_image("dog")
    if not (dog_path and dog_path.exists()):
        pytest.skip("Local processed dogs dataset not present.")

    with open(dog_path, "rb") as f:
        img_bytes = f.read()

    response = client.post(
        "/api/predict",
        files={"image": ("real_dog.jpg", img_bytes, "image/jpeg")},
        data={"threshold": 0.5}
    )
    assert response.status_code == 200
    data = response.json()

    assert data["is_supported"] is True
    assert data["prediction"] in ["dog", "cat"]
    assert isinstance(data["confidence"], float)
    assert isinstance(data["probabilities"], dict)
    assert "dog" in data["probabilities"]
    assert "cat" in data["probabilities"]

