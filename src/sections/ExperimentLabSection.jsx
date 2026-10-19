import React, { useState } from 'react';
import { ArrowRight, Sliders } from 'lucide-react';
import { classifierService } from '../services/classifierService';
import { SAMPLE_IMAGES } from '../services/sampleData';

const AVAILABLE_MODELS = [
  { id: 'mobilenet-v2', name: 'MobileNetV2 (Active Checkpoint, 98.55% Acc)', status: 'Active', active: true },
  { id: 'baseline-cnn', name: 'Baseline Custom CNN (Archived, ~72% Acc)', status: 'Backup', active: true }
];

export default function ExperimentLabSection({ onOpenConfigModal }) {
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id);
  const [threshold, setThreshold] = useState(0.5);
  const [selectedSample, setSelectedSample] = useState(SAMPLE_IMAGES[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [experimentResult, setExperimentResult] = useState(null);

  const handleRunExperiment = async () => {
    setIsProcessing(true);
    setExperimentResult(null);

    try {
      const res = await classifierService.predict(selectedSample.url, {
        confidenceThreshold: threshold
      });
      setExperimentResult(res);
    } catch (err) {
      setExperimentResult({
        success: false,
        isModelConnected: false,
        error: err.message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      {/* Section Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="section-eyebrow">
            Benchmark Sandbox
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Sensitivity & Threshold Testing
          </span>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
          Sensitivity & Experiment Sandbox
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '640px' }}>
          Test model robustness by varying decision boundary cutoffs and comparing predictions across benchmark specimens.
        </p>
      </div>

      {/* Controls & Results Card */}
      <div className="tech-card" style={{ padding: '24px' }}>
        <div className="grid-2" style={{ gap: '24px', alignItems: 'start' }}>
          {/* Left: Experiment Controls */}
          <div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', textTransform: 'uppercase', marginBottom: '14px' }}>
              Experiment Parameters
            </div>

            {/* Model Selector */}
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="model-select" style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Active Model Architecture:
              </label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '9px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem'
                }}
              >
                {AVAILABLE_MODELS.map((m) => (
                  <option key={m.id} value={m.id} disabled={!m.active}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Specimen */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Select Benchmark Specimen:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {SAMPLE_IMAGES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSelectedSample(s);
                      setExperimentResult(null);
                    }}
                    style={{
                      padding: '4px',
                      background: selectedSample.id === s.id ? 'var(--accent-sage)' : 'var(--bg-surface)',
                      border: selectedSample.id === s.id ? '1px solid var(--accent-green)' : '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ width: '100%', height: '40px', overflow: 'hidden', borderRadius: '2px', marginBottom: '4px', background: '#EAEBE3' }}>
                      <img src={s.url} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {s.species}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Threshold Slider */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Decision Threshold:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{(threshold * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-green)', cursor: 'pointer' }}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRunExperiment}
              disabled={isProcessing}
              style={{ width: '100%' }}
            >
              <span>{isProcessing ? 'Evaluating...' : 'Run Sensitivity Test'}</span>
              {!isProcessing && <ArrowRight size={15} />}
            </button>
          </div>

          {/* Right: Experiment Outcome */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', padding: '20px', minHeight: '220px' }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
              Outcome Log
            </div>

            {experimentResult ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {experimentResult.prediction}
                  </span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-green)' }}>
                    {(experimentResult.confidence * 100).toFixed(1)}%
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Evaluated {selectedSample.name} at {(threshold * 100).toFixed(0)}% decision boundary in {experimentResult.processingTimeMs} ms.
                </div>

                <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-subtle)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                  <div>P(Dog): {((experimentResult.rawProbabilities?.dog ?? 0.5) * 100).toFixed(2)}%</div>
                  <div>P(Cat): {((experimentResult.rawProbabilities?.cat ?? 0.5) * 100).toFixed(2)}%</div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '36px 12px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                Select a specimen and click "Run Sensitivity Test" to compute decision outputs.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
