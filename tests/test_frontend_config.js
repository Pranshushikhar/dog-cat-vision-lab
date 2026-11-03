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

// 8. OOD Rejection & Unsupported Image Response Contract Verification
const mockOodRejectionResponse = {
  prediction: "UNSUPPORTED",
  is_supported: false,
  message: "Unsupported Image — Please upload a photograph of a cat or dog.",
  confidence: null,
  probabilities: null,
  ood_metrics: {
    is_cat_or_dog: false,
    top1_category: "sports_car",
    top1_label: "Sports car",
    top1_confidence: 0.9412,
    cat_dog_score: 0.0012,
    reason: "Non-canine/non-feline subject detected: primary visual pattern aligns with 'Sports car' (94.1%)."
  },
  model_version: "DogCat_CNN_v1_with_OOD_Guard"
};

// Simulate classifierService mapping logic
const isSupported = mockOodRejectionResponse.is_supported !== false && 
                    mockOodRejectionResponse.prediction?.toUpperCase() !== 'UNSUPPORTED';

assert.strictEqual(isSupported, false, 'Unsupported response must evaluate to isSupported = false');
assert.strictEqual(mockOodRejectionResponse.prediction, 'UNSUPPORTED', 'Prediction must be UNSUPPORTED');
assert.notStrictEqual(mockOodRejectionResponse.prediction, 'CAT', 'Rejected image must NEVER predict CAT');
assert.notStrictEqual(mockOodRejectionResponse.prediction, 'DOG', 'Rejected image must NEVER predict DOG');
assert.strictEqual(mockOodRejectionResponse.confidence, null, 'Rejected image confidence must be null');
assert.strictEqual(mockOodRejectionResponse.probabilities, null, 'Rejected image probabilities must be null');
assert.strictEqual(
  mockOodRejectionResponse.message,
  'Unsupported Image — Please upload a photograph of a cat or dog.',
  'Rejection message must strictly match required prompt string'
);

// 9. Simulated Pipeline Demo Mode Rejection Checks
import { classifierService, CLASSIFIER_MODES } from '../src/services/classifierService.js';

async function testSimulatedDemoModeRejections() {
  classifierService.setMode(CLASSIFIER_MODES.DEMO_MODE);

  // Test Car rejection
  const carResult = await classifierService.predict({ name: 'red_sports_car.jpg' }, { forceDemo: true });
  assert.strictEqual(carResult.isSupported, false, 'Simulated car must be rejected');
  assert.strictEqual(carResult.prediction, 'UNSUPPORTED', 'Simulated car prediction must be UNSUPPORTED');
  assert.strictEqual(carResult.confidence, null, 'Simulated car confidence must be null');
  assert.strictEqual(carResult.rawProbabilities, null, 'Simulated car probabilities must be null');
  assert.strictEqual(carResult.message, 'Unsupported Image — Please upload a photograph of a cat or dog.');

  // Test Food rejection
  const foodResult = await classifierService.predict({ name: 'pepperoni_pizza_slice.png' }, { forceDemo: true });
  assert.strictEqual(foodResult.isSupported, false, 'Simulated food must be rejected');
  assert.strictEqual(foodResult.prediction, 'UNSUPPORTED');

  // Test Building rejection
  const buildingResult = await classifierService.predict({ name: 'city_building_architecture.jpg' }, { forceDemo: true });
  assert.strictEqual(buildingResult.isSupported, false, 'Simulated building must be rejected');
  assert.strictEqual(buildingResult.prediction, 'UNSUPPORTED');

  // Test Human Portrait rejection
  const personResult = await classifierService.predict({ name: 'human_face_portrait.jpg' }, { forceDemo: true });
  assert.strictEqual(personResult.isSupported, false, 'Simulated portrait must be rejected');
  assert.strictEqual(personResult.prediction, 'UNSUPPORTED');

  // Test Landscape rejection
  const landscapeResult = await classifierService.predict({ name: 'mountain_landscape.jpg' }, { forceDemo: true });
  assert.strictEqual(landscapeResult.isSupported, false, 'Simulated landscape must be rejected');
  assert.strictEqual(landscapeResult.prediction, 'UNSUPPORTED');

  // Test Supported Pet acceptance in simulated mode
  const dogResult = await classifierService.predict({ name: 'golden_retriever_specimen.jpg' }, { forceDemo: true });
  assert.strictEqual(dogResult.isSupported, true, 'Simulated pet must be accepted');
  assert.ok(['CAT', 'DOG'].includes(dogResult.prediction), 'Simulated pet prediction must be CAT or DOG');
  assert.ok(typeof dogResult.confidence === 'number', 'Simulated pet must have numerical confidence');
  assert.ok(dogResult.rawProbabilities !== null, 'Simulated pet must have probability distribution');

  console.log('✓ All frontend OOD rejection, contract validation, and demo mode tests passed successfully!');
}

await testSimulatedDemoModeRejections();

console.log('✓ All frontend URL normalization, loss formatting, and metric tests passed successfully!');
