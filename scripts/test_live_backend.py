import requests

BASE_URL = "https://palestinian-soccer-element-comparative.trycloudflare.com"

print(f"=== Testing Backend at {BASE_URL} ===")

# 1. Health check
health_res = requests.get(
    f"{BASE_URL}/api/health",
    headers={"Origin": "https://pawvision-ai.pages.dev"}
)
print("Health Status Code:", health_res.status_code)
print("Health Response JSON:", health_res.json())
print("CORS Allow-Origin:", health_res.headers.get("access-control-allow-origin"))
print("CORS Allow-Credentials:", health_res.headers.get("access-control-allow-credentials"))

# 2. Cat prediction
with open("data/processed/train/cats/cat.0.jpg", "rb") as f:
    cat_files = {"image": ("cat.0.jpg", f, "image/jpeg")}
    cat_res = requests.post(
        f"{BASE_URL}/api/predict",
        files=cat_files,
        data={"threshold": 0.5},
        headers={"Origin": "https://pawvision-ai.pages.dev"}
    )
print("\n--- Cat Prediction ---")
print("Status Code:", cat_res.status_code)
print("Result JSON:", cat_res.json())

# 3. Dog prediction
with open("data/processed/train/dogs/dog.0.jpg", "rb") as f:
    dog_files = {"image": ("dog.0.jpg", f, "image/jpeg")}
    dog_res = requests.post(
        f"{BASE_URL}/api/predict",
        files=dog_files,
        data={"threshold": 0.5},
        headers={"Origin": "https://pawvision-ai.pages.dev"}
    )
print("\n--- Dog Prediction ---")
print("Status Code:", dog_res.status_code)
print("Result JSON:", dog_res.json())

# 4. Dataset stats
stats_res = requests.get(
    f"{BASE_URL}/api/dataset-stats",
    headers={"Origin": "https://pawvision-ai.pages.dev"}
)
print("\n--- Dataset Stats ---")
print("Status Code:", stats_res.status_code)
print("Stats JSON:", stats_res.json())

# 5. Architecture
arch_res = requests.get(
    f"{BASE_URL}/api/architecture",
    headers={"Origin": "https://pawvision-ai.pages.dev"}
)
print("\n--- Architecture ---")
print("Status Code:", arch_res.status_code)
print("Model Name:", arch_res.json().get("model_name"))
