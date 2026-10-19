import React from 'react';

const TECHNOLOGIES = [
  {
    name: 'Python',
    role: 'Language & Backend Runtime',
    status: 'FastAPI Service',
    desc: 'Core environment for data loading, inference endpoints, tensor transformations, and training scripts.'
  },
  {
    name: 'TensorFlow & Keras',
    role: 'Deep Learning Engine',
    status: 'Trained Weights Active',
    desc: 'Framework used for transfer learning, layer definition, loss backpropagation, and serializing weights.'
  },
  {
    name: 'MobileNetV2',
    role: 'Convolutional Backbone',
    status: '2.26M Parameters',
    desc: 'Inverted residual bottleneck architecture optimized for high visual accuracy with minimal computational overhead.'
  },
  {
    name: 'Pillow (PIL)',
    role: 'Image Decoding & Verification',
    status: 'Validation Gate',
    desc: 'Decodes JPEG/PNG buffers, validates image dimensions, and guards against corrupt payloads.'
  },
  {
    name: 'React 18 + Vite',
    role: 'Frontend Research Lab',
    status: 'Static SPA',
    desc: 'Responsive user interface with client-side hash routing, interactive canvas simulator, and API integration.'
  },
  {
    name: 'Kaggle Dataset',
    role: 'Benchmark Corpus',
    status: '20,000 Images',
    desc: 'Canonical Dogs vs. Cats dataset providing 10,000 canine and 10,000 feline photographic samples.'
  }
];

export default function TechStackSection() {
  return (
    <div>
      {/* Section Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="section-eyebrow">
            Engineering Foundations
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            System Architecture
          </span>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
          Technology Stack
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '640px' }}>
          The computational tools, frameworks, and datasets supporting end-to-end model training and inference.
        </p>
      </div>

      {/* Technology Grid */}
      <div className="grid-3" style={{ gap: '16px' }}>
        {TECHNOLOGIES.map((tech) => (
          <div key={tech.name} className="tech-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {tech.name}
              </h3>
              <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>
                {tech.status}
              </span>
            </div>

            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', marginBottom: '8px' }}>
              {tech.role}
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {tech.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
