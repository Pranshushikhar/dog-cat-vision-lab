import React from 'react';
import LiveClassifier from '../components/classifier/LiveClassifier';
import { Info } from 'lucide-react';

export default function ClassifierTab({ onOpenConfigModal, preselectedImage }) {
  return (
    <div className="tab-pane-container">
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* Tab Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="section-eyebrow">
              Image Inference
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              224 × 224 RGB Tensor Input
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Classifier Workspace
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '640px' }}>
            Upload a cat or dog photograph, or choose a benchmark specimen below to run real-time inference through the trained model.
          </p>
        </div>

        {/* Live Classifier Component */}
        <LiveClassifier 
          onOpenConfigModal={onOpenConfigModal} 
          initialImage={preselectedImage}
        />

        {/* Editorial Integrity Footnote */}
        <div 
          style={{
            marginTop: '28px',
            display: 'flex',
            alignItems: 'baseline',
            gap: '10px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5
          }}
        >
          <Info size={15} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong style={{ color: 'var(--text-primary)' }}>Integrity Note:</strong> Predictions are computed directly from the trained MobileNetV2 neural network. When the backend server is running, real tensor matrix multiplications determine the decision score. If offline, the interface clearly indicates an offline state rather than fabricating mock numbers.
          </span>
        </div>
      </div>
    </div>
  );
}
