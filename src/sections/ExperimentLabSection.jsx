import React, { useState } from 'react';
import { Sliders, Cpu, Clock, AlertCircle, Play, Settings, AlertTriangle, Layers } from 'lucide-react';
import { classifierService, CLASSIFIER_MODES } from '../services/classifierService';
import { SAMPLE_IMAGES } from '../services/sampleData';

const AVAILABLE_MODELS = [
  { id: 'baseline-cnn', name: 'Baseline Custom CNN (224×224)', status: 'Illustrative Spec', active: true },
  { id: 'mobilenet-v2', name: 'MobileNetV2 (Transfer Learning)', status: 'Planned / Optional', active: false },
  { id: 'resnet-18', name: 'ResNet-18 (Residual Connections)', status: 'Planned / Optional', active: false }
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
    <section id="experiment-lab" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            BENCHMARK SANDBOX
          </div>
          <h2 className="section-title">
            EXPERIMENT LAB
          </h2>
          <p className="section-subtitle">
            Systematic sensitivity testing across hyperparameter thresholds, target specimens, and candidate topologies.
          </p>
        </div>

        {/* Experiment Controls & Results Dashboard */}
        <div className="tech-card" style={{ padding: '32px', background: 'var(--bg-secondary)', border: '1px solid var(--border-medium)' }}>
          <div className="grid-2" style={{ gap: '32px', alignItems: 'start' }}>
            {/* Left: Experiment Controls */}
            <div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)', textTransform: 'uppercase', marginBottom: '16px' }}>
                Experiment Parameters
              </div>

              {/* 1. Model Selector */}
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="model-select" style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Model Topology:
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
                    padding: '10px 14px',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem'
                  }}
                >
                  {AVAILABLE_MODELS.map((m) => (
                    <option key={m.id} value={m.id} disabled={!m.active}>
                      {m.name} ({m.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Target Specimen */}
              <div style={{ marginBottom: '20px' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Select Specimen:
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
                        padding: '6px',
                        background: selectedSample.id === s.id ? 'rgba(77, 163, 255, 0.15)' : 'var(--bg-surface)',
                        border: selectedSample.id === s.id ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ width: '100%', height: '36px', overflow: 'hidden', borderRadius: '2px', background: '#0B0D14' }}>
                        <img src={s.url} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-primary)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Confidence Threshold Slider */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label htmlFor="exp-threshold" style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    Confidence Decision Threshold (τ):
                  </label>
                  <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    {threshold.toFixed(2)}
                  </span>
                </div>
                <input
                  id="exp-threshold"
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>0.10 (High Recall)</span>
                  <span>0.50 (Standard)</span>
                  <span>0.90 (High Precision)</span>
                </div>
              </div>

              {/* Run Button */}
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleRunExperiment}
                disabled={isProcessing}
                style={{ width: '100%' }}
              >
                <Play size={16} />
                <span>{isProcessing ? 'CALCULATING INFERENCE...' : 'RUN BENCHMARK EXPERIMENT'}</span>
              </button>
            </div>

            {/* Right: Results Area (Strict Truthful State) */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', padding: '24px', minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {!experimentResult && !isProcessing && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Sliders size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    EXPERIMENT CONTROLS READY
                  </div>
                  <p style={{ fontSize: '0.78rem', maxWidth: '300px', margin: '0 auto' }}>
                    Adjust threshold and choose specimen to measure prediction confidence and processing latency.
                  </p>
                </div>
              )}

              {isProcessing && (
                <div style={{ textAlign: 'center' }}>
                  <div className="pulse-dot active" style={{ width: '12px', height: '12px', margin: '0 auto 16px auto' }} />
                  <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)', marginBottom: '4px' }}>
                    RUNNING BENCHMARK PASS...
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Computing cross-correlation over 224 × 224 tensor
                  </div>
                </div>
              )}

              {experimentResult && !experimentResult.isModelConnected && !experimentResult.isDemoMode && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-error)', marginBottom: '8px' }}>
                    <AlertCircle size={18} />
                    <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      MODEL ENDPOINT DISCONNECTED
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                    The experiment lab will not fabricate numerical predictions without a connected model server.
                  </p>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={onOpenConfigModal}
                    style={{ fontSize: '0.75rem' }}
                  >
                    <Settings size={13} />
                    <span>Open API Settings</span>
                  </button>
                </div>
              )}

              {experimentResult && experimentResult.success && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {experimentResult.isDemoMode && (
                    <div className="badge badge-warning" style={{ alignSelf: 'flex-start', fontSize: '0.65rem' }}>
                      <AlertTriangle size={11} />
                      DEMO MODE — NOT REAL MODEL INFERENCE
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>PREDICTION:</span>
                    <span style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: experimentResult.prediction === 'DOG' ? 'var(--accent-blue)' : 'var(--accent-cyan)' }}>
                      {experimentResult.prediction}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>CONFIDENCE:</span>
                    <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {(experimentResult.confidence * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>PROCESSING TIME:</span>
                    <span style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                      {experimentResult.processingTimeMs} ms
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
