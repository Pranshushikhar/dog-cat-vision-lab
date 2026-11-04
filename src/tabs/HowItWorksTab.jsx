import React from 'react';
import { UploadCloud, CheckCircle2, ShieldCheck, Cpu, Sliders, Award, ArrowDown, ArrowRight, Eye, Layers } from 'lucide-react';
import HowCnnSeesSection from '../sections/HowCnnSeesSection';
import ComparisonSection from '../sections/ComparisonSection';

const PIPELINE_STAGES = [
  {
    step: '01',
    title: 'Upload Image',
    badge: 'INGESTION',
    icon: UploadCloud,
    input: 'User photograph (JPG, PNG, WebP)',
    process: 'Receives user photographic upload via drag-drop, file picker, or clipboard paste. Client optimizes large camera images before transfer.',
    output: 'Raw binary stream (up to 10 MB)',
    tag: 'Client / API Gateway'
  },
  {
    step: '02',
    title: 'Image Validation',
    badge: 'SECURITY',
    icon: CheckCircle2,
    input: 'Binary image buffer',
    process: 'Inspects file headers, decodes raster payload, rejects corrupt byte streams, and verifies minimum dimensions (min 10 × 10 px).',
    output: 'Verified 3-channel RGB matrix',
    tag: 'Input Validation Gate'
  },
  {
    step: '03',
    title: 'OOD Screening',
    badge: 'RESPONSIBLE AI',
    icon: ShieldCheck,
    input: 'RGB raster matrix',
    process: 'Independent ImageNet-1K MobileNetV2 evaluates 143 feline & canine classes vs 857 open-domain categories. Rejects non-pets before binary scoring.',
    output: 'Accepted pet or "Unsupported Image"',
    tag: 'ImageNet-1K Gate'
  },
  {
    step: '04',
    title: 'Image Preprocessing',
    badge: 'TENSOR PIPELINE',
    icon: Layers,
    input: 'Verified pet image',
    process: 'Bilinearly resizes to standardized 224 × 224 resolution and normalizes floating-point pixel intensities to the range [-1.0, +1.0].',
    output: 'Tensor shape (1, 224, 224, 3)',
    tag: 'NumPy / TensorFlow'
  },
  {
    step: '05',
    title: 'MobileNetV2 Backbone',
    badge: 'CONVOLUTION',
    icon: Cpu,
    input: 'Input tensor (1, 224, 224, 3)',
    process: 'Passes through inverted residual bottleneck blocks with depthwise separable convolutions to isolate ears, muzzle, and fur textures into 1,280 pooled features.',
    output: 'Feature vector (1, 1280)',
    tag: '2.26M Parameters'
  },
  {
    step: '06',
    title: 'Cat/Dog Probabilities',
    badge: 'LOGISTIC SCORING',
    icon: Sliders,
    input: '1,280 feature coordinates',
    process: 'Dense perceptron layer computes log-odds scalar z and applies sigmoid activation: P(Dog) = 1 / (1 + e^-z); P(Cat) = 1 - P(Dog).',
    output: 'Probabilities [P(Cat), P(Dog)]',
    tag: 'Sigmoid Activation'
  },
  {
    step: '07',
    title: 'Prediction Result',
    badge: 'CLASSIFICATION',
    icon: Award,
    input: 'Class probabilities',
    process: 'Compares P(Dog) against the confidence decision threshold (default 50%). Formats result, measures latency, highlights morphological Grad-CAM pins, and presents result.',
    output: 'Class (CAT/DOG) + Confidence %',
    tag: 'Calibrated Inference'
  }
];

export default function HowItWorksTab() {
  return (
    <div className="tab-pane-container">
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* Section Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="section-eyebrow">
              End-to-End Visual Architecture
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              7-Stage Processing Pipeline
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            How PawVision AI Works
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '720px' }}>
            Follow the complete journey of a photograph—from raw image ingestion and out-of-distribution screening through inverted residual convolutions and calibrated probability scoring.
          </p>
        </div>

        {/* 7-Stage Visual Pipeline Diagram */}
        <div 
          className="tech-card" 
          style={{ 
            padding: '28px', 
            marginBottom: '40px',
            background: 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', textTransform: 'uppercase', fontWeight: 600 }}>
                Inference Data Flow
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                The 7-Stage Vision Pipeline
              </h3>
            </div>
            <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
              Sub-50ms CPU Execution
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {PIPELINE_STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <div key={stage.step}>
                  <div 
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '16px 20px',
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto',
                      gap: '16px',
                      alignItems: 'center',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                    }}
                    className="hover-card"
                  >
                    {/* Stage Step Number & Icon */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div 
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: 'var(--accent-teal-subtle)',
                          color: 'var(--accent-teal)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {stage.step}
                      </div>
                      <div 
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-medium)',
                          color: 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Icon size={16} />
                      </div>
                    </div>

                    {/* Stage Name & Process Description */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                          {stage.title}
                        </h4>
                        <span 
                          style={{ 
                            fontSize: '0.66rem', 
                            fontFamily: 'var(--font-mono)', 
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            color: 'var(--accent-teal)',
                            fontWeight: 600
                          }}
                        >
                          {stage.badge}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.81rem', color: 'var(--text-secondary)', margin: '0 0 6px 0', lineHeight: 1.45 }}>
                        {stage.process}
                      </p>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        <span><strong>IN:</strong> {stage.input}</span>
                        <span><strong>OUT:</strong> {stage.output}</span>
                      </div>
                    </div>

                    {/* Right Tag */}
                    <div style={{ textAlign: 'right' }}>
                      <span 
                        style={{ 
                          fontSize: '0.72rem', 
                          fontFamily: 'var(--font-mono)', 
                          color: 'var(--text-muted)', 
                          background: 'var(--bg-card)', 
                          border: '1px solid var(--border-medium)', 
                          padding: '3px 8px', 
                          borderRadius: 'var(--radius-xs)' 
                        }}
                      >
                        {stage.tag}
                      </span>
                    </div>
                  </div>

                  {/* Flow Arrow between steps */}
                  {idx < PIPELINE_STAGES.length - 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
                      <ArrowDown size={14} style={{ color: 'var(--accent-teal)', opacity: 0.7 }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Educational Stages & Interactive 3x3 Kernel Convolution Simulator */}
        <HowCnnSeesSection />

        {/* 3. Mathematical Pipeline Breakdown Card */}
        <div style={{ marginTop: '40px', marginBottom: '40px' }}>
          <div className="tech-card" style={{ padding: '28px' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', textTransform: 'uppercase', marginBottom: '4px' }}>
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
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', fontWeight: 600, marginBottom: '4px' }}>
                  STEP 01 · STANDARDIZATION
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Resizing &amp; Normalization
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
                  Decoded RGB arrays are bilinearly interpolated to 224 × 224 × 3 and mapped to [-1, +1]:
                </p>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '8px 12px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                  X_norm = (X / 127.5) - 1.0
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', fontWeight: 600, marginBottom: '4px' }}>
                  STEP 02 · SPATIAL CONVOLUTION
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Discrete Cross-Correlation
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
                  Learned 3×3 weight kernels slide across the spatial grid to compute dot products:
                </p>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '8px 12px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                  S(i,j) = (I * K)(i,j) = &Sigma; &Sigma; I(i-m, j-n) K(m,n)
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', fontWeight: 600, marginBottom: '4px' }}>
                  STEP 03 · GLOBAL POOLING
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Spatial Feature Averaging
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
                  Feature maps (7 × 7 × 1280) are averaged into a 1,280-dimensional coordinate vector:
                </p>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '8px 12px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                  v_k = (1 / (H &times; W)) &Sigma; &Sigma; F(x, y, k)
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', fontWeight: 600, marginBottom: '4px' }}>
                  STEP 04 · LOGISTIC DECISION
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Sigmoid Activation
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
                  The classification perceptron squashes the log-odds scalar z into [0, 1]:
                </p>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '8px 12px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                  P(Dog) = &sigma;(z) = 1 / (1 + e^(-z))
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Biological Morphological Markers Comparison */}
        <div>
          <ComparisonSection />
        </div>
      </div>
    </div>
  );
}
