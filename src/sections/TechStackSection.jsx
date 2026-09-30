import React from 'react';
import { Code, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';

const TECHNOLOGIES = [
  {
    name: 'Python',
    role: 'Language & Model Runtime',
    status: 'Planned / optional (Backend)',
    statusType: 'optional',
    desc: 'Core environment for neural network modeling, training scripts, and batch data loaders.'
  },
  {
    name: 'CNN (Convolutional Neural Network)',
    role: 'Core ML Technique',
    status: 'Architected / Modeled',
    statusType: 'confirmed',
    desc: 'Hierarchical feature learning architecture utilizing Conv2D, ReLU non-linearities, and spatial pooling.'
  },
  {
    name: 'Computer Vision',
    role: 'Domain Methodology',
    status: 'Core Implementation',
    statusType: 'confirmed',
    desc: 'Image preprocessing, 2D matrix spatial convolution, normalization, and visual feature extraction.'
  },
  {
    name: 'TensorFlow / Keras',
    role: 'Deep Learning Framework',
    status: 'Planned / optional (Backend)',
    statusType: 'optional',
    desc: 'Framework for definition, loss backpropagation, and weight serialization (.keras / .h5).'
  },
  {
    name: 'NumPy',
    role: 'Tensor & Matrix Computing',
    status: 'Planned / optional (Backend)',
    statusType: 'optional',
    desc: 'High-performance n-dimensional array manipulation for batch image vectorization.'
  },
  {
    name: 'OpenCV',
    role: 'Image Preprocessing',
    status: 'Planned / optional (Backend)',
    statusType: 'optional',
    desc: 'Spatial transforms, bilinear interpolation, color space conversions, and geometric resizing.'
  },
  {
    name: 'Kaggle Dataset',
    role: 'Training Corpus',
    status: 'Benchmark Source',
    statusType: 'confirmed',
    desc: 'Canonical Dogs vs Cats dataset providing balanced binary labeled photographic examples.'
  },
  {
    name: 'React + Vite',
    role: 'Frontend & UI Lab',
    status: 'Active Implementation',
    statusType: 'confirmed',
    desc: 'High-performance static SPA client deployed to Cloudflare Pages with live pipeline simulator.'
  }
];

export default function TechStackSection() {
  return (
    <section id="tech-stack" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            SYSTEM ARCHITECTURE & TOOLING
          </div>
          <h2 className="section-title">
            TECH STACK
          </h2>
          <p className="section-subtitle">
            Technology ecosystem supporting model training, computer vision pipelines, and web deployment.
          </p>
        </div>

        {/* Stack Grid */}
        <div className="grid-4">
          {TECHNOLOGIES.map((tech) => {
            const isConfirmed = tech.statusType === 'confirmed';
            return (
              <div 
                key={tech.name}
                className="tech-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-medium)',
                  padding: '20px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span 
                      className={`badge ${isConfirmed ? 'badge-cyan' : 'badge-neutral'}`}
                      style={{ fontSize: '0.62rem' }}
                    >
                      {tech.status}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {tech.name}
                  </h4>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)', marginBottom: '10px' }}>
                    {tech.role}
                  </div>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {tech.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Technical Integrity Footnote */}
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          * Technologies marked "Planned / optional" represent candidate training dependencies for the backend service, not active dependencies of the static web frontend.
        </div>
      </div>
    </section>
  );
}
