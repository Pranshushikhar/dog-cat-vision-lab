import React, { useState } from 'react';
import { X, Server, CheckCircle, AlertCircle, Cpu, Terminal, Play, Radio } from 'lucide-react';
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
        background: 'rgba(3, 4, 8, 0.85)',
        backdropFilter: 'blur(8px)',
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
          maxWidth: '640px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 30px rgba(77,163,255,0.1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(77,163,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)' }}>
              <Server size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Model Inference Configuration</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Contract & Connection Interface for CNN Backend</p>
            </div>
          </div>
          <button 
            type="button"
            className="btn btn-ghost" 
            onClick={onClose}
            aria-label="Close modal"
            style={{ padding: '6px', borderRadius: '6px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Mode Selector */}
        <div style={{ margin: '20px 0' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Operating Mode
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div 
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                border: currentMode === CLASSIFIER_MODES.REAL_API ? '1px solid var(--accent-blue)' : '1px solid var(--border-medium)',
                background: currentMode === CLASSIFIER_MODES.REAL_API ? 'rgba(77, 163, 255, 0.08)' : 'var(--bg-surface)',
                cursor: 'pointer'
              }}
              onClick={handleEnableRealMode}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>Real API Endpoint</span>
                <Radio size={16} color={currentMode === CLASSIFIER_MODES.REAL_API ? 'var(--accent-blue)' : 'var(--text-muted)'} />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Connects to actual live CNN model server. If disconnected, explicitly reports missing backend.
              </p>
            </div>

            <div 
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                border: currentMode === CLASSIFIER_MODES.DEMO_MODE ? '1px solid var(--status-warning)' : '1px solid var(--border-medium)',
                background: currentMode === CLASSIFIER_MODES.DEMO_MODE ? 'rgba(255, 162, 76, 0.08)' : 'var(--bg-surface)',
                cursor: 'pointer'
              }}
              onClick={handleEnableDemoMode}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#FFA24C' }}>Demo Mode</span>
                <Radio size={16} color={currentMode === CLASSIFIER_MODES.DEMO_MODE ? '#FFA24C' : 'var(--text-muted)'} />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Runs client-side pipeline simulation. Clearly labeled: "DEMO MODE — NOT REAL MODEL INFERENCE".
              </p>
            </div>
          </div>
        </div>

        {/* API Endpoint Form */}
        <form onSubmit={handleSaveUrl} style={{ marginBottom: '24px' }}>
          <label htmlFor="endpoint-input" style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Inference Base URL (or set VITE_CLASSIFIER_API_URL)
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              id="endpoint-input"
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="e.g. http://localhost:8000 or https://model.yourdomain.com"
              style={{
                flex: 1,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Save
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={handleTestHealth}
              disabled={testingHealth || !apiUrl}
            >
              {testingHealth ? 'Pinging...' : 'Test Health'}
            </button>
          </div>

          {testResult && (
            <div style={{ marginTop: '10px', padding: '10px 12px', borderRadius: 'var(--radius-xs)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', background: testResult.ok ? 'rgba(85,230,208,0.1)' : 'rgba(255,92,92,0.1)', color: testResult.ok ? 'var(--accent-cyan)' : 'var(--status-error)', border: `1px solid ${testResult.ok ? 'rgba(85,230,208,0.3)' : 'rgba(255,92,92,0.3)'}` }}>
              {testResult.ok ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
              <span>{testResult.ok ? 'Endpoint responded successfully (200 OK)' : `Health Check Failed: ${testResult.error}`}</span>
            </div>
          )}
        </form>

        {/* Expected Contract Spec */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Terminal size={14} color="var(--accent-blue)" />
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>Expected API Contract (POST /api/predict)</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            Your backend accepts <code>multipart/form-data</code> with field <code>image</code> and returns JSON:
          </p>
          <pre style={{ background: '#0B0D14', padding: '12px', borderRadius: '6px', fontSize: '0.72rem', color: '#A8B0BE', overflowX: 'auto', border: '1px solid var(--border-subtle)' }}>
{`{
  "prediction": "DOG",          // or "CAT"
  "confidence": 0.942,          // float 0.0 - 1.0
  "probabilities": {
    "dog": 0.942,
    "cat": 0.058
  },
  "model_version": "CNN-Kaggle-v1"
}`}
          </pre>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
