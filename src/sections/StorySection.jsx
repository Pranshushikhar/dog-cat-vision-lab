import React from 'react';

const TIMELINE_STEPS = [
  {
    num: '01',
    phase: 'Problem Definition',
    title: 'Distinguishing Visual Classes',
    desc: 'How can a computational vision pipeline separate domestic canines and felines across arbitrary lighting, poses, occlusion, and background clutter without manual heuristics?'
  },
  {
    num: '02',
    phase: 'Corpus Preparation',
    title: 'Kaggle Dogs vs Cats Corpus',
    desc: 'Ingesting and auditing 20,000 photographic examples. Standardizing variable aspect ratios to 224 × 224 RGB tensors with train/validation isolation.'
  },
  {
    num: '03',
    phase: 'Architecture',
    title: 'Convolutional Feature Representation',
    desc: 'Employing depthwise separable convolutions and inverted residual bottlenecks (MobileNetV2) to extract spatial hierarchies with high parameter efficiency.'
  },
  {
    num: '04',
    phase: 'Optimization',
    title: 'Transfer Learning & Fine-Tuning',
    desc: 'Leveraging ImageNet feature priors with an unregularized dense classification head. Training with binary cross-entropy loss and Adam optimizer.'
  },
  {
    num: '05',
    phase: 'Empirical Verification',
    title: 'Benchmark Generalization',
    desc: 'Rigorous validation on 4,000 unseen images, reaching 98.55% accuracy and an F1 score of 98.57% across canine and feline test splits.'
  },
  {
    num: '06',
    phase: 'Laboratory Deployment',
    title: 'PawVision AI Deployment',
    desc: 'Exposing the PawVision AI pipeline through an accessible web interface with live client-side simulator, FastAPI inference backend, and Cloudflare Worker / Pages hosting.'
  }
];

export default function StorySection() {
  return (
    <div>
      {/* Section Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="section-eyebrow">
            Research Context
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Project Narrative & Methodology
          </span>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Research Narrative & Chronology
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '680px' }}>
          How this project evolved from foundational problem formulation to a validated computer vision research system.
        </p>
      </div>

      {/* Numbered Narrative Steps Grid */}
      <div className="grid-3" style={{ gap: '16px' }}>
        {TIMELINE_STEPS.map((s) => (
          <div 
            key={s.num} 
            className="tech-card"
            style={{ 
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', fontWeight: 600 }}>
                  Phase {s.num}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {s.phase}
                </span>
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {s.title}
              </h3>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
