import React from 'react';
import LiveClassifier from '../components/classifier/LiveClassifier';
import { Microscope, Info } from 'lucide-react';

export default function ClassifierSection({ onOpenConfigModal }) {
  return (
    <section id="classifier" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            INTERACTIVE CLASSIFIER LAB
          </div>
          <h2 className="section-title">
            Live Classification Lab
          </h2>
          <p className="section-subtitle">
            Evaluate images through the convolutional vision pipeline. Test with curated benchmark specimens or upload custom photographs.
          </p>
        </div>

        {/* Live Classifier Component */}
        <LiveClassifier onOpenConfigModal={onOpenConfigModal} />

        {/* Technical Notice Footnote */}
        <div 
          style={{
            marginTop: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <Info size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <strong>Scientific Disclosure:</strong> When connected to a live backend, predictions are derived via tensor matrix operations. If no inference server is reachable, the lab explicitly signals disconnected state rather than faking outputs.
          </span>
        </div>
      </div>
    </section>
  );
}
