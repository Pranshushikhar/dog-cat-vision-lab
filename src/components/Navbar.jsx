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
        {/* PawVision AI Wordmark & Team Credit */}
        <a 
          href="#/home" 
          className="navbar-brand"
          onClick={(e) => handleTabClick('home', e)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div className="brand-paw-badge" title="PawVision AI — Click to go home">
              <span className="hover-wiggle" style={{ display: 'inline-block' }}>🐾</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '1.12rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                  PawVision AI
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                  · Cat vs Dog Vision
                </span>
              </div>
              <div className="navbar-team-credit">
                Developed by <span className="team-lead">Pranshu Shikhar &amp; Team</span> — Rishabh Vaish, Ankit Raj, Kanika Rani and Ishita Goel
              </div>
            </div>
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
          {isLiveModel && (
            <div 
              className="badge badge-green nav-status-badge" 
              style={{ cursor: 'pointer', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              onClick={onOpenApiModal}
              title="Real CNN Model Online (MobileNetV2, 98.55% Validation Accuracy) — Click for Settings"
              aria-label="Model status: Online, Validation Accuracy: 98.55%"
            >
              <span className="pulse-dot success" />
              <span>Model Online · Validation Accuracy 98.55%</span>
            </div>
          )}

          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={onOpenApiModal}
            aria-label="Settings and Backend Inference Configuration"
            style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Settings size={14} />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
