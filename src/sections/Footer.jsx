import React from 'react';
import { ShieldCheck, Code2, MessageSquare, ExternalLink } from 'lucide-react';

export default function Footer({ onOpenConfigModal, onOpenFeedbackModal, onSelectTab }) {
  const handleNav = (tabId, e) => {
    e.preventDefault();
    if (onSelectTab) onSelectTab(tabId);
  };

  return (
    <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-medium)', padding: '48px 0 28px 0', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '36px', marginBottom: '36px' }}>
          {/* Project Identity */}
          <div style={{ maxWidth: '380px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '10px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: 'var(--accent-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 10.5c-1.38 0-2.5 1.12-2.5 2.5 0 2.21 2.5 5.5 2.5 5.5s2.5-3.29 2.5-5.5c0-1.38-1.12-2.5-2.5-2.5z" />
                  <ellipse cx="6.5" cy="11.5" rx="2" ry="2.5" />
                  <ellipse cx="17.5" cy="11.5" rx="2" ry="2.5" />
                  <ellipse cx="9" cy="6" rx="1.8" ry="2.2" />
                  <ellipse cx="15" cy="6" rx="1.8" ry="2.2" />
                </svg>
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                PAWVISION AI
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-teal)', margin: '0 0 8px 0' }}>
              See the Difference. Let AI Decide.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 14px 0' }}>
              High-accuracy cat and dog classification platform powered by MobileNetV2 transfer learning with dual-stage Out-of-Distribution validation.
            </p>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              <strong>Developed by Pranshu Shikhar &amp; Team</strong>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Rishabh Vaish · Ankit Raj · Kanika Rani · Ishita Goel
              </div>
            </div>
          </div>

          {/* Quick Technical Links */}
          <div>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              Platform Navigation
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              <li><a href="#/home" onClick={(e) => handleNav('home', e)} className="navbar-link">Home Overview</a></li>
              <li><a href="#/classifier" onClick={(e) => handleNav('classifier', e)} className="navbar-link">Classifier Workspace</a></li>
              <li><a href="#/how-it-works" onClick={(e) => handleNav('how-it-works', e)} className="navbar-link">How It Works</a></li>
              <li><a href="#/model-info" onClick={(e) => handleNav('model-info', e)} className="navbar-link">Model Information</a></li>
              <li><a href="#/about" onClick={(e) => handleNav('about', e)} className="navbar-link">About &amp; Architecture</a></li>
            </ul>
          </div>

          {/* Developer & API Section */}
          <div>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              Developer &amp; Research
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              <li>
                <button
                  type="button"
                  onClick={onOpenConfigModal}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-teal)', cursor: 'pointer', padding: 0, font: 'inherit', textAlign: 'left', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <Code2 size={13} />
                  <span>API Documentation &amp; Endpoints</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenFeedbackModal}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, font: 'inherit', textAlign: 'left', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <MessageSquare size={13} />
                  <span>Send Research Feedback</span>
                </button>
              </li>
              <li>
                <a
                  href="https://www.kaggle.com/c/dogs-vs-cats"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="navbar-link"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>Kaggle Dogs vs. Cats Benchmark</span>
                  <ExternalLink size={11} style={{ opacity: 0.6 }} />
                </a>
              </li>
            </ul>
          </div>

          {/* Model Specs Card */}
          <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <ShieldCheck size={14} style={{ color: 'var(--accent-teal)' }} />
              <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                VERIFIED SPECIFICATIONS
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Architecture:</span>
              <span style={{ fontWeight: 600 }}>MobileNetV2 (Transfer)</span>
              <span style={{ color: 'var(--text-muted)' }}>Validation Acc:</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-teal)' }}>98.55%</span>
              <span style={{ color: 'var(--text-muted)' }}>Test Holdout:</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-teal)' }}>99.00%</span>
              <span style={{ color: 'var(--text-muted)' }}>Val Loss:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>0.0409</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>&copy; {new Date().getFullYear()} PAWVISION AI · All rights reserved.</span>
          </div>
          <div>
            Built with React 18, TensorFlow 2.15 &amp; FastAPI
          </div>
        </div>
      </div>
    </footer>
  );
}
