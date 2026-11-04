/**
 * Classifier Service & Backend Integration Abstraction
 * 
 * Communicates with the FastAPI backend (/api/predict, /api/health, /api/dataset-stats, /api/metrics, /api/architecture).
 * Strictly enforces truthfulness:
 *  - No fake predictions
 *  - Handles 'MODEL SERVICE OFFLINE'
 *  - Handles 'MODEL_NOT_TRAINED'
 *  - Retains labeled DEMO MODE only as an explicit toggle for UI review
 */

export const PRODUCTION_BACKEND_URL = 'https://pawvision-ai-backend.onrender.com';
export const LOCAL_BACKEND_URL = 'http://127.0.0.1:8000';
export const WORKER_BACKEND_URL = 'https://pawvision-ai.26bcs10417.workers.dev';

export const STORAGE_KEY_API_URL = 'pawvision_backend_url';
export const STORAGE_KEY_MODE = 'pawvision_classifier_mode';

/**
 * Safely normalize a backend API base URL:
 * - Trims whitespace
 * - Adds protocol (http:// for localhost, https:// for remote domains)
 * - Strips accidental /api/health, /api/predict, /api suffixes
 * - Strips trailing slashes
 */
export function normalizeBackendUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let url = rawUrl.trim().replace(/^["']|["']$/g, '');
  if (!url) return '';

  // Prepend protocol if omitted
  if (!/^https?:\/\//i.test(url)) {
    if (/^(localhost|127\.0\.0\.1)(:\d+)?/i.test(url)) {
      url = `http://${url}`;
    } else {
      url = `https://${url}`;
    }
  }

  // Remove common endpoint suffixes if user pasted a specific route
  url = url.replace(/\/api\/(health|predict|dataset-stats|metrics|architecture|samples)\/?$/i, '');
  url = url.replace(/\/api\/?$/i, '');

  // Strip trailing slashes
  url = url.replace(/\/+$/, '');

  return url;
}

/**
 * Fast client-side image downscaling for inference.
 * Downscales large photographs to max dimension 640px before network upload.
 * Reduces 5-10MB mobile uploads down to ~35KB, speeding up upload latency by 50x-100x.
 */
export async function optimizeImageForUpload(imageFile, maxDimension = 640, quality = 0.88) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return imageFile;
  }

  // If already small (< 150KB), send directly without re-encoding
  if (imageFile instanceof Blob && imageFile.size < 150 * 1024) {
    return imageFile;
  }

  return new Promise((resolve) => {
    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(imageFile);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        let { width, height } = img;

        // If already within bounds, return original
        if (width <= maxDimension && height <= maxDimension && imageFile.size < 300 * 1024) {
          resolve(imageFile);
          return;
        }

        // Scale preserving aspect ratio
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageFile);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < imageFile.size) {
              resolve(blob);
            } else {
              resolve(imageFile);
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(imageFile);
      };

      img.src = objectUrl;
    } catch (e) {
      resolve(imageFile);
    }
  });
}

export const CLASSIFIER_MODES = {
  REAL_API: 'REAL_API',
  DEMO_MODE: 'DEMO_MODE'
};

function getInitialApiUrl() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_API_URL);
    if (saved && saved.trim()) {
      return normalizeBackendUrl(saved);
    }
  } catch (e) {
    // localStorage might be disabled
  }

  const envUrl = typeof import.meta !== 'undefined' && import.meta?.env ? import.meta.env.VITE_CLASSIFIER_API_URL : undefined;
  if (envUrl && envUrl.trim()) {
    return normalizeBackendUrl(envUrl);
  }

  // Auto-detect local development: if hostname is localhost or 127.0.0.1, default to local port 8000
  if (typeof window !== 'undefined' && window.location && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return LOCAL_BACKEND_URL;
  }

  return PRODUCTION_BACKEND_URL;
}

function getInitialMode() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_MODE);
    if (saved && (saved === CLASSIFIER_MODES.REAL_API || saved === CLASSIFIER_MODES.DEMO_MODE)) {
      return saved;
    }
  } catch (e) {}
  return CLASSIFIER_MODES.REAL_API;
}

class ClassifierService {
  constructor() {
    this.apiUrl = getInitialApiUrl();
    this.mode = getInitialMode();
    this.listeners = new Set();
  }

  getApiUrl() {
    return this.apiUrl;
  }

  setApiUrl(url, persist = true) {
    const normalized = normalizeBackendUrl(url);
    this.apiUrl = normalized;
    if (persist) {
      try {
        if (normalized) {
          localStorage.setItem(STORAGE_KEY_API_URL, normalized);
        } else {
          localStorage.removeItem(STORAGE_KEY_API_URL);
        }
      } catch (e) {}
    }
    this.notifyListeners();
  }

  getMode() {
    return this.mode;
  }

  setMode(mode, persist = true) {
    this.mode = mode;
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY_MODE, mode);
      } catch (e) {}
    }
    this.notifyListeners();
  }

  resetToDefault() {
    this.setApiUrl(PRODUCTION_BACKEND_URL, true);
    this.setMode(CLASSIFIER_MODES.REAL_API, true);
  }

  isConfigured() {
    return Boolean(this.apiUrl && this.apiUrl.length > 0);
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    const state = {
      apiUrl: this.apiUrl,
      mode: this.mode,
      isConfigured: this.isConfigured()
    };
    this.listeners.forEach(cb => {
      try {
        cb(state);
      } catch (err) {
        console.error('[ClassifierService] Listener error:', err);
      }
    });
  }

  /**
   * Check backend health and model loading status
   */
  async checkEndpointHealth(url = this.apiUrl, timeoutMs = 20000) {
    const targetUrl = normalizeBackendUrl(url || this.apiUrl);
    if (!targetUrl) {
      return { 
        ok: false, 
        error: 'No endpoint URL configured. Please enter a valid backend URL.', 
        testedUrl: '' 
      };
    }

    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const endpoint = `${targetUrl}/api/health`;
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const latencyMs = Math.round(performance.now() - startTime);

      if (res.ok) {
        const data = await res.json();
        const modelLoaded = Boolean(data.model_loaded || data.model_ready);
        return { 
          ok: true, 
          status: res.status,
          data, 
          modelLoaded,
          modelReady: modelLoaded,
          latencyMs,
          testedUrl: targetUrl
        };
      }

      return { 
        ok: false, 
        status: res.status, 
        testedUrl: targetUrl,
        latencyMs,
        error: `HTTP ${res.status}: ${res.statusText || 'Endpoint returned error'}` 
      };
    } catch (err) {
      const latencyMs = Math.round(performance.now() - startTime);
      let errorMsg = err.message;
      if (err.name === 'AbortError') {
        errorMsg = `Connection timed out (${Math.round(timeoutMs / 1000)}s). Note: Render free tier services may take 30-60s to wake from cold sleep.`;
      } else if (err.name === 'TypeError' || err.message?.includes('Failed to fetch')) {
        errorMsg = `Unable to reach ${targetUrl}. Check internet connectivity, server availability, or CORS configuration.`;
      }
      return {
        ok: false,
        status: 0,
        testedUrl: targetUrl,
        latencyMs,
        error: errorMsg
      };
    }
  }

  /**
   * Fetch real dataset statistics from Kaggle ingestion
   */
  async fetchDatasetStats() {
    if (!this.apiUrl) return { connected: false, status: 'DATA_NOT_CONNECTED' };
    try {
      const res = await fetch(`${this.apiUrl.replace(/\/$/, '')}/api/dataset-stats`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      // Fallback check: look if static metadata exists
    }

    try {
      const staticRes = await fetch('/dataset_metadata.json');
      if (staticRes.ok) {
        return await staticRes.json();
      }
    } catch (e) {}

    return { connected: false, status: 'DATA_NOT_CONNECTED' };
  }

  /**
   * Fetch real evaluation metrics and charts
   */
  async fetchMetrics() {
    if (!this.apiUrl) return { connected: false, status: 'DATA_NOT_CONNECTED' };
    try {
      const res = await fetch(`${this.apiUrl.replace(/\/$/, '')}/api/metrics`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      // Fallback to static public metrics if backend is offline
    }

    try {
      const staticRes = await fetch('/metrics.json');
      if (staticRes.ok) {
        return await staticRes.json();
      }
    } catch (e) {}

    return { connected: false, status: 'DATA_NOT_CONNECTED' };
  }

  /**
   * Fetch actual architecture metadata
   */
  async fetchArchitecture() {
    if (!this.apiUrl) return { status: 'AWAITING_TRAINED_MODEL' };
    try {
      const res = await fetch(`${this.apiUrl.replace(/\/$/, '')}/api/architecture`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {}
    return { status: 'AWAITING_TRAINED_MODEL' };
  }

  /**
   * Fetch sample images
   */
  async fetchSamples() {
    if (!this.apiUrl) return null;
    try {
      const res = await fetch(`${this.apiUrl.replace(/\/$/, '')}/api/samples`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {}
    return null;
  }

  /**
   * Execute real image prediction via POST /api/predict
   */
  async predict(imageFile, options = {}) {
    const { confidenceThreshold = 0.5, forceDemo = false } = options;
    const startTime = performance.now();

    // Explicit labeled demo mode toggle
    if (this.mode === CLASSIFIER_MODES.DEMO_MODE || forceDemo) {
      return this._executeSimulatedPipeline(imageFile, confidenceThreshold, startTime);
    }

    // Real API Mode:
    if (!this.apiUrl) {
      return {
        success: false,
        isModelConnected: false,
        status: 'OFFLINE',
        error: 'MODEL SERVICE OFFLINE',
        message: 'The classifier backend is currently unavailable.'
      };
    }

    try {
      const formData = new FormData();
      if (imageFile instanceof Blob || imageFile instanceof File) {
        // Fast client-side optimization: downscales large uploads to 640px to eliminate network bottleneck
        const optimized = await optimizeImageForUpload(imageFile);
        formData.append('image', optimized, imageFile.name || 'upload.jpg');
      } else if (typeof imageFile === 'string') {
        // If sample URL, fetch blob first
        const blob = await fetch(imageFile).then(r => r.blob());
        const optimized = await optimizeImageForUpload(blob);
        formData.append('image', optimized, 'sample.jpg');
      }
      formData.append('threshold', String(confidenceThreshold));

      const endpoint = `${this.apiUrl.replace(/\/$/, '')}/api/predict`;
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      const endTime = performance.now();

      if (response.status === 400) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error === 'MODEL_NOT_TRAINED') {
          return {
            success: false,
            isModelConnected: false,
            status: 'MODEL_NOT_TRAINED',
            error: 'MODEL NOT TRAINED',
            message: 'Model weights not found. Execute "python run_pipeline.py" or "python ml/train.py" to train the CNN.'
          };
        }
      }

      if (!response.ok) {
        throw new Error(`Inference endpoint returned HTTP ${response.status} (${response.statusText})`);
      }

      const data = await response.json();

      // Independent OOD Screening Check
      const isSupported = data.is_supported !== false && data.prediction?.toUpperCase() !== 'UNSUPPORTED';

      if (!isSupported) {
        return {
          success: true,
          isModelConnected: true,
          isSupported: false,
          status: 'UNSUPPORTED_IMAGE',
          mode: CLASSIFIER_MODES.REAL_API,
          prediction: 'UNSUPPORTED',
          message: data.message || 'Unsupported Image — Please upload a photograph of a cat or dog.',
          confidence: null,
          rawProbabilities: null,
          detectedCategory: data.ood_metrics?.top1_label || 'Unrelated Object',
          oodMetrics: data.ood_metrics || null,
          processingTimeMs: Math.round(endTime - startTime),
          modelVersion: data.model_version || 'DogCat_CNN_v1_with_OOD_Guard',
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: true,
        isModelConnected: true,
        isSupported: true,
        status: 'CONNECTED',
        mode: CLASSIFIER_MODES.REAL_API,
        prediction: data.prediction ? data.prediction.toUpperCase() : 'UNKNOWN',
        confidence: data.confidence,
        rawProbabilities: data.probabilities || {
          dog: data.prediction?.toLowerCase() === 'dog' ? data.confidence : 1 - data.confidence,
          cat: data.prediction?.toLowerCase() === 'cat' ? data.confidence : 1 - data.confidence
        },
        oodMetrics: data.ood_metrics || null,
        processingTimeMs: Math.round(endTime - startTime),
        modelVersion: data.model_version || 'DogCat_CNN_v1',
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return {
        success: false,
        isModelConnected: false,
        status: 'OFFLINE',
        error: 'MODEL ENDPOINT OFFLINE',
        message: 'The classifier backend is currently unavailable.',
        detail: err.message
      };
    }
  }

  /**
   * Internal demo pipeline simulation (strictly labeled)
   */
  async _executeSimulatedPipeline(imageFile, threshold = 0.5, startTime) {
    // Ultra-snappy micro-delay for smooth UI animation
    await new Promise(resolve => setTimeout(resolve, 60));

    const lowerName = (imageFile?.name || (typeof imageFile === 'string' ? imageFile : '')).toLowerCase();
    const nonCatDogKeywords = ['car', 'vehicle', 'auto', 'truck', 'airplane', 'boat', 'person', 'human', 'man', 'woman', 'portrait', 'pizza', 'food', 'fruit', 'building', 'house', 'city', 'landscape', 'mountain', 'noise', 'unrelated'];
    const matchedKeyword = nonCatDogKeywords.find(kw => lowerName.includes(kw));

    if (matchedKeyword) {
      const endTime = performance.now();
      const capitalizedLabel = matchedKeyword.charAt(0).toUpperCase() + matchedKeyword.slice(1);
      return {
        success: true,
        isModelConnected: false,
        isDemoMode: true,
        isSupported: false,
        status: 'UNSUPPORTED_IMAGE',
        mode: CLASSIFIER_MODES.DEMO_MODE,
        warning: 'DEMO MODE — NOT REAL MODEL INFERENCE',
        prediction: 'UNSUPPORTED',
        message: 'Unsupported Image — Please upload a photograph of a cat or dog.',
        confidence: null,
        rawProbabilities: null,
        detectedCategory: capitalizedLabel,
        oodMetrics: {
          is_cat_or_dog: false,
          top1_label: capitalizedLabel,
          reason: `Simulated OOD screening: visual pattern aligns with '${capitalizedLabel}'.`
        },
        processingTimeMs: Math.round(endTime - startTime),
        timestamp: new Date().toISOString()
      };
    }

    let nameHash = 42;
    if (imageFile && imageFile.name) {
      for (let i = 0; i < imageFile.name.length; i++) {
        nameHash = (nameHash * 31 + imageFile.name.charCodeAt(i)) & 0xffffffff;
      }
    } else if (typeof imageFile === 'string') {
      for (let i = 0; i < imageFile.length; i++) {
        nameHash = (nameHash * 31 + imageFile.charCodeAt(i)) & 0xffffffff;
      }
    }

    const isDogLikely = Math.abs(nameHash) % 2 === 0;
    const baseConfidence = 0.84 + (Math.abs(nameHash) % 13) / 100;
    const endTime = performance.now();

    const prediction = isDogLikely ? 'DOG' : 'CAT';
    const dogProb = isDogLikely ? baseConfidence : (1 - baseConfidence);
    const catProb = isDogLikely ? (1 - baseConfidence) : baseConfidence;

    return {
      success: true,
      isModelConnected: false,
      isDemoMode: true,
      isSupported: true,
      mode: CLASSIFIER_MODES.DEMO_MODE,
      warning: 'DEMO MODE — NOT REAL MODEL INFERENCE',
      prediction,
      confidence: baseConfidence,
      rawProbabilities: {
        dog: parseFloat(dogProb.toFixed(4)),
        cat: parseFloat(catProb.toFixed(4))
      },
      processingTimeMs: Math.round(endTime - startTime),
      timestamp: new Date().toISOString()
    };
  }
}

export const classifierService = new ClassifierService();
