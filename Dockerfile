# Production Dockerfile for PawVision AI FastAPI Inference Service
FROM python:3.11-slim

# Set working directory and environment variables
WORKDIR /app
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000 \
    TF_ENABLE_ONEDNN_OPTS=0

# Install system dependencies needed by Pillow and general build
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python production dependencies
COPY requirements-prod.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements-prod.txt

# Copy application code and model artifacts
COPY backend/ ./backend/
COPY ml/ ./ml/
COPY models/ ./models/
COPY dataset_metadata.json ./dataset_metadata.json

# Pre-verify that the CNN checkpoint is available
RUN python -c "from pathlib import Path; p = Path('models/dog_cat_cnn.keras'); assert p.exists(), f'Model missing at {p}'"

# Healthcheck to monitor container status
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:${PORT}/api/health || exit 1

# Expose port and start Uvicorn
EXPOSE 8000
CMD ["sh", "-c", "uvicorn backend.app:app --host 0.0.0.0 --port ${PORT}"]
