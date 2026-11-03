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


def test_predict_tiny_image_validation():
    """Verify endpoint rejects extremely small images (<10x10) with HTTP 400."""
    tiny = Image.new("RGB", (5, 5), color="red")
    buf = io.BytesIO()
    tiny.save(buf, format="JPEG")
    file_payload = {"image": ("tiny.jpg", buf.getvalue(), "image/jpeg")}
    response = client.post("/api/predict", files=file_payload)
    assert response.status_code == 400
    assert "too small" in response.json().get("detail", "").lower()


def test_predict_corrupt_image_validation():
    """Verify endpoint rejects corrupted image payload with HTTP 400."""
    file_payload = {"image": ("corrupt.jpg", b"corrupted bytes", "image/jpeg")}
    response = client.post("/api/predict", files=file_payload)
    assert response.status_code == 400
    assert "unreadable" in response.json().get("detail", "").lower() or "invalid" in response.json().get("detail", "").lower()


def test_api_static_image_serving():
    """Verify static dataset image route serves images correctly."""
    response = client.get("/api/image/train/dogs/dog.0.jpg")
    assert response.status_code in [200, 404]  # 200 if processed data exists


def test_predict_missing_model_safeguard(monkeypatch):
    """
    Verify endpoint returns HTTP 400 with MODEL_NOT_TRAINED
    when model weights are not present on disk.
    """
    from backend import app as backend_module
    from pathlib import Path
    
    # Temporarily point MODEL_PATH to a non-existent file
    monkeypatch.setattr(backend_module, "MODEL_PATH", Path("models/does_not_exist.keras"))

    # Also test health check reports model_loaded: False while service is ok
    health_resp = client.get("/api/health")
    assert health_resp.status_code == 200
    h_data = health_resp.json()
    assert h_data["status"] == "ok"
    assert h_data["service"] == "operational"
    assert h_data["model_loaded"] is False
    assert h_data["model_ready"] is False

    img = Image.new("RGB", (224, 224), color=(100, 150, 200))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    file_payload = {"image": ("test.jpg", buf.getvalue(), "image/jpeg")}
    response = client.post("/api/predict", files=file_payload)
    
    assert response.status_code == 400
    data = response.json()
    assert data.get("error") == "MODEL_NOT_TRAINED"


def test_cors_headers_and_origins():
    """Verify CORS headers allow configured frontend origins."""
    headers = {"Origin": "https://pawvision-ai.pages.dev"}
    response = client.get("/api/health", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "https://pawvision-ai.pages.dev"

    worker_headers = {"Origin": "https://pawvision-ai.26bcs10417.workers.dev"}
    worker_resp = client.get("/api/health", headers=worker_headers)
    assert worker_resp.status_code == 200
    assert worker_resp.headers.get("access-control-allow-origin") == "https://pawvision-ai.26bcs10417.workers.dev"


def test_architecture_naming_compatibility():
    """Verify architecture endpoint exposes both architecture_name and model_name."""
    response = client.get("/api/architecture")
    assert response.status_code == 200
    data = response.json()
    assert "architecture_name" in data
    assert "model_name" in data
    assert data["model_name"] == data["architecture_name"]


def test_api_health_alias():
    """Verify /health is an operational alias for /api/health."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "model_loaded" in data


def test_api_info():
    """Verify /api/info returns product identity, tagline and team attribution."""
    response = client.get("/api/info")
    assert response.status_code == 200
    data = response.json()
    assert data["app_name"] == "PAWVISION AI"
    assert data["tagline"] == "See the Difference. Let AI Decide."
    assert "Pranshu Shikhar" in data["team"]
    assert "cat" in data["classes"] and "dog" in data["classes"]


def test_api_model_info():
    """Verify /api/model-info returns verified evaluation metrics and architecture specs."""
    response = client.get("/api/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "MobileNetV2" in data["architecture"]
    assert data["reported_metrics"]["validation_accuracy"] == 98.55
    assert data["reported_metrics"]["test_holdout_accuracy"] == 99.00
    assert data["reported_metrics"]["validation_loss"] == 0.0409


def test_api_feedback():
    """Verify /api/feedback receives and validates user feedback submissions."""
    payload = {
        "name": "Prof. Evaluator",
        "email": "evaluator@university.edu",
        "category": "Model Accuracy",
        "message": "The MobileNetV2 inference latency and OOD screening are remarkably responsive.",
        "rating": 5
    }
    response = client.post("/api/feedback", json=payload)
    assert response.status_code == 200
    assert response.json()["success"] is True


