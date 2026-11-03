import React from 'react';
import { AlertCircle, AlertTriangle, Clock, Settings, Layers } from 'lucide-react';

export default function InferenceResult({ 
  result, 
  isProcessing, 
  hasImage, 
  onOpenConfig, 
  onSwitchToDemo 
}) {
  // 1. IDLE STATE: No image uploaded yet
  if (!hasImage && !isProcessing && !result) {
    return (
      <div 
        className="tech-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minHeight: '260px',
          background: 'var(--bg-card)',
          border: '1px dashed var(--border-medium)',
          boxSizing: 'border-box',
          maxWidth: '100%'
        }}
      >
        <div 
          style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            background: 'var(--bg-surface)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'var(--text-muted)', 
            marginBottom: '12px' 
          }}
        >
          <Layers size={20} />
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
          Awaiting Input
        </div>
        <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
          Select or upload an image
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '300px', margin: 0 }}>
          Choose a benchmark specimen or upload a photo to evaluate convolutional features.
        </p>
      </div>
    );
  }

  // 2. PROCESSING STATE: Feature extraction underway
  if (isProcessing) {
    return (
      <div 
        className="tech-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minHeight: '260px',
          background: 'var(--bg-card)',
          border: '1px solid var(--accent-green)',
          boxSizing: 'border-box',
          maxWidth: '100%'
        }}
      >
        <div 
          className="animate-spin" 
          style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            border: '3px solid var(--accent-sage)', 
            borderTopColor: 'var(--accent-green)', 
            marginBottom: '16px' 
          }} 
        />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.06em', color: 'var(--accent-green)', textTransform: 'uppercase', marginBottom: '4px' }}>
          Neural Inference
        </div>
        <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
          Extracting visual features...
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '320px', margin: 0 }}>
          Processing through 224 × 224 input tensors and convolutional inverted residual blocks.
        </p>
      </div>
    );
  }

  // 3. MODEL NOT TRAINED ERROR STATE
  if (result && !result.success && result.status === 'MODEL_NOT_TRAINED') {
    return (
      <div 
        className="tech-card"
        style={{
          background: '#F8F1E4',
          border: '1px solid rgba(178, 109, 30, 0.3)',
          borderRadius: 'var(--radius-sm)',
          padding: '20px',
          boxSizing: 'border-box',
          maxWidth: '100%'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ color: '#8C5212', flexShrink: 0, marginTop: '2px' }}>
            <AlertTriangle size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#8C5212', textTransform: 'uppercase', marginBottom: '2px' }}>
              Checkpoint Status
            </div>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
              Model weights not found
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
              The backend is running, but no trained weights were found in <code>models/dog_cat_cnn.keras</code>.
            </p>

            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)', padding: '10px', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '2px' }}>
                Run training pipeline:
              </div>
              <code style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                python run_pipeline.py
              </code>
            </div>

            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={onSwitchToDemo}
            >
              <AlertTriangle size={13} />
              <span>Switch to Labeled Demo Mode</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. MODEL SERVICE OFFLINE STATE
  if (result && !result.success && (result.status === 'OFFLINE' || result.status === 'DISCONNECTED')) {
    return (
      <div 
        className="tech-card"
        style={{
          background: '#FBEBEB',
          border: '1px solid rgba(181, 66, 66, 0.3)',
          borderRadius: 'var(--radius-sm)',
          padding: '20px',
          boxSizing: 'border-box',
          maxWidth: '100%'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ color: 'var(--status-error)', flexShrink: 0, marginTop: '2px' }}>
            <AlertCircle size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--status-error)', textTransform: 'uppercase', marginBottom: '2px' }}>
              Inference Offline
            </div>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
              Backend server unavailable
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
              Start the FastAPI backend server to enable real-time convolutional inference.
            </p>

            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)', padding: '10px', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '2px' }}>
                Launch command:
              </div>
              <code style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                python -m uvicorn backend.app:app --port 8000
              </code>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={onOpenConfig}
              >
                <Settings size={13} />
                <span>Configure URL</span>
              </button>
              
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={onSwitchToDemo}
              >
                <AlertTriangle size={13} />
                <span>Use Demo Mode</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. RESULT STATE (Real Model OR Labeled Demo Mode)
  if (result && result.success) {
    const isDog = result.prediction === 'DOG';
    const confVal = typeof result.confidence === 'number' ? result.confidence : parseFloat(result.confidence) || 0;
    const confidencePct = (confVal * 100).toFixed(1);

    const dogRaw = result.rawProbabilities?.dog !== undefined
      ? (typeof result.rawProbabilities.dog === 'number' ? result.rawProbabilities.dog : parseFloat(result.rawProbabilities.dog))
      : (isDog ? confVal : 1 - confVal);
    const catRaw = result.rawProbabilities?.cat !== undefined
      ? (typeof result.rawProbabilities.cat === 'number' ? result.rawProbabilities.cat : parseFloat(result.rawProbabilities.cat))
      : (isDog ? 1 - confVal : confVal);

    const dogProbPct = (dogRaw * 100).toFixed(1);
    const catProbPct = (catRaw * 100).toFixed(1);
    const dogBarWidth = Math.min(100, Math.max(0, parseFloat(dogProbPct)));
    const catBarWidth = Math.min(100, Math.max(0, parseFloat(catProbPct)));

    return (
      <div 
        className="tech-card"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          boxSizing: 'border-box',
          maxWidth: '100%'
        }}
      >
        {/* Labeled Demo Mode Banner */}
        {result.isDemoMode && (
          <div 
            style={{
              background: '#F8F1E4',
              border: '1px solid rgba(178, 109, 30, 0.3)',
              borderRadius: 'var(--radius-xs)',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '18px'
            }}
          >
            <AlertTriangle size={14} color="#8C5212" />
            <div style={{ fontSize: '0.75rem', color: '#8C5212', fontFamily: 'var(--font-mono)' }}>
              <strong>Demo Mode:</strong> Client-side simulation running without connected model backend.
            </div>
          </div>
        )}

        {/* Prediction Main Block */}
        <div>
          {/* Top Label & Timing */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Prediction Result
            </span>
            {result.processingTimeMs !== undefined && result.processingTimeMs !== null && (
              <div 
                style={{ 
                  fontSize: '0.75rem', 
                  fontFamily: 'var(--font-mono)', 
                  color: 'var(--accent-green)', 
                  background: 'var(--accent-sage)', 
                  padding: '3px 8px', 
                  borderRadius: 'var(--radius-xs)', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '5px',
                  fontWeight: 600
                }}
                title="Measured inference execution latency"
              >
                <Clock size={12} />
                <span>Inference Time: {result.processingTimeMs} ms</span>
              </div>
            )}
          </div>

          {/* Large Prediction Wordmark */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div 
              style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1,
                letterSpacing: '-0.02em'
              }}
            >
              {result.prediction}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent-green)', lineHeight: 1 }}>
                {confidencePct}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Confidence
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
              {isDog ? 'Canine Morphology' : 'Feline Morphology'}
            </span>
          </div>

          {/* Binary Class Probability Breakdown */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Class Probability Distribution
            </div>

            {/* Cat Probability Row */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '5px' }}>
                <span style={{ fontWeight: !isDog ? 600 : 400, color: 'var(--text-primary)' }}>
                  Cat (Class 0)
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {catProbPct}%
                </span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{
                    width: `${catBarWidth}%`,
                    height: '100%',
                    background: !isDog ? 'var(--accent-green)' : '#B3BAAA',
                    transition: 'width 0.4s ease'
                  }} 
                />
              </div>
            </div>

            {/* Dog Probability Row */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '5px' }}>
                <span style={{ fontWeight: isDog ? 600 : 400, color: 'var(--text-primary)' }}>
                  Dog (Class 1)
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {dogProbPct}%
                </span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{
                    width: `${dogBarWidth}%`,
                    height: '100%',
                    background: isDog ? 'var(--accent-green)' : '#B3BAAA',
                    transition: 'width 0.4s ease'
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
