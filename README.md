# PAWVISION AI · Cat vs Dog Vision

> **"See the Difference. Let AI Decide."**  
> *Developed by Pranshu Shikhar & Team (Pranshu Shikhar, Rishabh Vaish, Ankit Raj, Kanika Rani, Ishita Goel)*

[![Pytest Suite](https://img.shields.io/badge/pytest-35%20passed-brightgreen.svg)](https://pytest.org)
[![Validation Accuracy](https://img.shields.io/badge/Validation%20Accuracy-98.55%25-teal.svg)](https://pawvision-ai.pages.dev)
[![Test Holdout](https://img.shields.io/badge/Test%20Holdout-99.00%25-blue.svg)](https://pawvision-ai.pages.dev)
[![Architecture](https://img.shields.io/badge/Model-MobileNetV2%20(2.26M%20params)-orange.svg)](https://keras.io)
[![FastAPI](https://img.shields.io/badge/FastAPI-v2.0.0-009688.svg)](https://fastapi.tiangolo.com)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-Live-F38020.svg)](https://pawvision-ai.pages.dev)

A production-grade Computer Vision and Machine Learning classification platform that differentiates canine and feline morphological characteristics with fine-tuned MobileNetV2 transfer learning and dual-stage Out-of-Distribution (OOD) screening.

- **Live Frontend**: [https://pawvision-ai.pages.dev](https://pawvision-ai.pages.dev)
- **Live Production Inference Backend**: [https://pawvision-ai-backend.onrender.com](https://pawvision-ai-backend.onrender.com)
- **Cloudflare Worker**: [https://pawvision-ai.26bcs10417.workers.dev](https://pawvision-ai.26bcs10417.workers.dev)

---

## 🏛️ System Architecture

```
User (Browser / Client SPA)
   │
   ▼
Cloudflare Pages (React 18 + Vite Production Build)
   │
   │  POST /api/predict (multipart/form-data: file + confidence_threshold)
   │  GET  /health or /api/health
   │  GET  /api/info
   │  GET  /api/model-info
   │  POST /api/feedback
   ▼
FastAPI Python Microservice (Uvicorn on Port 8000 / Render Cloud)
   │
   ├─► Stage 1: Photographic Integrity (format check, corrupt byte rejection, min 10x10 px)
   │
   ├─► Stage 2: Independent OOD Screening (ImageNet-1K Pretrained MobileNetV2)
   │     ├─► Valid domain: 143 Canidae & Felidae classes (indices 151..293)
   │     ├─► 857 open-domain categories (vehicles, human portraits, food, architecture, landscapes)
   │     └─► Rejects unrelated images with: "Unsupported Image — Please upload a photograph of a cat or dog."
   │
   ▼ (Verified feline/canine input only)
TensorFlow 2.15 CNN Checkpoint (models/dog_cat_cnn.keras)
   │
   ├─► MobileNetV2 Inverted Residual Bottlenecks (frozen backbone, 2.26M parameters)
   ├─► GlobalAveragePooling2D (1,280 pooled features)
   └─► Dense Linear Perceptron + Sigmoid Activation
   │
   ▼
Inference Response: { is_supported: true, prediction: "CAT"|"DOG", confidence, probabilities, processing_time_ms }
```

---

## 🏆 Verified Model Metrics

| Metric | Measured Value | Evaluation Context |
| :--- | :--- | :--- |
| **Validation Accuracy** | **98.55%** | 3,942 / 4,000 correct on Kaggle validation partition |
| **Test Holdout Accuracy** | **99.00%** | Independent 1,000 holdout test images |
| **Validation Loss** | **0.0409** | Binary Cross-Entropy loss |
| **Precision** | **97.50%** | TP / (TP + FP) on canine predictions |
| **Recall / Sensitivity**| **99.65%** | TP / (TP + FN) on actual canines |
| **F1 Score** | **98.57%** | Harmonic mean of precision and recall |
| **Inference Latency** | **~25–45 ms** | Standard single-core CPU execution time |
| **Model Parameters** | **2,259,265** | 2.26M parameters (depthwise separable convolutions) |

---

## ⚡ FastAPI Backend Specification

### Verified API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` / `/api/health` | Service health status, model load verification, and memory check |
| `GET` | `/api/info` | Platform identity, version, tagline, and development team credits |
| `GET` | `/api/model-info` | Verified MobileNetV2 topology, parameters, loss function, and metrics |
| `POST` | `/api/predict` | Multipart image classification with OOD screening and latency timing |
| `POST` | `/api/feedback` | Research feedback submission (rating, category, comments) |
| `GET` | `/api/dataset-stats` | Ingested Kaggle dataset telemetry and sample counts |
| `GET` | `/api/metrics` | Real evaluation metrics and training curve artifacts |
| `GET` | `/api/architecture` | Detailed layer specifications and tensor dimensions |

### Predict Response Schema (Supported Feline/Canine)
```json
{
  "success": true,
  "is_supported": true,
  "prediction": "DOG",
  "confidence": 0.9942,
  "probabilities": {
    "cat": 0.0058,
    "dog": 0.9942
  },
  "processing_time_ms": 32.4,
  "model": "MobileNetV2"
}
```

### Predict Response Schema (Out-of-Distribution Rejected)
```json
{
  "success": true,
  "is_supported": false,
  "status": "UNSUPPORTED_IMAGE",
  "prediction": "UNSUPPORTED",
  "message": "Unsupported Image — Please upload a photograph of a cat or dog.",
  "detected_category": "sports car",
  "processing_time_ms": 18.2
}
```

---

## 🛠️ Local Development & Quick Start

### 1. Prerequisites
- **Python**: 3.10+ (tested on Python 3.11)
- **Node.js**: 18+ (tested on Node 20)

### 2. Backend Setup
```bash
# Clone the repository
git clone https://github.com/PRANSHUSHIKHAR1/AILAB.git
cd AILAB

# Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Launch FastAPI server
python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Frontend Setup
```bash
# Install Node modules
npm install

# Run local development server
npm run dev

# Run frontend tests
npm test

# Build production bundle
npm run build
```

---

## 🧪 Automated Testing

### Backend Pytest Suite
Run the comprehensive 35-test backend suite:
```bash
python -m pytest tests/ -v
```
Tests verify:
- Health check aliases (`/health` and `/api/health`)
- Application metadata (`/api/info`) and model specs (`/api/model-info`)
- Research feedback payload validation and JSON persistence (`/api/feedback`)
- Input validation, corrupt byte handling, and image decoding
- Dual-stage OOD screening rejection on cars, portraits, food, and landscapes
- Prediction latency reporting and decision threshold cutoff evaluation

---

## 👥 Research & Engineering Team

Developed by **Pranshu Shikhar & Team**:
- **Pranshu Shikhar** — Project Lead & Machine Learning Architecture
- **Rishabh Vaish** — Deep Learning Engineer
- **Ankit Raj** — Backend & API Engineer
- **Kanika Rani** — QA & Evaluation Specialist
- **Ishita Goel** — UI/UX & Research Analyst

---

## 📄 Citation (BibTeX)

```bibtex
@article{shikhar2024pawvision,
  title={PawVision AI: Canine and Feline Morphological Feature Discrimination Using Inverted Residual Convolutions},
  author={Shikhar, Pranshu and Vaish, Rishabh and Raj, Ankit and Rani, Kanika and Goel, Ishita},
  journal={Computer Vision Project Repository},
  year={2024},
  note={MobileNetV2 Architecture, 98.55% Validation Accuracy on Kaggle Benchmark}
}
```

---

## ⚖️ License & Ethical AI Safeguards

- **License**: MIT License
- **Truthful AI**: All performance metrics originate from empirical evaluation on real validation partitions. The application never invents mock scores when the backend model is connected. Non-pet imagery is transparently rejected via independent screening rather than forced into a binary classification.
