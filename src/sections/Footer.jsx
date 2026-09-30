import React from 'react';
import { Eye, Github, FileCode, Layers } from 'lucide-react';

export default function Footer({ onOpenConfigModal }) {
  return (
    <footer style={{ background: '#05060A', borderTop: '1px solid var(--border-medium)', padding: '60px 0 40px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px', marginBottom: '40px' }}>
          {/* Project Identity */}
          <div style={{ maxWidth: '420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                <Eye size={16} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                DOG vs CAT
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
              Image Classification Project
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              "Built as a practical exploration of convolutional neural networks."
            </p>
          </div>

          {/* Quick Technical Links */}
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
                Navigation
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                <li><a href="#hero" className="navbar-link">Hero Overview</a></li>
                <li><a href="#classifier" className="navbar-link">Live Classifier</a></li>
                <li><a href="#how-it-sees" className="navbar-link">How CNN Sees</a></li>
                <li><a href="#architecture" className="navbar-link">Architecture</a></li>
                <li><a href="#performance" className="navbar-link">Performance</a></li>
              </ul>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
                Technical Contract
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                <li>
                  <button 
                    type="button" 
                    onClick={onOpenConfigModal} 
                    style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', padding: 0, font: 'inherit', textAlign: 'left' }}
                  >
                    Inference Endpoint Spec
                  </button>
                </li>
                <li>
                  <a href="https://www.kaggle.com/c/dogs-vs-cats" target="_blank" rel="noopener noreferrer" className="navbar-link">
                    Kaggle Dataset
                  </a>
                </li>
                <li>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    Cloudflare Pages Target
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          <div>
            COMPUTER VISION LAB // STANDALONE PROJECT
          </div>
          <div>
            Built with React + Vite • Static Cloudflare Pages Deployment
          </div>
        </div>
      </div>
    </footer>
  );
}
