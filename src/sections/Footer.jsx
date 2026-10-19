import React from 'react';

export default function Footer({ onOpenConfigModal, onSelectTab }) {
  const handleNav = (tabId, e) => {
    e.preventDefault();
    if (onSelectTab) onSelectTab(tabId);
  };

  return (
    <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-medium)', padding: '48px 0 32px 0', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px', marginBottom: '32px' }}>
          {/* Project Identity */}
          <div style={{ maxWidth: '380px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                AILAB
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                · Cat vs Dog Vision AI
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
              An applied computer vision research laboratory demonstrating binary image classification with MobileNetV2 transfer learning on the Kaggle benchmark.
            </p>
          </div>

          {/* Quick Technical Links */}
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
                Application Tabs
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
                <li><a href="#/home" onClick={(e) => handleNav('home', e)} className="navbar-link">Home Overview</a></li>
                <li><a href="#/classifier" onClick={(e) => handleNav('classifier', e)} className="navbar-link">Classifier Workspace</a></li>
                <li><a href="#/dataset" onClick={(e) => handleNav('dataset', e)} className="navbar-link">Kaggle Dataset</a></li>
                <li><a href="#/model-lab" onClick={(e) => handleNav('model-lab', e)} className="navbar-link">Model Lab & Metrics</a></li>
                <li><a href="#/how-it-works" onClick={(e) => handleNav('how-it-works', e)} className="navbar-link">How It Works</a></li>
                <li><a href="#/about" onClick={(e) => handleNav('about', e)} className="navbar-link">About & Architecture</a></li>
              </ul>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
                Technical Endpoints
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
                <li>
                  <button 
                    type="button" 
                    onClick={onOpenConfigModal} 
                    style={{ background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer', padding: 0, font: 'inherit', textAlign: 'left' }}
                  >
                    API Endpoint Config
                  </button>
                </li>
                <li>
                  <a href="https://www.kaggle.com/c/dogs-vs-cats" target="_blank" rel="noopener noreferrer" className="navbar-link">
                    Kaggle Dataset Source
                  </a>
                </li>
                <li>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    FastAPI Port 8000 Target
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div>
            AILAB · Computer Vision Research Laboratory
          </div>
          <div>
            Built with React 18, TensorFlow & FastAPI
          </div>
        </div>
      </div>
    </footer>
  );
}
