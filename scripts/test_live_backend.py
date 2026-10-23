import os
import sys
import requests

def test_backend(base_url: str):
    base_url = base_url.rstrip("/")
    print(f"\n==================================================")
    print(f"Testing Backend at: {base_url}")
    print(f"==================================================")

    # 1. Health check
    print("\n[1/5] Testing GET /api/health ...")
    health_res = requests.get(
        f"{base_url}/api/health",
        headers={"Origin": "https://pawvision-ai.pages.dev"},
        timeout=30
    )
    print("Health Status Code:", health_res.status_code)
    print("Health Response JSON:", health_res.json())
    print("CORS Allow-Origin:", health_res.headers.get("access-control-allow-origin"))
    assert health_res.status_code == 200, f"Health check failed with {health_res.status_code}"
    health_data = health_res.json()
    assert health_data.get("status") == "ok", "Status is not ok"
    assert health_data.get("model_loaded") is True, "Model is not loaded on backend"

    # 2. Cat prediction
    print("\n[2/5] Testing POST /api/predict with real Cat image ...")
    with open("data/processed/train/cats/cat.0.jpg", "rb") as f:
        cat_files = {"image": ("cat.0.jpg", f, "image/jpeg")}
        cat_res = requests.post(
            f"{base_url}/api/predict",
            files=cat_files,
            data={"threshold": 0.5},
            headers={"Origin": "https://pawvision-ai.pages.dev"},
            timeout=30
        )
    print("Cat Status Code:", cat_res.status_code)
    print("Cat Result JSON:", cat_res.json())
    assert cat_res.status_code == 200, f"Cat prediction failed: {cat_res.text}"
    cat_data = cat_res.json()
    assert "prediction" in cat_data, "Missing prediction in response"
    assert cat_data.get("prediction") == "cat", f"Expected cat, got {cat_data.get('prediction')}"
    assert cat_data.get("confidence") >= 0.5, "Confidence below 0.5"
    print(f"-> Predicted: {cat_data.get('prediction')} (Confidence: {cat_data.get('confidence'):.4f})")

    # 3. Dog prediction
    print("\n[3/5] Testing POST /api/predict with real Dog image ...")
    with open("data/processed/train/dogs/dog.0.jpg", "rb") as f:
        dog_files = {"image": ("dog.0.jpg", f, "image/jpeg")}
        dog_res = requests.post(
            f"{base_url}/api/predict",
            files=dog_files,
            data={"threshold": 0.5},
            headers={"Origin": "https://pawvision-ai.pages.dev"},
            timeout=30
        )
    print("Dog Status Code:", dog_res.status_code)
    print("Dog Result JSON:", dog_res.json())
    assert dog_res.status_code == 200, f"Dog prediction failed: {dog_res.text}"
    dog_data = dog_res.json()
    assert "prediction" in dog_data, "Missing prediction in response"
    assert dog_data.get("prediction") == "dog", f"Expected dog, got {dog_data.get('prediction')}"
    assert dog_data.get("confidence") >= 0.5, "Confidence below 0.5"
    print(f"-> Predicted: {dog_data.get('prediction')} (Confidence: {dog_data.get('confidence'):.4f})")

    # 4. Dataset stats
    print("\n[4/5] Testing GET /api/dataset-stats ...")
    stats_res = requests.get(
        f"{base_url}/api/dataset-stats",
        headers={"Origin": "https://pawvision-ai.pages.dev"},
        timeout=30
    )
    print("Stats Status Code:", stats_res.status_code)
    print("Stats JSON:", stats_res.json())

    # 5. Architecture
    print("\n[5/5] Testing GET /api/architecture ...")
    arch_res = requests.get(
        f"{base_url}/api/architecture",
        headers={"Origin": "https://pawvision-ai.pages.dev"},
        timeout=30
    )
    print("Architecture Status Code:", arch_res.status_code)
    print("Model Name:", arch_res.json().get("model_name"))

    print("\n==================================================")
    print("ALL LIVE BACKEND CHECKS PASSED SUCCESSFULLY!")
    print("==================================================")
    return True

if __name__ == "__main__":
    target_url = sys.argv[1] if len(sys.argv) > 1 else os.getenv("BACKEND_URL")
    if not target_url:
        print("Usage: python scripts/test_live_backend.py <URL>")
        sys.exit(1)
    test_backend(target_url)
