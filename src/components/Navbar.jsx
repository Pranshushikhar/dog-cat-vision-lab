import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  MessageSquare, 
  Menu, 
  X, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { classifierService, CLASSIFIER_MODES } from '../services/classifierService';

export const NAV_TABS = [
  { id: 'home', label: 'Home' },
  { id: 'classifier', label: 'Classifier' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'model-info', label: 'Model Information' },
  { id: 'about', label: 'About' }
];

export default function Navbar({ 
  onOpenApiModal, 
  onOpenFeedbackModal,
  activeTab = 'home', 
  onSelectTab 
}) {
  const [serviceState, setServiceState] = useState({
    apiUrl: classifierService.getApiUrl(),
    mode: classifierService.getMode(),
    isConfigured: classifierService.isConfigured()
  });

  // Health check status states: 'checking' | 'online' | 'offline' | 'error'
  const [healthStatus, setHealthStatus] = useState('checking');
  const [healthData, setHealthData] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const checkHealth = async () => {
    setHealthStatus('checking');
    try {
      const res = await classifierService.checkEndpointHealth();
      if (res?.ok) {
        if (res.modelLoaded === true) {
          setHealthStatus('online');
          setHealthData(res);
        } else {
          setHealthStatus('error');
          setHealthData(res);
        }
      } else {
        setHealthStatus('offline');
        setHealthData(res);
      }
    } catch (e) {
      setHealthStatus('offline');
    }
  };

  useEffect(() => {
    let isMounted = true;
    checkHealth();

    const unsubscribe = classifierService.subscribe((state) => {
      setServiceState(state);
      checkHealth();
    });

    // Periodically refresh health status every 30 seconds
    const interval = setInterval(() => {
      if (isMounted) checkHealth();
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const handleTabClick = (tabId, e) => {
    if (e) e.preventDefault();
    if (onSelectTab) {
      onSelectTab(tabId);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="container navbar-inner">
        {/* Modern PawVision AI Logo & Subtitle */}
        <a 
          href="#/home" 
          className="navbar-brand"
          onClick={(e) => handleTabClick('home', e)}
          aria-label="PawVision AI Home"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Modern Geometric Paw Icon */}
            <div 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '9px',
                background: 'linear-gradient(135deg, var(--accent-green) 0%, #0D9488 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(15, 118, 110, 0.25)',
                flexShrink: 0
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                {/* 4 Toes */}
                <ellipse cx="6" cy="7" rx="2" ry="2.8" />
                <ellipse cx="10.2" cy="4.5" rx="2" ry="2.8" />
                <ellipse cx="14.8" cy="4.5" rx="2" ry="2.8" />
                <ellipse cx="19" cy="7" rx="2" ry="2.8" />
                {/* Main Pad */}
                <path d="M7.5 13.5 C7 11 10 9 12.5 9 C15 9 18 11 17.5 13.5 C17 16.5 14.8 19 12.5 19 C10.2 19 8 16.5 7.5 13.5 Z" />
              </svg>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', lineHeight: 1.15 }}>
                <span style={{ fontSize: '1.18rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
                  PAWVISION AI
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Cat vs Dog Vision
                </span>
              </div>
              <div className="navbar-team-credit">
                Developed by <span className="team-lead">Pranshu Shikhar &amp; Team</span> — Rishabh Vaish, Ankit Raj, Kanika Rani, Ishita Goel
              </div>
            </div>
          </div>
        </a>

        {/* Desktop Navigation Tabs */}
        <div className="nav-tabs desktop-only" role="tablist">
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id || (tab.id === 'model-info' && activeTab === 'model-lab');
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

        {/* Right Status Indicator, API & Feedback Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Dynamic Real Backend Health Status Indicator */}
          {healthStatus === 'checking' && (
            <div 
              className="badge badge-neutral nav-status-badge"
              style={{ cursor: 'pointer', padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              onClick={onOpenApiModal}
              title="Pinging backend health..."
            >
              <span className="pulse-dot idle" />
              <span>Connecting...</span>
            </div>
          )}

          {healthStatus === 'online' && (
            <div 
              className="badge badge-green nav-status-badge" 
              style={{ cursor: 'pointer', padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              onClick={onOpenApiModal}
              title={`MobileNetV2 Online · 98.55% Val Accuracy (${healthData?.latencyMs ?? 30}ms latency)`}
              aria-label="Model status: Online, Validation Accuracy: 98.55%"
            >
              <span className="pulse-dot success" />
              <span>Model Online · 98.55% Acc</span>
            </div>
          )}

          {healthStatus === 'offline' && (
            <div 
              className="badge badge-neutral nav-status-badge" 
              style={{ cursor: 'pointer', padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}
              onClick={onOpenApiModal}
              title="Backend Dormant / Offline — Click to configure or wake server"
            >
              <span className="pulse-dot idle" />
              <span>Backend Offline</span>
            </div>
          )}

          {healthStatus === 'error' && (
            <div 
              className="badge badge-error nav-status-badge" 
              style={{ cursor: 'pointer', padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              onClick={onOpenApiModal}
              title="Model Weights Missing or Connection Error"
            >
              <span className="pulse-dot error" />
              <span>Weights Missing</span>
            </div>
          )}

          {/* API Info / Docs Button */}
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={onOpenApiModal}
            aria-label="Open API Documentation & Endpoint Settings"
            style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <Code2 size={13} />
            <span className="desktop-only">API Docs</span>
            <span className="mobile-only">API</span>
          </button>

          {/* Feedback Button */}
          <button 
            type="button" 
            className="btn btn-ghost btn-sm desktop-only"
            onClick={onOpenFeedbackModal}
            aria-label="Submit Feedback to the Research Team"
            style={{ padding: '6px 10px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <MessageSquare size={13} />
            <span>Feedback</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="mobile-nav-toggle mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xs)',
              padding: '6px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-nav-drawer"
          style={{
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-medium)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id || (tab.id === 'model-info' && activeTab === 'model-lab');
            return (
              <button
                key={tab.id}
                type="button"
                className={`btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  padding: '10px 14px',
                  fontSize: '0.88rem'
                }}
                onClick={(e) => handleTabClick(tab.id, e)}
              >
                <span>{tab.label}</span>
                <ChevronRight size={14} style={{ opacity: 0.6 }} />
              </button>
            );
          })}

          <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenApiModal();
              }}
            >
              <Code2 size={13} />
              <span>API Endpoints</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenFeedbackModal();
              }}
            >
              <MessageSquare size={13} />
              <span>Feedback</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
