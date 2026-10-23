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

const DEFAULT_API_URL = (import.meta.env.VITE_CLASSIFIER_API_URL && !import.meta.env.VITE_CLASSIFIER_API_URL.includes('localhost') && !import.meta.env.VITE_CLASSIFIER_API_URL.includes('127.0.0.1'))
  ? import.meta.env.VITE_CLASSIFIER_API_URL
  : (import.meta.env.PROD ? PRODUCTION_BACKEND_URL : (import.meta.env.VITE_CLASSIFIER_API_URL || 'http://127.0.0.1:8000'));

export const CLASSIFIER_MODES = {
  REAL_API: 'REAL_API',
  DEMO_MODE: 'DEMO_MODE'
};

class ClassifierService {
  constructor() {
    this.apiUrl = DEFAULT_API_URL;
    this.mode = CLASSIFIER_MODES.REAL_API;
    this.listeners = new Set();
  }

  getApiUrl() {
    return this.apiUrl;
  }

  setApiUrl(url) {
    this.apiUrl = url ? url.trim() : '';
    this.notifyListeners();
  }

  getMode() {
    return this.mode;
  }

  setMode(mode) {
    this.mode = mode;
    this.notifyListeners();
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
    this.listeners.forEach(cb => cb(state));
  }

  /**
   * Check backend health and model loading status
   */
  async checkEndpointHealth(url = this.apiUrl) {
    if (!url) {
      return { ok: false, error: 'No endpoint URL configured.' };
    }
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(`${url.replace(/\/$/, '')}/api/health`, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return { ok: true, data, modelLoaded: data.model_loaded };
      }
      return { ok: false, status: res.status, error: `HTTP ${res.status}: ${res.statusText}` };
    } catch (err) {
      return {
        ok: false,
        error: err.name === 'AbortError' ? 'Connection timed out (3.5s)' : err.message
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
        formData.append('image', imageFile);
      } else if (typeof imageFile === 'string') {
        // If sample URL, fetch blob first
        const blob = await fetch(imageFile).then(r => r.blob());
        formData.append('image', blob, 'sample.jpg');
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

      return {
        success: true,
        isModelConnected: true,
        status: 'CONNECTED',
        mode: CLASSIFIER_MODES.REAL_API,
        prediction: data.prediction ? data.prediction.toUpperCase() : 'UNKNOWN',
        confidence: data.confidence,
        rawProbabilities: data.probabilities || {
          dog: data.prediction?.toLowerCase() === 'dog' ? data.confidence : 1 - data.confidence,
          cat: data.prediction?.toLowerCase() === 'cat' ? data.confidence : 1 - data.confidence
        },
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
    await new Promise(resolve => setTimeout(resolve, 900));

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
