import React, { useState, useEffect } from 'react';
import { Eye, Server, Radio, Settings, AlertTriangle, ShieldCheck } from 'lucide-react';
import { classifierService, CLASSIFIER_MODES } from '../services/classifierService';

export default function Navbar({ onOpenApiModal }) {
  const [serviceState, setServiceState] = useState({
    apiUrl: classifierService.getApiUrl(),
    mode: classifierService.getMode(),
    isConfigured: classifierService.isConfigured()
  });

  const [isLiveModel, setIsLiveModel] = useState(false);
  const [checkingHealth, setCheckingHealth] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      setCheckingHealth(true);
      const res = await classifierService.checkEndpointHealth();
      if (isMounted) {
        setIsLiveModel(res?.ok && res?.modelLoaded === true);
        setCheckingHealth(false);
      }
    };
    checkHealth();
    const unsubscribe = classifierService.subscribe((state) => {
      setServiceState(state);
      checkHealth();
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="container navbar-inner">
        {/* Brand */}
        <a href="#hero" className="navbar-brand">
          <div className="brand-icon">
            <Eye size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ letterSpacing: '-0.02em', fontWeight: 700 }}>VISION LAB</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>CNN-01</span>
            </div>
          </div>
        </a>

        {/* Navigation Links */}
        <ul className="navbar-links">
          <li><a href="#classifier" className="navbar-link">Live Lab</a></li>
          <li><a href="#pipeline" className="navbar-link">CV Pipeline</a></li>
          <li><a href="#how-it-sees" className="navbar-link">How CNN Sees</a></li>
          <li><a href="#architecture" className="navbar-link">Architecture</a></li>
          <li><a href="#dataset" className="navbar-link">The Data</a></li>
          <li><a href="#performance" className="navbar-link">Performance</a></li>
          <li><a href="#comparison" className="navbar-link">Features</a></li>
        </ul>

        {/* Right Status & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isLiveModel ? (
            <div 
              className="badge badge-cyan" 
              style={{ cursor: 'pointer', background: 'rgba(85, 230, 208, 0.12)', border: '1px solid rgba(85, 230, 208, 0.4)' }}
              onClick={onOpenApiModal}
              title="Real CNN Model Online (25.7M Params, Accuracy 72.00%)"
            >
              <span className="pulse-dot success" />
              <span style={{ fontWeight: 700, letterSpacing: '0.04em' }}>LIVE MODEL</span>
            </div>
          ) : serviceState.mode === CLASSIFIER_MODES.DEMO_MODE ? (
            <div 
              className="badge badge-warning" 
              style={{ cursor: 'pointer' }}
              onClick={onOpenApiModal}
              title="Demo Mode Active — Click to Configure Backend"
            >
              <AlertTriangle size={12} />
              <span>DEMO MODE</span>
            </div>
          ) : (
            <div 
              className="badge badge-danger" 
              style={{ cursor: 'pointer', background: 'rgba(255, 92, 92, 0.08)', border: '1px solid rgba(255, 92, 92, 0.3)' }}
              onClick={onOpenApiModal}
              title="Backend Endpoint Offline — Click to Configure"
            >
              <span className="pulse-dot idle" />
              <span>MODEL ENDPOINT OFFLINE</span>
            </div>
          )}

          <button 
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenApiModal}
            aria-label="Configure API Endpoint"
            style={{ padding: '6px 12px' }}
          >
            <Settings size={14} />
            <span style={{ fontSize: '0.78rem' }}>API Config</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
