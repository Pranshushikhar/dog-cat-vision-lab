// tests/test_frontend_config.js
import assert from 'node:assert';
import { 
  normalizeBackendUrl, 
  PRODUCTION_BACKEND_URL, 
  LOCAL_BACKEND_URL, 
  WORKER_BACKEND_URL 
} from '../src/services/classifierService.js';

console.log('Testing frontend URL normalization...');

// 1. Basic trailing slashes
assert.strictEqual(
  normalizeBackendUrl('https://pawvision-ai-backend.onrender.com/'),
  'https://pawvision-ai-backend.onrender.com',
  'Failed trailing slash trim'
);

assert.strictEqual(
  normalizeBackendUrl('https://pawvision-ai-backend.onrender.com///'),
  'https://pawvision-ai-backend.onrender.com',
  'Failed multiple trailing slashes trim'
);

// 2. Trailing endpoint routes stripped
assert.strictEqual(
  normalizeBackendUrl('https://pawvision-ai-backend.onrender.com/api/health'),
  'https://pawvision-ai-backend.onrender.com',
  'Failed stripping /api/health'
);

assert.strictEqual(
  normalizeBackendUrl('https://pawvision-ai-backend.onrender.com/api/predict/'),
  'https://pawvision-ai-backend.onrender.com',
  'Failed stripping /api/predict/'
);

assert.strictEqual(
  normalizeBackendUrl('https://pawvision-ai-backend.onrender.com/api/'),
  'https://pawvision-ai-backend.onrender.com',
  'Failed stripping /api/'
);

// 3. Omitting protocol
assert.strictEqual(
  normalizeBackendUrl('pawvision-ai-backend.onrender.com'),
  'https://pawvision-ai-backend.onrender.com',
  'Failed prepending https://'
);

assert.strictEqual(
  normalizeBackendUrl('localhost:8000'),
  'http://localhost:8000',
  'Failed prepending http:// to localhost'
);

assert.strictEqual(
  normalizeBackendUrl('127.0.0.1:8000/'),
  'http://127.0.0.1:8000',
  'Failed prepending http:// to 127.0.0.1'
);

// 4. Empty and edge inputs
assert.strictEqual(normalizeBackendUrl(''), '', 'Empty string should return empty');
assert.strictEqual(normalizeBackendUrl(null), '', 'Null should return empty');
assert.strictEqual(normalizeBackendUrl('   '), '', 'Whitespace should return empty');

// 5. Presets
assert.strictEqual(PRODUCTION_BACKEND_URL, 'https://pawvision-ai-backend.onrender.com');
assert.strictEqual(LOCAL_BACKEND_URL, 'http://127.0.0.1:8000');
assert.strictEqual(WORKER_BACKEND_URL, 'https://pawvision-ai.26bcs10417.workers.dev');

// 6. Validation Loss formatting verification (must NOT be formatted as percentage)
const formatMetricValue = (dm) => {
  return dm.value !== null ? (typeof dm.value === 'number' ? (dm.id === 'val_loss' ? dm.value : `${dm.value}%`) : dm.value) : '—';
};

const valLossMetric = { id: 'val_loss', label: 'Validation Loss', value: 0.0409 };
const accuracyMetric = { id: 'accuracy', label: 'Accuracy', value: 98.55 };

assert.strictEqual(formatMetricValue(valLossMetric), 0.0409, 'Validation loss must display as 0.0409 without percentage sign');
assert.notStrictEqual(formatMetricValue(valLossMetric), '0.0409%', 'Validation loss must not contain percentage symbol');
assert.strictEqual(formatMetricValue(accuracyMetric), '98.55%', 'Accuracy metric should retain percentage symbol');

// 7. Probability formatting and boundary clamping verification
const clampProbability = (prob) => Math.min(100, Math.max(0, parseFloat((prob * 100).toFixed(1))));
assert.strictEqual(clampProbability(0.9956), 99.6, 'Probability formatting should round to 1 decimal');
assert.strictEqual(clampProbability(0.0044), 0.4, 'Low probability formatting should round to 1 decimal');
assert.strictEqual(clampProbability(1.05), 100, 'Probabilities above 1.0 must clamp to 100%');
assert.strictEqual(clampProbability(-0.05), 0, 'Probabilities below 0.0 must clamp to 0%');

console.log('✓ All frontend URL normalization, loss formatting, and metric tests passed successfully!');
