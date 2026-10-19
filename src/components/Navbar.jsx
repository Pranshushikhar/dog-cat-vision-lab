import React, { useState, useEffect } from 'react';
import { Settings, AlertTriangle, ShieldCheck } from 'lucide-react';
import { classifierService, CLASSIFIER_MODES } from '../services/classifierService';

export const NAV_TABS = [
  { id: 'home', label: 'Home' },
  { id: 'classifier', label: 'Classifier' },
  { id: 'dataset', label: 'Dataset' },
  { id: 'model-lab', label: 'Model Lab' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'about', label: 'About' }
];

export default function Navbar({ onOpenApiModal, activeTab = 'home', onSelectTab }) {
  const [serviceState, setServiceState] = useState({
    apiUrl: classifierService.getApiUrl(),
    mode: classifierService.getMode(),
    isConfigured: classifierService.isConfigured()
  });

  const [isLiveModel, setIsLiveModel] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      const res = await classifierService.checkEndpointHealth();
      if (isMounted) {
        setIsLiveModel(res?.ok && res?.modelLoaded === true);
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

  const handleTabClick = (tabId, e) => {
    e.preventDefault();
    if (onSelectTab) {
      onSelectTab(tabId);
    }
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="container navbar-inner" style={{ flexWrap: 'wrap', gap: '14px' }}>
        {/* Simple AILAB Wordmark */}
        <a 
          href="#/home" 
          className="navbar-brand"
          onClick={(e) => handleTabClick('home', e)}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              AILAB
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>
              · Cat vs Dog Vision AI
            </span>
          </div>
        </a>

        {/* 6 Tabs Navigation Bar */}
        <div className="nav-tabs" role="tablist">
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                onClick={(e) => handleTabClick(tab.id, e)}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Status & Configuration */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isLiveModel ? (
            <div 
              className="badge badge-green" 
              style={{ cursor: 'pointer', padding: '4px 9px' }}
              onClick={onOpenApiModal}
              title="Real CNN Model Online (MobileNetV2, 98.55% Validation Accuracy)"
            >
              <span className="pulse-dot success" />
              <span>Model Online · 98.5%</span>
            </div>
          ) : serviceState.mode === CLASSIFIER_MODES.DEMO_MODE ? (
            <div 
              className="badge badge-warning" 
              style={{ cursor: 'pointer', padding: '4px 9px' }}
              onClick={onOpenApiModal}
              title="Demo Mode Active — Click to Configure Backend"
            >
              <AlertTriangle size={12} />
              <span>Demo Mode</span>
            </div>
          ) : (
            <div 
              className="badge badge-error" 
              style={{ cursor: 'pointer', padding: '4px 9px' }}
              onClick={onOpenApiModal}
              title="Backend Endpoint Offline — Click to Configure"
            >
              <span className="pulse-dot idle" />
              <span>Offline</span>
            </div>
          )}

          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={onOpenApiModal}
            aria-label="Configure API Endpoint"
            style={{ padding: '5px 10px', fontSize: '0.78rem' }}
          >
            <Settings size={13} />
            <span>API</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
