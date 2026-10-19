import React, { useState } from 'react';
import { X, Server, Check, AlertCircle, AlertTriangle } from 'lucide-react';
import { classifierService, CLASSIFIER_MODES } from '../services/classifierService';

export default function ApiConfigModal({ isOpen, onClose }) {
  const [apiUrl, setApiUrl] = useState(classifierService.getApiUrl());
  const [currentMode, setCurrentMode] = useState(classifierService.getMode());
  const [testingHealth, setTestingHealth] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleSaveUrl = (e) => {
    e.preventDefault();
    classifierService.setApiUrl(apiUrl);
    classifierService.setMode(CLASSIFIER_MODES.REAL_API);
    setCurrentMode(CLASSIFIER_MODES.REAL_API);
    setTestResult(null);
  };

  const handleTestHealth = async () => {
    setTestingHealth(true);
    setTestResult(null);
    const res = await classifierService.checkEndpointHealth(apiUrl);
    setTestingHealth(false);
    setTestResult(res);
  };

  const handleEnableDemoMode = () => {
    classifierService.setMode(CLASSIFIER_MODES.DEMO_MODE);
    setCurrentMode(CLASSIFIER_MODES.DEMO_MODE);
  };

  const handleEnableRealMode = () => {
    classifierService.setMode(CLASSIFIER_MODES.REAL_API);
    setCurrentMode(CLASSIFIER_MODES.REAL_API);
  };

  return (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(37, 40, 33, 0.35)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        className="modal-animate tech-card"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#FFFFFF',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          padding: '24px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Backend Inference Endpoint
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Connection interface for Python FastAPI server
            </p>
          </div>
          <button 
            type="button"
            className="btn btn-ghost" 
            onClick={onClose}
            aria-label="Close modal"
            style={{ padding: '4px', borderRadius: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Operating Mode Selector */}
        <div style={{ margin: '18px 0' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Operating Mode
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div 
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: currentMode === CLASSIFIER_MODES.REAL_API ? '1px solid var(--accent-green)' : '1px solid var(--border-medium)',
                background: currentMode === CLASSIFIER_MODES.REAL_API ? 'var(--accent-sage)' : 'var(--bg-surface)',
                cursor: 'pointer'
              }}
              onClick={handleEnableRealMode}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Real API Mode
                </span>
                {currentMode === CLASSIFIER_MODES.REAL_API && (
                  <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>Active</span>
                )}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Sends raw images to FastAPI backend on port 8000.
              </div>
            </div>

            <div 
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: currentMode === CLASSIFIER_MODES.DEMO_MODE ? '1px solid #8C5212' : '1px solid var(--border-medium)',
                background: currentMode === CLASSIFIER_MODES.DEMO_MODE ? '#F8F1E4' : 'var(--bg-surface)',
                cursor: 'pointer'
              }}
              onClick={handleEnableDemoMode}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Demo Mode
                </span>
                {currentMode === CLASSIFIER_MODES.DEMO_MODE && (
                  <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Active</span>
                )}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Client-side simulation with explicit visual label.
              </div>
            </div>
          </div>
        </div>

        {/* API Endpoint Input Form */}
        <form onSubmit={handleSaveUrl} style={{ marginBottom: '20px' }}>
          <label htmlFor="api-endpoint-input" style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
            FastAPI Base URL
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              id="api-endpoint-input"
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://127.0.0.1:8000"
              style={{
                flex: 1,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem'
              }}
            />
            <button type="submit" className="btn btn-secondary btn-sm">
              Save
            </button>
            <button 
              type="button" 
              className="btn btn-primary btn-sm"
              onClick={handleTestHealth}
              disabled={testingHealth}
            >
              {testingHealth ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        </form>

        {/* Health Test Result Callout */}
        {testResult && (
          <div 
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              background: testResult.ok ? 'var(--accent-sage)' : '#FBEBEB',
              border: `1px solid ${testResult.ok ? 'rgba(85, 116, 92, 0.3)' : 'rgba(181, 66, 66, 0.3)'}`,
              marginBottom: '16px',
              fontSize: '0.8rem'
            }}
          >
            <div style={{ fontWeight: 600, color: testResult.ok ? '#314E38' : '#9E3333', marginBottom: '4px' }}>
              {testResult.ok ? 'Backend Connected Successfully' : 'Connection Failed'}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              {testResult.ok 
                ? `Model checkpoint loaded: ${testResult.modelLoaded ? 'Yes (MobileNetV2 active)' : 'Weights missing'}. Latency: ${testResult.latencyMs || 0} ms.`
                : 'Unable to reach backend. Verify server is running on http://127.0.0.1:8000.'
              }
            </div>
          </div>
        )}

        {/* Start Server Reminder */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)', padding: '12px', fontSize: '0.78rem' }}>
          <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Terminal command to launch backend:
          </div>
          <code style={{ color: 'var(--text-primary)', fontSize: '0.8rem' }}>
            python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000 --reload
          </code>
        </div>
      </div>
    </div>
  );
}
