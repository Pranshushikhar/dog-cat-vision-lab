# PawVision AI | Canine & Feline Image Classification Research Lab

A portfolio-grade Machine Learning and Computer Vision system featuring:
- **Live Cloudflare Pages**: [https://pawvision-ai.pages.dev](https://pawvision-ai.pages.dev)
- **Live Production Inference Backend**: [https://palestinian-soccer-element-comparative.trycloudflare.com](https://palestinian-soccer-element-comparative.trycloudflare.com)
- **Cloudflare Worker**: [https://pawvision-ai.26bcs10417.workers.dev](https://pawvision-ai.26bcs10417.workers.dev)
- **Frontend**: Interactive "PawVision AI" laboratory deployed on **Cloudflare Pages**
- **Inference API**: **FastAPI** Python backend service
- **ML Engine**: **Convolutional Neural Network (CNN)** built with **TensorFlow / Keras**
- **Dataset**: Official **Kaggle Dogs vs Cats** competition benchmark
- **Scientific Integrity**: Absolutely zero fabricated predictions, metrics, or dataset counts

---

## 🏛️ System Architecture

```
User (Browser)
   │
   ▼
Cloudflare Pages (React + Vite Static SPA)
   │
   │  POST /api/predict (multipart/form-data)
   │  GET  /api/health
   │  GET  /api/dataset-stats
   │  GET  /api/metrics
   │  GET  /api/architecture
   ▼
FastAPI Python Service (Uvicorn on Port 8000)
   │
   ▼
TensorFlow CNN Checkpoint (models/dog_cat_cnn.keras)
   │
   ▼
Binary Classification Decision: DOG (1) or CAT (0)
```

---

## 📋 Requirements

- **Python**: 3.10+ (tested on Python 3.11.9)
- **Node.js**: 18+ (tested on Node 20.17.0)
- **Kaggle Account**: Required for downloading the Dogs vs Cats dataset

---

## 🔑 Kaggle Dataset Authentication & Download

### 1. Kaggle Authentication Setup
To download the official Kaggle dataset automatically:
1. Log in to [Kaggle](https://www.kaggle.com).
2. Go to **Account Settings** (`https://www.kaggle.com/settings`).
3. Scroll down to the **API** section and click **Create New Token**.
4. Save the downloaded `kaggle.json` to your user profile:
   - **Windows**: `C:\Users\<YourUsername>\.kaggle\kaggle.json`
   - **Linux / macOS**: `~/.kaggle/kaggle.json`

Alternatively, set your credentials as environment variables:
```powershell
$env:KAGGLE_USERNAME = "your_kaggle_username"
$env:KAGGLE_KEY = "your_kaggle_api_key"
```

Also accept the competition rules at:
`https://www.kaggle.com/c/dogs-vs-cats/rules`

### 2. Download Dataset Automatically
Run the download script:
```bash
python scripts/download_dataset.py
```
> **Note on Academic Integrity**: If Kaggle credentials are not configured, the script does **not** fake the dataset or invent images. It outputs:
> `"Kaggle authentication required to download the Dogs vs Cats dataset."` with guided steps.

### 3. Validate & Process Dataset
Run the automated validation, corruption check, and splitting script:
```bash
python scripts/setup_dataset.py
```
This script:
- Verifies image integrity and detects any corrupted files.
- Separates classes by filename prefix (`dog.*` vs `cat.*`).
- Generates reproducible 80/20 train/validation splits in `data/processed/`.
- Computes actual dimensions, counts, and saves `dataset_metadata.json`.

---

## 🧠 CNN Training & Evaluation

### One-Command Pipeline
To validate the dataset, train the CNN, evaluate on test samples, and generate visual charts:
```bash
python run_pipeline.py
```

### Manual Step-by-Step Training

#### Step A: Train the CNN
```bash
python ml/train.py --epochs 15 --batch-size 32 --lr 0.0001
```
- Trains the 3-block convolutional network with ReLU and MaxPooling.
- Saves the best checkpoint to `models/dog_cat_cnn.keras`.
- Generates actual training accuracy and loss curves in `ml/results/training_curves.png`.

#### Step B: Evaluate the Model
```bash
python ml/evaluate.py
```
- Calculates real **Accuracy**, **Precision**, **Recall**, and **F1 Score**.
- Plots real **Confusion Matrix** to `ml/results/confusion_matrix.png`.
- Writes real quantitative metrics to `ml/results/metrics.json`.

---

## ⚡ Running the FastAPI Backend

Start the inference server:
```bash
python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000 --reload
```

### API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check reporting whether model weights are loaded |
| `POST` | `/api/predict` | Multipart image upload returning `{ prediction, confidence, probabilities }` |
| `GET` | `/api/dataset-stats` | Ingested Kaggle dataset statistics from `dataset_metadata.json` |
| `GET` | `/api/metrics` | Real evaluation metrics and chart URLs from `metrics.json` |
| `GET` | `/api/architecture` | Actual model layer specifications and parameter counts |
| `GET` | `/api/samples` | Real sample images from dataset |

If inference is requested before training, `/api/predict` returns:
```json
{
  "error": "MODEL_NOT_TRAINED",
  "message": "The CNN model has not been trained yet. Please execute 'python run_pipeline.py' or 'python ml/train.py'."
}
```

---

## 🌐 Running the React Frontend

### 1. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `VITE_CLASSIFIER_API_URL` points to your backend (default `http://127.0.0.1:8000`).

### 2. Install & Start Frontend
```bash
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Cloudflare Pages
```bash
npm run build
```
- **Output directory**: `dist/`
- **Cloudflare Build Command**: `npm run build`
- **Framework**: `Vite`

---

## 🧪 Automated Testing

Run the test suite with `pytest`:
```bash
pytest tests/ -v
```

Tests cover:
- Kaggle credential detection & auth warning
- Image preprocessing & tensor standardization (224×224×3)
- Model architecture metadata extraction
- Missing model safeguard (`MODEL_NOT_TRAINED` error handling)
- FastAPI `/api/health`, `/api/dataset-stats`, `/api/metrics`, `/api/architecture`
- Non-image upload rejection (`HTTP 415`)

---

## 📂 Project Structure

```
AILAB/
├── backend/
│   └── app.py                  # FastAPI inference & metadata server
├── ml/
│   ├── model.py                # CNN topology & architecture metadata
│   ├── dataset.py              # tf.data preprocessing & augmentation
│   ├── train.py                # Training loop, callbacks & curve plots
│   ├── evaluate.py             # Accuracy, precision, recall & confusion matrix
│   ├── predict.py              # Single-image inference engine
│   └── results/                # Real metrics.json and training charts
├── scripts/
│   ├── download_dataset.py     # Automated Kaggle downloader with auth detection
│   └── setup_dataset.py        # Dataset validation, splitting & metadata catalog
├── tests/
│   ├── test_dataset.py         # Tests for dataset & preprocessing
│   ├── test_model.py           # Tests for model topology & safeguards
│   └── test_api.py             # Tests for FastAPI endpoints & error states
├── data/
│   ├── raw/                    # Downloaded Kaggle files (gitignored)
│   └── processed/              # Verified train/val splits (gitignored)
├── models/
│   └── dog_cat_cnn.keras       # Trained model weights (gitignored)
├── src/                        # React + Vite frontend source code
├── public/                     # Public static assets & sample specimens
├── run_pipeline.py             # One-command complete ML pipeline
├── dataset_metadata.json       # Ingested dataset telemetry
├── requirements.txt            # Python dependencies
├── package.json                # Frontend dependencies
├── vite.config.js              # Vite bundler configuration
└── README.md
```

---

## ⚖️ Scientific Integrity & Truthful AI

This project strictly adheres to research and portfolio honesty:
1. **Never Fakes Predictions**: Every prediction returned by `/api/predict` is calculated by the trained CNN. If weights are missing, it returns `MODEL_NOT_TRAINED`.
2. **Never Invents Metrics**: Accuracy, Precision, Recall, and Loss are initialized to `Awaiting trained model metrics` until real evaluation is executed.
3. **Never Fakes Datasets**: If Kaggle credentials are not provided, dataset download halts honestly with `Kaggle authentication required`.
4. **Explicit Demo Mode**: A client-side simulated pipeline is available only if explicitly enabled with the prominent banner: `"DEMO MODE — NOT REAL MODEL INFERENCE"`.
