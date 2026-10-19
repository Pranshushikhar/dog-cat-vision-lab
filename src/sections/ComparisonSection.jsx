import React, { useState } from 'react';

const ANNOTATION_TYPES = [
  { id: 'edge', label: 'Edges & Contours', desc: 'High-contrast spatial gradients defining silhouettes and facial perimeter' },
  { id: 'texture', label: 'Fur Texture', desc: 'Micro-patterns: coarse double-coat fur vs fine agouti tabby stripes' },
  { id: 'shape', label: 'Cranial Shape', desc: 'Geometric primitives: elongated muzzle vs wedge skull & triangular pinnae' },
  { id: 'pattern', label: 'Facial Markers', desc: 'Anatomical cues: whiskers, eye slit geometry, nose apex' }
];

export default function ComparisonSection() {
  const [activeAnnotation, setActiveAnnotation] = useState('edge');

  return (
    <div>
      {/* Section Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="section-eyebrow">
            Morphological Discrimination
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Canine vs Feline Diagnostic Cues
          </span>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
          What the Model Learns
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '640px' }}>
          Explanatory comparison of biological visual features that the convolutional network maps to binary representations.
        </p>
      </div>

      {/* Feature Selector Strip */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}
      >
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '4px' }}>
          Feature Category:
        </span>
        {ANNOTATION_TYPES.map((a) => (
          <button
            key={a.id}
            type="button"
            className={`btn btn-sm ${activeAnnotation === a.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveAnnotation(a.id)}
            style={{ fontSize: '0.75rem', padding: '5px 12px' }}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Two-Column Real Photographic Comparison */}
      <div className="grid-2">
        {/* Cat Card */}
        <div className="tech-card" style={{ padding: '20px' }}>
          <div style={{ height: '220px', overflow: 'hidden', borderRadius: 'var(--radius-xs)', background: '#EAEBE3', marginBottom: '14px' }}>
            <img 
              src="/samples/sample_cat_1.jpg" 
              alt="Cat morphology"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Feline Morphological Profile
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 600, marginBottom: '8px' }}>
            Class 0 • P(Dog) &lt; 0.5
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            {activeAnnotation === 'edge' && 'Sharp upright triangular ears (pinnae), compact facial contour, and distinct whisker pads.'}
            {activeAnnotation === 'texture' && 'Fine dense coat textures, agouti banded hairs, and subtle micro-shadowing.'}
            {activeAnnotation === 'shape' && 'Wedge-shaped cranial structure, round forehead, and short, recessed rostrum.'}
            {activeAnnotation === 'pattern' && 'Vertical slit pupils in high light, bilateral whisker arrays, and small triangular nose apex.'}
          </p>
        </div>

        {/* Dog Card */}
        <div className="tech-card" style={{ padding: '20px' }}>
          <div style={{ height: '220px', overflow: 'hidden', borderRadius: 'var(--radius-xs)', background: '#EAEBE3', marginBottom: '14px' }}>
            <img 
              src="/samples/sample_dog_1.jpg" 
              alt="Dog morphology"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Canine Morphological Profile
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 600, marginBottom: '8px' }}>
            Class 1 • P(Dog) ≥ 0.5
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            {activeAnnotation === 'edge' && 'Elongated muzzle silhouette, variable drooped or upright pinnae, and prominent stop gradient.'}
            {activeAnnotation === 'texture' && 'Coarser topcoat fur, varied hair length, and directional feathering along limbs.'}
            {activeAnnotation === 'shape' && 'Pronounced sagittal crest, elongated jawline, and distinct stop angle.'}
            {activeAnnotation === 'pattern' && 'Large pigmented nasal planum, circular pupils, and prominent oral commissure.'}
          </p>
        </div>
      </div>
    </div>
  );
}
