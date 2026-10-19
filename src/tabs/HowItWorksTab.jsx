import React from 'react';
import HowCnnSeesSection from '../sections/HowCnnSeesSection';
import ComparisonSection from '../sections/ComparisonSection';

export default function HowItWorksTab() {
  return (
    <div className="tab-pane-container">
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* 1. Educational Stages & Interactive 3x3 Kernel Convolution Simulator */}
        <HowCnnSeesSection />

        {/* 2. Mathematical Pipeline Breakdown Card */}
        <div style={{ marginTop: '40px', marginBottom: '40px' }}>
          <div className="tech-card" style={{ padding: '28px' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Mathematical Foundations
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                End-to-End Mathematical Transformation
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '6px 0 0 0' }}>
                From raw camera sensor pixels to binary classification confidence, every image travels through four rigorous mathematical operations:
              </p>
            </div>

            <div className="grid-2" style={{ gap: '16px' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', fontWeight: 600, marginBottom: '4px' }}>
                  STEP 01 · STANDARDIZATION
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Resizing & Normalization
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
                  Decoded RGB arrays are bilinearly interpolated to 224 × 224 × 3 and mapped to [-1, +1]:
                </p>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '8px 12px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                  X_norm = (X / 127.5) - 1.0
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', fontWeight: 600, marginBottom: '4px' }}>
                  STEP 02 · SPATIAL CONVOLUTION
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Discrete Cross-Correlation
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
                  Learned 3×3 weight kernels slide across the spatial grid to compute dot products:
                </p>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '8px 12px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                  S(i,j) = (I * K)(i,j) = Σ Σ I(i-m, j-n) K(m,n)
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', fontWeight: 600, marginBottom: '4px' }}>
                  STEP 03 · GLOBAL POOLING
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Spatial Feature Averaging
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
                  Feature maps (7 × 7 × 1280) are averaged into a 1,280-dimensional coordinate vector:
                </p>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '8px 12px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                  v_k = (1 / (H × W)) Σ Σ F(x, y, k)
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', fontWeight: 600, marginBottom: '4px' }}>
                  STEP 04 · LOGISTIC DECISION
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Sigmoid Activation
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
                  The classification perceptron squashes the log-odds scalar z into [0, 1]:
                </p>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '8px 12px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                  P(Dog) = σ(z) = 1 / (1 + e^(-z))
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Biological Morphological Markers Comparison */}
        <div>
          <ComparisonSection />
        </div>
      </div>
    </div>
  );
}
