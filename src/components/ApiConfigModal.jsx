import React, { useState, useEffect } from 'react';
import { X, Server, Check, AlertCircle, AlertTriangle, RefreshCw, Globe, Laptop } from 'lucide-react';
import { 
  classifierService, 
  CLASSIFIER_MODES, 
  PRODUCTION_BACKEND_URL, 
  LOCAL_BACKEND_URL, 
  WORKER_BACKEND_URL,
  normalizeBackendUrl 
} from '../services/classifierService';

export default function ApiConfigModal({ isOpen, onClose }) {
  const [apiUrl, setApiUrl] = useState('');
  const [currentMode, setCurrentMode] = useState(CLASSIFIER_MODES.REAL_API);
  const [testingHealth, setTestingHealth] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [initialStatusChecked, setInitialStatusChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      const activeUrl = classifierService.getApiUrl();
      setApiUrl(activeUrl);
      setCurrentMode(classifierService.getMode());
      setSaveSuccess(false);

      // Auto-check connection status on open if not checked yet
      setTestingHealth(true);
      classifierService.checkEndpointHealth(activeUrl, 8000).then((res) => {
        if (isMounted) {
          setTestResult(res);
          setTestingHealth(false);
          setInitialStatusChecked(true);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveUrl = (e) => {
    if (e) e.preventDefault();
    const normalized = normalizeBackendUrl(apiUrl);
    setApiUrl(normalized);
    classifierService.setApiUrl(normalized, true);
    classifierService.setMode(CLASSIFIER_MODES.REAL_API, true);
    setCurrentMode(CLASSIFIER_MODES.REAL_API);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleTestHealth = async () => {
    const target = normalizeBackendUrl(apiUrl || classifierService.getApiUrl());
    if (!target) {
      setTestResult({
        ok: false,
        testedUrl: '',
        error: 'Please enter a valid backend URL before testing.'
      });
      return;
    }
    setTestingHealth(true);
    setTestResult(null);
    const res = await classifierService.checkEndpointHealth(target, 20000);
    setTestingHealth(false);
    setTestResult(res);
  };

  const handleSelectPreset = (url) => {
    const normalized = normalizeBackendUrl(url);
    setApiUrl(normalized);
    setTestResult(null);
    setSaveSuccess(false);
  };

  const handleEnableDemoMode = () => {
    classifierService.setMode(CLASSIFIER_MODES.DEMO_MODE, true);
    setCurrentMode(CLASSIFIER_MODES.DEMO_MODE);
  };

  const handleEnableRealMode = () => {
    classifierService.setMode(CLASSIFIER_MODES.REAL_API, true);
    setCurrentMode(CLASSIFIER_MODES.REAL_API);
  };

  const isLocalTarget = apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1');

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
          maxWidth: '580px',
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
              Backend Settings & Connection
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Connection configuration for Python FastAPI CNN inference backend
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

        {/* Live Backend Connection Status Banner (Transferred from Navbar) */}
        <div 
          style={{ 
            margin: '16px 0',
            padding: '14px 16px', 
            borderRadius: 'var(--radius-sm)', 
            background: testResult?.ok ? 'var(--accent-sage)' : '#FBF2F2',
            border: `1px solid ${testResult?.ok ? 'rgba(85, 116, 92, 0.35)' : 'rgba(181, 66, 66, 0.25)'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={`pulse-dot ${testingHealth ? 'warning' : testResult?.ok ? 'success' : 'error'}`} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: testResult?.ok ? '#314E38' : '#9E3333' }}>
                {testingHealth ? 'Checking Backend Health...' : testResult?.ok ? 'Backend Operational · Model Ready' : 'Backend Status: Offline / Dormant'}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleTestHealth}
              disabled={testingHealth}
              style={{ padding: '3px 10px', fontSize: '0.72rem', height: '26px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <RefreshCw size={12} className={testingHealth ? 'spin' : ''} />
              <span>{testingHealth ? 'Pinging...' : 'Wake / Test Ping'}</span>
            </button>
          </div>

          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            {testingHealth ? (
              <span>Sending health check ping to <code>{apiUrl || classifierService.getApiUrl()}</code>...</span>
            ) : testResult?.ok ? (
              <span>Connected to FastAPI endpoint. MobileNetV2 weights active with 98.55% validation accuracy. Latency: {testResult.latencyMs !== undefined ? `${testResult.latencyMs} ms` : 'healthy'}.</span>
            ) : (
              <span>
                Render free-tier instances sleep after 15 minutes of inactivity. Click <strong>Wake / Test Ping</strong> to trigger a wake-up request (cold starts take ~30–45s), or run local Uvicorn on <code>127.0.0.1:8000</code>.
              </span>
            )}
          </div>
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
                Sends raw images to the live FastAPI CNN backend.
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

        {/* Quick Preset Selector */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Quick Select Preset
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{
                fontSize: '0.74rem',
                padding: '4px 10px',
                background: apiUrl === PRODUCTION_BACKEND_URL ? 'var(--accent-sage)' : 'var(--bg-surface)',
                border: apiUrl === PRODUCTION_BACKEND_URL ? '1px solid var(--accent-green)' : '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-xs)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
              onClick={() => handleSelectPreset(PRODUCTION_BACKEND_URL)}
            >
              <Globe size={13} color="var(--accent-green)" />
              <span>Production (Render)</span>
            </button>

            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{
                fontSize: '0.74rem',
                padding: '4px 10px',
                background: apiUrl === LOCAL_BACKEND_URL ? 'var(--accent-sage)' : 'var(--bg-surface)',
                border: apiUrl === LOCAL_BACKEND_URL ? '1px solid var(--accent-green)' : '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-xs)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
              onClick={() => handleSelectPreset(LOCAL_BACKEND_URL)}
            >
              <Laptop size={13} color="var(--text-secondary)" />
              <span>Local Dev (127.0.0.1:8000)</span>
            </button>
          </div>
        </div>

        {/* API Endpoint Input Form */}
        <form onSubmit={handleSaveUrl} style={{ marginBottom: '18px' }}>
          <label htmlFor="api-endpoint-input" style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
            FastAPI Base URL
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              id="api-endpoint-input"
              type="text"
              value={apiUrl}
              onChange={(e) => {
                setApiUrl(e.target.value);
                setSaveSuccess(false);
              }}
              placeholder="https://pawvision-ai-backend.onrender.com"
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
            <button 
              type="submit" 
              className="btn btn-secondary btn-sm"
              title="Save URL to browser settings"
            >
              {saveSuccess ? 'Saved!' : 'Save'}
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
          {saveSuccess && (
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={13} />
              <span>Endpoint saved and persisted to browser storage.</span>
            </div>
          )}
        </form>

        {/* Health Test Result Callout */}
        {testResult && (
          <div 
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              background: testResult.ok ? 'var(--accent-sage)' : '#FBEBEB',
              border: `1px solid ${testResult.ok ? 'rgba(85, 116, 92, 0.3)' : 'rgba(181, 66, 66, 0.3)'}`,
              marginBottom: '16px',
              fontSize: '0.8rem'
            }}
          >
            <div style={{ fontWeight: 600, color: testResult.ok ? '#314E38' : '#9E3333', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {testResult.ok ? (
                <>
                  <Check size={16} />
                  <span>Backend Connected Successfully</span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  <span>Connection Failed</span>
                </>
              )}
            </div>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              {testResult.ok ? (
                <>
                  <div><strong>Endpoint:</strong> {testResult.testedUrl}/api/health</div>
                  <div>
                    <strong>Model Status:</strong> {testResult.modelLoaded ? 'Trained CNN checkpoint loaded & active' : 'Weights missing on server'}.
                    {testResult.latencyMs !== undefined && ` Latency: ${testResult.latencyMs} ms.`}
                  </div>
                </>
              ) : (
                <div>
                  <div style={{ color: '#9E3333', fontWeight: 500, marginBottom: '4px' }}>
                    {testResult.error || 'Unable to connect to backend.'}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Target attempted: <code>{testResult.testedUrl || apiUrl}/api/health</code>
                    {isLocalTarget && (
                      <div style={{ marginTop: '4px' }}>
                        If developing locally, make sure Uvicorn is running on <code>127.0.0.1:8000</code>.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Documented API Endpoints Reference */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', padding: '14px', marginBottom: '16px' }}>
          <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-teal)', textTransform: 'uppercase', marginBottom: '8px' }}>
            FastAPI Endpoints Reference (v2.0)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px' }}>
              <code>GET /health</code>
              <span style={{ color: 'var(--text-muted)' }}>Status &amp; model load verification</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px' }}>
              <code>GET /api/info</code>
              <span style={{ color: 'var(--text-muted)' }}>App metadata &amp; team credits</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px' }}>
              <code>GET /api/model-info</code>
              <span style={{ color: 'var(--text-muted)' }}>MobileNetV2 specifications &amp; metrics</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px' }}>
              <code>POST /api/predict</code>
              <span style={{ color: 'var(--text-muted)' }}>Image inference with latency &amp; OOD screening</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <code>POST /api/feedback</code>
              <span style={{ color: 'var(--text-muted)' }}>Research feedback &amp; ratings submission</span>
            </div>
          </div>
        </div>

        {/* Start Server Reminder */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)', padding: '12px', fontSize: '0.78rem' }}>
          <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Terminal command to launch local backend:
          </div>
          <code style={{ color: 'var(--text-primary)', fontSize: '0.8rem', display: 'block', wordBreak: 'break-all' }}>
            python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000 --reload
          </code>
        </div>
      </div>
    </div>
  );
}
