"""
backend/app.py

FastAPI Inference and Metadata Backend for Dog vs Cat Image Classification.
Provides:
  - POST /api/predict (Multipart image classification using trained CNN)
  - GET /api/health (System status and model weight detection)
  - GET /api/dataset-stats (Real dataset statistics from Kaggle ingestion)
  - GET /api/metrics (Real evaluation metrics and chart URLs)
  - GET /api/architecture (Actual model layer structure and parameters)
  - GET /api/samples (Real dataset sample references)
"""

import os
import sys
import json
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

# Environment-configurable production paths
MODEL_PATH = Path(os.environ.get("MODEL_PATH", str(PROJECT_ROOT / "models" / "dog_cat_cnn.keras")))
METADATA_PATH = Path(os.environ.get("METADATA_PATH", str(PROJECT_ROOT / "dataset_metadata.json")))
METRICS_PATH = Path(os.environ.get("METRICS_PATH", str(PROJECT_ROOT / "ml" / "results" / "metrics.json")))
RESULTS_DIR = Path(os.environ.get("RESULTS_DIR", str(PROJECT_ROOT / "ml" / "results")))
PROCESSED_DIR = Path(os.environ.get("PROCESSED_DIR", str(PROJECT_ROOT / "data" / "processed")))


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pre-warm model on startup to eliminate cold-start delay
    if MODEL_PATH.exists():
        try:
            from ml.predict import get_inference_model
            print(f"[Lifespan] Pre-warming CNN model from {MODEL_PATH}...")
            get_inference_model(MODEL_PATH)
            print("[Lifespan] Model pre-loaded and ready for real-time inference.")
        except Exception as e:
            print(f"[Lifespan] Warning during pre-warming: {e}")
    yield


app = FastAPI(
    title="PawVision AI - CNN Inference API",
    description="Real machine learning inference backend powered by a Convolutional Neural Network.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Cloudflare Pages, Workers, Render, and local development
ALLOWED_ORIGINS = [
    "https://pawvision-ai.pages.dev",
    "https://pawvision-ai.26bcs10417.workers.dev",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"^https:\/\/([a-zA-Z0-9-]+\.)*(pages\.dev|workers\.dev|onrender\.com)$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Mount static files for dataset images securely if processed folder exists
if PROCESSED_DIR.exists():
    app.mount("/api/image", StaticFiles(directory=str(PROCESSED_DIR)), name="image")


@app.get("/")
def read_root():
    return {
        "service": "PawVision AI CNN Inference Service",
        "endpoints": [
            "GET /api/health",
            "POST /api/predict",
            "GET /api/dataset-stats",
            "GET /api/metrics",
            "GET /api/architecture",
            "GET /api/samples",
            "GET /api/image/{split}/{class_name}/{filename}"
        ]
    }


@app.get("/api/health")
def get_health():
    """
    Backend Health Check:
    Reports whether backend is operational and whether trained CNN weights are present.
    """
    model_exists = MODEL_PATH.exists()
    return {
        "status": "ok",
        "model_loaded": model_exists,
        "model": "dog_cat_cnn" if model_exists else None,
        "model_path": str(MODEL_PATH) if model_exists else None
    }


@app.post("/api/predict")
async def predict_endpoint(
    image: UploadFile = File(...),
    threshold: float = Form(0.5)
):
    """
    Classify an uploaded image as 'dog' or 'cat' using the trained CNN.
    Enforces strict honesty: if the model is not trained, returns HTTP 400 'MODEL_NOT_TRAINED'.
    """
    if not MODEL_PATH.exists():
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "error": "MODEL_NOT_TRAINED",
                "message": "The CNN model has not been trained yet. Please execute 'python run_pipeline.py' or 'python ml/train.py' to generate the model checkpoint.",
                "model_path": str(MODEL_PATH)
            }
        )

    # Validate file type
    if not (image.content_type and image.content_type.startswith("image/")):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type: {image.content_type}. Please upload a JPEG, PNG, or WebP image."
        )

    try:
        from ml.predict import predict_image
        contents = await image.read()
        if len(contents) > 15 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Uploaded image exceeds 15MB maximum file size limit."
            )
        result = predict_image(contents, threshold=threshold, model_path=MODEL_PATH)
        return result
    except FileNotFoundError:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": "MODEL_NOT_TRAINED", "message": "Model checkpoint not found."}
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {str(e)}"
        )


@app.get("/api/dataset-stats")
def get_dataset_stats():
    """Returns actual dataset statistics from dataset_metadata.json if available."""
    if METADATA_PATH.exists():
        try:
            with open(METADATA_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
            return data
        except Exception as e:
            return {"connected": False, "status": "ERROR_READING_METADATA", "detail": str(e)}

    return {
        "connected": False,
        "status": "DATA_NOT_CONNECTED",
        "message": "Dataset statistics will appear when the training metadata is connected."
    }


@app.get("/api/metrics")
def get_metrics():
    """Returns actual evaluation metrics from ml/results/metrics.json if available."""
    if METRICS_PATH.exists():
        try:
            with open(METRICS_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
            return data
        except Exception as e:
            return {"connected": False, "status": "ERROR_READING_METRICS", "detail": str(e)}

    return {
        "connected": False,
        "status": "METRICS_NOT_AVAILABLE",
        "message": "Model performance metrics awaiting trained model evaluation."
    }


@app.get("/api/architecture")
def get_architecture():
    """Returns the actual layer structure and parameters of the CNN."""
    from ml.model import get_architecture_metadata, load_model_if_exists
    model = load_model_if_exists(MODEL_PATH)
    return get_architecture_metadata(model)


@app.get("/api/samples")
def get_samples():
    """
    Returns real sample images from the Kaggle dataset if processed,
    or falls back to built-in benchmark specimen references.
    """
    dog_samples = []
    cat_samples = []

    # Check for real Kaggle dataset files in processed
    if PROCESSED_DIR.exists():
        train_dogs = list((PROCESSED_DIR / "train" / "dogs").glob("*.jpg"))[:4]
        train_cats = list((PROCESSED_DIR / "train" / "cats").glob("*.jpg"))[:4]

        if train_dogs and train_cats:
            for d in train_dogs:
                dog_samples.append({
                    "id": d.stem,
                    "name": f"Kaggle {d.name}",
                    "class": "dog",
                    "url": f"/api/image/train/dogs/{d.name}"
                })
            for c in train_cats:
                cat_samples.append({
                    "id": c.stem,
                    "name": f"Kaggle {c.name}",
                    "class": "cat",
                    "url": f"/api/image/train/cats/{c.name}"
                })
            return {"source": "KAGGLE_DATASET", "dogs": dog_samples, "cats": cat_samples}

    return {
        "source": "BUILTIN_BENCHMARK_SPECIMENS",
        "dogs": [
            {"id": "dog-01", "name": "Dog Specimen 01", "class": "dog", "url": "/samples/sample_dog_1.svg"},
            {"id": "dog-02", "name": "Dog Specimen 02", "class": "dog", "url": "/samples/sample_dog_2.svg"}
        ],
        "cats": [
            {"id": "cat-01", "name": "Cat Specimen 01", "class": "cat", "url": "/samples/sample_cat_1.svg"},
            {"id": "cat-02", "name": "Cat Specimen 02", "class": "cat", "url": "/samples/sample_cat_2.svg"}
        ]
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.app:app", host="127.0.0.1", port=port, reload=True)
