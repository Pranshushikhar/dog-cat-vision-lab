"""
tests/test_api.py

Integration tests for the FastAPI inference backend:
  - GET /api/health
  - GET /api/dataset-stats
  - GET /api/metrics
  - GET /api/architecture
  - GET /api/samples
  - POST /api/predict (missing model error, invalid image error)
"""

import io
import pytest
from fastapi.testclient import TestClient
from backend.app import app
from PIL import Image

client = TestClient(app)


def test_api_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "endpoints" in response.json()


def test_api_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "model_loaded" in data


def test_api_dataset_stats():
    response = client.get("/api/dataset-stats")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data


def test_api_metrics():
    response = client.get("/api/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data


def test_api_architecture():
    response = client.get("/api/architecture")
    assert response.status_code == 200
    data = response.json()
    assert "layers" in data
    assert data["input_shape"] == [224, 224, 3]


def test_api_samples():
    response = client.get("/api/samples")
    assert response.status_code == 200
    data = response.json()
    assert "dogs" in data
    assert "cats" in data


def test_predict_invalid_file_type():
    """Verify endpoint rejects non-image uploads with HTTP 415."""
    file_payload = {"image": ("test.txt", b"plain text content", "text/plain")}
    response = client.post("/api/predict", files=file_payload)
    assert response.status_code in [400, 415]


def test_predict_missing_model_safeguard(monkeypatch):
    """
    Verify endpoint returns HTTP 400 with MODEL_NOT_TRAINED
    when model weights are not present on disk.
    """
    from backend import app as backend_module
    from pathlib import Path
    
    # Temporarily point MODEL_PATH to a non-existent file
    monkeypatch.setattr(backend_module, "MODEL_PATH", Path("models/does_not_exist.keras"))

    img = Image.new("RGB", (224, 224), color=(100, 150, 200))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    file_payload = {"image": ("test.jpg", buf.getvalue(), "image/jpeg")}
    response = client.post("/api/predict", files=file_payload)
    
    assert response.status_code == 400
    data = response.json()
    assert data.get("error") == "MODEL_NOT_TRAINED"
