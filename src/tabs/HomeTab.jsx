import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { SAMPLE_IMAGES } from '../services/sampleData';

export default function HomeTab({ onNavigate, onSelectSpecimen }) {
  const handleSelectSample = (sample) => {
    if (onSelectSpecimen) {
      onSelectSpecimen(sample);
    }
    onNavigate('classifier');
  };

  const sampleCat = SAMPLE_IMAGES.find((s) => s.species === 'cat') || SAMPLE_IMAGES[0];
  const sampleDog = SAMPLE_IMAGES.find((s) => s.species === 'dog') || SAMPLE_IMAGES[2];

  return (
    <div className="tab-pane-container">
      <div className="container">
        {/* Editorial Introduction */}
        <div style={{ maxWidth: '780px', margin: '16px 0 40px 0' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span className="section-eyebrow">
              PawVision AI Lab
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Kaggle Dogs vs Cats Benchmark
            </span>
          </div>

          <h1 
            style={{
              fontSize: 'clamp(2.2rem, 4.2vw, 3.2rem)',
              fontWeight: 700,
              lineHeight: 1.16,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
              marginBottom: '18px'
            }}
          >
            Distinguishing canine and feline morphology with convolutional neural networks.
          </h1>

          <p 
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              marginBottom: '28px'
            }}
          >
            PawVision AI is an applied computer vision research laboratory exploring binary image classification across 20,000 photographic samples. Utilizing a fine-tuned MobileNetV2 architecture to learn discriminatory biological features like ear curvature, muzzle geometry, and facial texture.
          </p>

          {/* Primary Action Button */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <button 
              type="button" 
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('classifier')}
            >
              <span>Try the classifier</span>
              <ArrowRight size={16} />
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-lg"
              onClick={() => onNavigate('dataset')}
            >
              <span>View dataset</span>
            </button>
          </div>
        </div>

        {/* Interactive Benchmark Gallery */}
        <div 
          className="tech-card" 
          style={{ 
            padding: '24px', 
            marginBottom: '36px',
            background: 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', textTransform: 'uppercase', fontWeight: 600 }}>
                Interactive Benchmark Gallery
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Click any specimen below to immediately run real neural inference:
              </div>
            </div>
            <span className="badge badge-green">
              98.55% Validation Accuracy
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {SAMPLE_IMAGES.slice(0, 4).map((sample) => (
              <div 
                key={sample.id}
                role="button"
                tabIndex={0}
                aria-label={`Select ${sample.name}`}
                onClick={() => handleSelectSample(sample)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectSample(sample);
                  }
                }}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                className="specimen-card"
              >
                <div style={{ height: '160px', overflow: 'hidden', background: '#ECECE6' }}>
                  <img 
                    src={sample.url} 
                    alt={sample.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {sample.name}
                    </div>
                    <span 
                      style={{ 
                        fontSize: '0.68rem', 
                        fontFamily: 'var(--font-mono)', 
                        background: sample.category === 'unsupported' ? '#FBF5EE' : 'var(--bg-card)',
                        color: sample.category === 'unsupported' ? '#8C5212' : 'var(--accent-green)',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        border: '1px solid var(--border-subtle)',
                        fontWeight: 600
                      }}
                    >
                      {sample.category === 'cat' ? 'Feline' : sample.category === 'dog' ? 'Canine' : 'OOD Test'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                    {sample.keyFeatures?.slice(0, 2).join(' • ') || sample.species}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick test non-animal OOD specimens */}
          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Test Out-of-Distribution rejection:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {SAMPLE_IMAGES.filter(s => s.category === 'unsupported').map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectSample(s)}
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '4px 9px',
                    borderRadius: 'var(--radius-xs)',
                    background: 'var(--bg-surface)',
                    border: '1px dashed rgba(178, 109, 30, 0.4)',
                    color: '#8C5212',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>Test {s.name}</span>
                  <ArrowRight size={11} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notes from the Research Lab (Authentic Human Engineering Perspective) */}
        <div 
          className="tech-card" 
          style={{ 
            padding: '22px 24px', 
            marginBottom: '40px',
            background: 'var(--bg-card)',
            borderLeft: '4px solid var(--accent-green)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', textTransform: 'uppercase', fontWeight: 600 }}>
              Notes from the Lab
            </span>
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
            Why We Chose MobileNetV2 Over Heavier Architectures
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            In academic machine learning, bigger is not always better. While VGG16 has 138 million parameters and ResNet-50 has 25 million, MobileNetV2 achieves <strong>98.55% validation accuracy with only 2.26 million parameters</strong>. By utilizing depthwise separable convolutions, inference executes in under 30ms on standard CPUs without requiring expensive cloud GPUs. Our independent ImageNet-1K screening gate also solves the classic binary classification flaw by rejecting non-pets before inference runs.
          </p>
        </div>

        {/* Key Model & Benchmark Metrics Row */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '48px'
          }}
        >
          <div className="tech-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Validation Accuracy
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-green)', lineHeight: 1.1 }}>
              98.55%
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              3,942 / 4,000 validation images
            </div>
          </div>

          <div className="tech-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Dataset Size
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              20,000
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Balanced 10,000 cats / 10,000 dogs
            </div>
          </div>

          <div className="tech-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Architecture
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              MobileNetV2
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Depthwise separable convolutions
            </div>
          </div>

          <div className="tech-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Validation Loss
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              0.0409
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Binary cross-entropy loss
            </div>
          </div>
        </div>

        {/* Editorial Project Breakdown (Numbered Steps) */}
        <div style={{ borderTop: '1px solid var(--border-medium)', paddingTop: '40px' }}>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>
            Research Pipeline
          </div>

          <div className="grid-3">
            <div>
              <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', fontWeight: 600, marginBottom: '6px' }}>
                01 · Photographic Ingestion
              </div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Standardized RGB Arrays
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Input images are decoded into 3-channel RGB matrices, rescaled to 224 × 224 pixels, and normalized into standard floating-point tensors.
              </p>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', fontWeight: 600, marginBottom: '6px' }}>
                02 · Feature Extraction
              </div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Hierarchical Convolutions
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Inverted residual blocks extract low-level edges, intermediate fur textures, and high-level morphological landmarks.
              </p>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', fontWeight: 600, marginBottom: '6px' }}>
                03 · Logistic Inference
              </div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Calibrated Probability
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                A dense classification layer computes sigmoid activations, mapping the 1,280 pooled features to class probabilities with an empirical 98.55% accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
