import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Clock, Settings, Layers, ShieldAlert, Eye, Copy, Check, Sparkles, Sliders } from 'lucide-react';

export default function InferenceResult({ 
  result, 
  selectedImage,
  isProcessing, 
  hasImage, 
  onOpenConfig, 
  onSwitchToDemo 
}) {
  const [showAttentionLens, setShowAttentionLens] = useState(false);
  const [activeLandmark, setActiveLandmark] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopyResult = () => {
    if (!result) return;
    const text = result.isSupported === false
      ? `[PawVision AI] Unsupported Image — ${result.detectedCategory || 'Non-pet object'} detected. (Latency: ${result.processingTimeMs || 0}ms)`
      : `[PawVision AI] Prediction: ${result.prediction} | Confidence: ${((result.confidence || 0) * 100).toFixed(1)}% | Cat: ${((result.rawProbabilities?.cat || 0) * 100).toFixed(1)}% | Dog: ${((result.rawProbabilities?.dog || 0) * 100).toFixed(1)}% | Latency: ${result.processingTimeMs || 0}ms`;
    
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
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

  // 5. UNSUPPORTED IMAGE STATE (Independent OOD screening rejected non-cat/non-dog)
  const isUnsupported = result && (
    result.isSupported === false || 
    result.status === 'UNSUPPORTED_IMAGE' || 
    result.prediction === 'UNSUPPORTED'
  );

  if (isUnsupported) {
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

        {/* Top Eyebrow & Inference Timing */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          <span 
            style={{ 
              fontSize: '0.72rem', 
              fontFamily: 'var(--font-mono)', 
              color: '#8C5212', 
              background: '#FBF5EE',
              border: '1px solid rgba(178, 109, 30, 0.25)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-xs)',
              textTransform: 'uppercase',
              fontWeight: 600
            }}
          >
            Input Validation · Unsupported Image
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
              title="Measured screening execution latency"
            >
              <Clock size={12} />
              <span>Inference Time: {result.processingTimeMs} ms</span>
            </div>
          )}
        </div>

        {/* Primary Headline & Required Message */}
        <div style={{ marginBottom: '16px' }}>
          <h3 
            style={{
              fontSize: '1.9rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              margin: '0 0 8px 0'
            }}
          >
            Unsupported Image
          </h3>
          <p 
            style={{ 
              fontSize: '0.98rem', 
              fontWeight: 600, 
              color: '#8C5212', 
              margin: 0,
              lineHeight: 1.45 
            }}
          >
            {result.message || 'Unsupported Image — Please upload a photograph of a cat or dog.'}
          </p>
        </div>

        {/* Diagnostic Feedback Card */}
        <div 
          style={{ 
            background: 'var(--bg-surface)', 
            border: '1px solid var(--border-medium)', 
            borderRadius: 'var(--radius-sm)', 
            padding: '14px 16px', 
            marginBottom: '16px' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <ShieldAlert size={16} color="#8C5212" />
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Non-Canine / Non-Feline Content Detected
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Identified visual pattern aligns with <strong>{result.detectedCategory || 'an unrelated category'}</strong> rather than feline or canine anatomy.
          </p>
          {result.oodMetrics?.reason && (
            <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '8px' }}>
              Screening Note: {result.oodMetrics.reason}
            </div>
          )}
        </div>

        {/* Responsible AI Decision Safeguard Note */}
        <div 
          style={{ 
            borderTop: '1px solid var(--border-subtle)', 
            paddingTop: '14px',
            fontSize: '0.78rem', 
            color: 'var(--text-secondary)', 
            lineHeight: 1.5 
          }}
        >
          <strong style={{ color: 'var(--text-primary)' }}>Integrity Safeguard:</strong> Binary cat/dog classification and confidence scoring were withheld to prevent arbitrary forced projection on an out-of-domain input.
        </div>
      </div>
    );
  }

  // 6. RESULT STATE (Real Model OR Labeled Demo Mode)
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
          {/* Top Label, Actions & Timing */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Prediction Result
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={handleCopyResult}
                title="Copy prediction summary to clipboard"
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-xs)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                {copied ? <Check size={11} color="var(--accent-green)" /> : <Copy size={11} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

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
                  <span>{result.processingTimeMs} ms</span>
                </div>
              )}
            </div>
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
              {isDog ? 'Canine Morphology' : 'Feline Morphology'}
            </span>

            {/* Interactive Feature Focus Lens Toggle */}
            <button
              type="button"
              onClick={() => setShowAttentionLens(!showAttentionLens)}
              style={{
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                padding: '3px 9px',
                borderRadius: 'var(--radius-xs)',
                background: showAttentionLens ? 'var(--accent-sage)' : 'var(--bg-surface)',
                border: showAttentionLens ? '1px solid var(--accent-green)' : '1px solid var(--border-medium)',
                color: showAttentionLens ? 'var(--accent-green)' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: showAttentionLens ? 600 : 400,
                transition: 'all var(--transition-fast)'
              }}
            >
              <Eye size={12} />
              <span>{showAttentionLens ? 'Standard View' : 'Neural Focus Lens (Grad-CAM)'}</span>
            </button>
          </div>

          {/* Interactive Neural Attention Lens Box */}
          {showAttentionLens && selectedImage && (
            <div 
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px',
                marginBottom: '18px',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-green)' }}>
                  Interactive Morphological Feature Lens
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Hover landmarks to inspect receptive field focus
                </span>
              </div>

              {/* Photographic Heatmap Simulation Frame */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '180px',
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px'
                }}
              >
                <img
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    opacity: 0.85
                  }}
                />

                {/* Simulated Grad-CAM glowing heatmap layer */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: isDog
                      ? 'radial-gradient(circle at 50% 65%, rgba(68, 110, 76, 0.45) 0%, rgba(178, 109, 30, 0.25) 45%, transparent 75%)'
                      : 'radial-gradient(circle at 45% 35%, rgba(68, 110, 76, 0.45) 0%, rgba(178, 109, 30, 0.25) 45%, transparent 75%)',
                    mixBlendMode: 'screen',
                    pointerEvents: 'none'
                  }}
                />

                {/* Interactive Landmark Pins */}
                {(selectedImage.saliencyRegions || [
                  { x: 35, y: 30, label: isDog ? 'Ear Contour' : 'Erect Pinna', desc: 'High-contrast edge convolution isolating auricular angle.' },
                  { x: 50, y: 60, label: isDog ? 'Snout & Rhinarium' : 'Whisker Pad', desc: 'Intermediate residual blocks identify facial morphology texture.' }
                ]).map((reg, idx) => {
                  const isHovered = activeLandmark === idx;
                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setActiveLandmark(idx)}
                      onMouseLeave={() => setActiveLandmark(null)}
                      style={{
                        position: 'absolute',
                        left: `${reg.x}%`,
                        top: `${reg.y}%`,
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer',
                        zIndex: 2
                      }}
                    >
                      <div 
                        style={{
                          width: isHovered ? '20px' : '14px',
                          height: isHovered ? '20px' : '14px',
                          borderRadius: '50%',
                          background: 'var(--accent-green)',
                          border: '2px solid #FFFFFF',
                          boxShadow: '0 0 10px rgba(85, 116, 92, 0.8)',
                          transition: 'all var(--transition-fast)'
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Landmark explanation pill */}
              <div style={{ minHeight: '36px', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {activeLandmark !== null && selectedImage.saliencyRegions?.[activeLandmark] ? (
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>{selectedImage.saliencyRegions[activeLandmark].label}: </strong>
                    {selectedImage.saliencyRegions[activeLandmark].desc}
                  </div>
                ) : (
                  <div style={{ color: 'var(--text-muted)' }}>
                    Hover over any glowing landmark on the image to see which convolutional features drove this prediction.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Binary Class Probability Breakdown */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Class Probability Distribution
              </span>
              {result.effectiveThreshold !== undefined && (
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  Cutoff: {(result.effectiveThreshold * 100).toFixed(0)}%
                </span>
              )}
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
                    transition: 'width 0.3s ease'
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
                    transition: 'width 0.3s ease'
                  }} 
                />
              </div>
            </div>

            {/* Live Decision Cutoff Feedback */}
            {result.effectiveThreshold !== undefined && (
              <div 
                style={{
                  marginTop: '12px',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  fontSize: '0.74rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '6px'
                }}
              >
                <span>Decision Cutoff: {(result.effectiveThreshold * 100).toFixed(0)}%</span>
                <span style={{ color: isDog ? 'var(--accent-green)' : 'var(--text-primary)', fontWeight: 600 }}>
                  P(Dog) = {dogProbPct}% {isDog ? '≥' : '<'} {(result.effectiveThreshold * 100).toFixed(0)}% → {result.prediction}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
