import React from 'react';
import { X, ShieldCheck, Lock, HardDrive, EyeOff, Trash2, CheckCircle2 } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(5px)',
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
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          padding: '28px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--accent-teal-subtle)',
                color: 'var(--accent-teal)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Privacy &amp; Data Ethics
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Transparent handling of uploaded imagery and user data
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            aria-label="Close privacy modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {/* Principle 1 */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--accent-teal)', marginTop: '2px', flexShrink: 0 }}>
              <EyeOff size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                100% In-Memory Ephemeral Inference
              </h4>
              <p style={{ margin: 0 }}>
                When you submit an image for classification, the binary data is received into temporary server RAM, converted to tensor arrays, evaluated, and immediately garbage-collected. We <strong>never save or persist your uploaded images to disk or cloud databases</strong>.
              </p>
            </div>
          </div>

          {/* Principle 2 */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--accent-teal)', marginTop: '2px', flexShrink: 0 }}>
              <HardDrive size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                Client-Side Prediction History
              </h4>
              <p style={{ margin: 0 }}>
                Your classification session history is retained exclusively in your own browser using standard Web Storage (<code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>localStorage</code>). No historical logs or thumbnails are sent back to our servers.
              </p>
            </div>
          </div>

          {/* Principle 3 */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--accent-teal)', marginTop: '2px', flexShrink: 0 }}>
              <Lock size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                Zero Trackers &amp; Zero Third-Party Advertising
              </h4>
              <p style={{ margin: 0 }}>
                PAWVISION AI does not include tracking pixels, cross-site telemetry, analytics spyware, or marketing cookies. Your interactions with this application remain private.
              </p>
            </div>
          </div>

          {/* Principle 4 */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--accent-teal)', marginTop: '2px', flexShrink: 0 }}>
              <Trash2 size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                Complete User Autonomy &amp; Purge Control
              </h4>
              <p style={{ margin: 0 }}>
                You maintain complete control. You can clear your local prediction history at any time using the &ldquo;Clear All&rdquo; button in the classifier history tray, which removes all records instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onClose}
            style={{ padding: '8px 18px' }}
          >
            <CheckCircle2 size={14} />
            <span>Understood</span>
          </button>
        </div>
      </div>
    </div>
  );
}

