import React from 'react';
import { AlertCircle, CheckCircle, Clock, Zap, Cpu, Settings, AlertTriangle, Layers, ArrowRight, Terminal } from 'lucide-react';
import { CLASSIFIER_MODES } from '../../services/classifierService';

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
          minHeight: '280px',
          background: 'var(--bg-secondary)',
          border: '1px dashed var(--border-medium)'
        }}
      >
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', marginBottom: '14px' }}>
          <Layers size={22} />
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
          IDLE STATE
        </div>
        <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
          DROP AN IMAGE TO BEGIN
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '340px' }}>
          Select a sample specimen above or upload a custom photo to trigger convolutional pattern analysis.
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
          minHeight: '280px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--accent-blue)',
          boxShadow: '0 0 24px rgba(77, 163, 255, 0.15)'
        }}
      >
        <div style={{ position: 'relative', width: '56px', height: '56px', marginBottom: '18px' }}>
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '2px solid rgba(77, 163, 255, 0.2)',
              borderTopColor: 'var(--accent-blue)',
              animation: 'spin 1s linear infinite'
            }}
          />
          <div style={{ position: 'absolute', inset: '8px', borderRadius: '50%', background: 'rgba(77,163,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
            <Cpu size={20} />
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.14em', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '6px' }}>
          NEURAL PIPELINE ACTIVE
        </div>
        <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
          EXTRACTING VISUAL FEATURES...
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '380px' }}>
          Propagating input tensor through 32 filters, spatial pooling reductions, and dense classification nodes.
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
          background: 'rgba(255, 162, 76, 0.05)',
          border: '1px solid rgba(255, 162, 76, 0.4)',
          borderRadius: 'var(--radius-md)',
          padding: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255, 162, 76, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFA24C', flexShrink: 0 }}>
            <AlertTriangle size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.12em', color: '#FFA24C', textTransform: 'uppercase', marginBottom: '4px' }}>
              CHECKPOINT STATUS
            </div>
            <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
              MODEL NOT TRAINED
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
              The FastAPI backend responded, but no trained CNN weights exist in <code>models/dog_cat_cnn.keras</code>.
            </p>

            <div style={{ background: '#0B0D14', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)', padding: '12px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                Run Training Command:
              </div>
              <code style={{ fontSize: '0.8rem', color: '#F5F7FA' }}>
                python run_pipeline.py
              </code>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={onSwitchToDemo}
                style={{ borderColor: 'rgba(255, 162, 76, 0.4)', color: '#FFA24C' }}
              >
                <AlertTriangle size={14} />
                <span>Switch to Labeled Demo Mode</span>
              </button>
            </div>
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
          background: 'rgba(255, 92, 92, 0.04)',
          border: '1px solid rgba(255, 92, 92, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255, 92, 92, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-error)', flexShrink: 0 }}>
            <AlertCircle size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--status-error)', textTransform: 'uppercase', marginBottom: '4px' }}>
              SERVICE STATUS
            </div>
            <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
              MODEL ENDPOINT OFFLINE
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
              The classifier backend is currently unavailable. Start the Python FastAPI server to enable live CNN model inference.
            </p>

            <div style={{ background: '#0B0D14', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)', padding: '12px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)', marginBottom: '4px' }}>
                Launch Backend Server:
              </div>
              <code style={{ fontSize: '0.8rem', color: '#F5F7FA' }}>
                python -m uvicorn backend.app:app --port 8000
              </code>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={onOpenConfig}
              >
                <Settings size={14} />
                <span>Configure Endpoint URL</span>
              </button>
              
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={onSwitchToDemo}
                style={{ borderColor: 'rgba(255, 162, 76, 0.4)', color: '#FFA24C' }}
              >
                <AlertTriangle size={14} />
                <span>Switch to Labeled Demo Mode</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. RESULT STATE (Real CNN Model OR Labeled Demo Mode)
  if (result && result.success) {
    const isDog = result.prediction === 'DOG';
    const confidencePct = (result.confidence * 100).toFixed(1);
    const dogProb = ((result.rawProbabilities?.dog ?? (isDog ? result.confidence : 1 - result.confidence)) * 100).toFixed(1);
    const catProb = ((result.rawProbabilities?.cat ?? (isDog ? 1 - result.confidence : result.confidence)) * 100).toFixed(1);

    return (
      <div 
        className="tech-card"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-md)',
          padding: '24px'
        }}
      >
        {/* Labeled Demo Mode Banner */}
        {result.isDemoMode && (
          <div 
            style={{
              background: 'rgba(255, 162, 76, 0.1)',
              border: '1px solid rgba(255, 162, 76, 0.35)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}
          >
            <AlertTriangle size={16} color="#FFA24C" />
            <div style={{ flex: 1, fontSize: '0.78rem', color: '#FFA24C', fontFamily: 'var(--font-mono)' }}>
              <strong>DEMO MODE — NOT REAL MODEL INFERENCE</strong>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Visual simulation running client-side for UI review without connected backend weights.
              </div>
            </div>
          </div>
        )}

        {/* Prediction Main Block */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'center' }}>
          {/* Left: Prediction Class Card */}
          <div 
            style={{
              background: 'var(--bg-elevated)',
              border: `1px solid ${isDog ? 'rgba(77, 163, 255, 0.4)' : 'rgba(85, 230, 208, 0.4)'}`,
              borderRadius: 'var(--radius-sm)',
              padding: '20px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
              PREDICTION
            </div>
            <div 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                fontWeight: 700,
                color: isDog ? 'var(--accent-blue)' : 'var(--accent-cyan)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                marginBottom: '10px'
              }}
            >
              {result.prediction}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className={`badge ${isDog ? 'badge-blue' : 'badge-cyan'}`}>
                {isDog ? 'CANINE MORPHOLOGY' : 'FELINE MORPHOLOGY'}
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                <Clock size={11} style={{ marginRight: '3px' }} />
                {result.processingTimeMs} ms
              </span>
            </div>
          </div>

          {/* Right: Confidence Metric */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                CONFIDENCE
              </span>
              <span style={{ fontSize: '1.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
                {confidencePct}%
              </span>
            </div>

            {/* Binary Class Probability Breakdown */}
            <div style={{ marginTop: '10px' }}>
              {/* Dog Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginBottom: '3px' }}>
                <span style={{ color: isDog ? 'var(--accent-blue)' : 'var(--text-muted)' }}>P(DOG)</span>
                <span style={{ color: 'var(--text-primary)' }}>{dogProb}%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-surface)', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
                <div 
                  style={{
                    width: `${dogProb}%`,
                    height: '100%',
                    background: 'var(--accent-blue)',
                    transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  }} 
                />
              </div>

              {/* Cat Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginBottom: '3px' }}>
                <span style={{ color: !isDog ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>P(CAT)</span>
                <span style={{ color: 'var(--text-primary)' }}>{catProb}%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-surface)', borderRadius: '3px', overflow: 'hidden' }}>
                <div 
                  style={{
                    width: `${catProb}%`,
                    height: '100%',
                    background: 'var(--accent-cyan)',
                    transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
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
