import React, { useState } from 'react';
import { Layers, Eye, Cpu, Zap, Sparkles } from 'lucide-react';

const ANNOTATION_TYPES = [
  { id: 'edge', label: 'EDGE', desc: 'High-contrast spatial gradients defining silhouettes and facial perimeter' },
  { id: 'texture', label: 'TEXTURE', desc: 'Micro-patterns: coarse double-coat fur vs fine agouti tabby stripes' },
  { id: 'shape', label: 'SHAPE', desc: 'Geometric primitives: elongated muzzle vs wedge skull & triangular pinnae' },
  { id: 'pattern', label: 'PATTERN', desc: 'Complex anatomical markers: whiskers, eye slit geometry, nose apex' }
];

export default function ComparisonSection() {
  const [activeAnnotation, setActiveAnnotation] = useState('edge');

  return (
    <section id="comparison" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            MORPHOLOGICAL FEATURE DISCRIMINATION
          </div>
          <h2 className="section-title">
            WHAT THE MODEL LEARNS
          </h2>
          <p className="section-subtitle">
            Explanatory comparison of biological visual features that the convolutional network maps to binary representations.
          </p>
        </div>

        {/* Annotation Selector Controls */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '32px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Inspect Explanatory Feature Layer:
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {ANNOTATION_TYPES.map((a) => (
              <button
                key={a.id}
                type="button"
                className={`btn btn-sm ${activeAnnotation === a.id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveAnnotation(a.id)}
                style={{ fontSize: '0.75rem', padding: '6px 14px' }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Two Visual Panels: Dog vs Cat */}
        <div className="grid-2">
          {/* Dog Visual Panel */}
          <div className="tech-card" style={{ padding: '24px', background: 'var(--bg-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-blue">CLASS 1 // DOG</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CANINE FEATURES</span>
              </div>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>
                FILTER: {activeAnnotation.toUpperCase()}
              </span>
            </div>

            {/* Specimen Frame with Dynamic Feature Overlay */}
            <div 
              style={{
                position: 'relative',
                width: '100%',
                height: '300px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                background: '#04060A',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}
            >
              <img 
                src="/samples/sample_dog_1.svg" 
                alt="Canine morphology specimen" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />

              {/* Explanatory Annotations */}
              {activeAnnotation === 'edge' && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <div style={{ position: 'absolute', top: '25%', left: '15%', border: '1px solid var(--accent-blue)', background: 'rgba(77,163,255,0.15)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>
                    Lateral Ear Boundary
                  </div>
                  <div style={{ position: 'absolute', bottom: '22%', right: '15%', border: '1px solid var(--accent-blue)', background: 'rgba(77,163,255,0.15)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>
                    Broad Muzzle Contour
                  </div>
                </div>
              )}

              {activeAnnotation === 'texture' && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <div style={{ position: 'absolute', top: '35%', left: '30%', border: '1px dashed var(--accent-blue)', background: 'rgba(77,163,255,0.15)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#FFFFFF' }}>
                    Forehead Fur Grain (Coarse)
                  </div>
                </div>
              )}

              {activeAnnotation === 'shape' && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <div style={{ position: 'absolute', top: '48%', left: '35%', border: '1px solid var(--accent-cyan)', background: 'rgba(85,230,208,0.15)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                    Elongated Rostral Snout
                  </div>
                </div>
              )}

              {activeAnnotation === 'pattern' && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <div style={{ position: 'absolute', top: '40%', left: '26%', border: '1px solid var(--accent-violet)', background: 'rgba(108,99,255,0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#FFFFFF' }}>
                    Almond Eye + Dark Sclera
                  </div>
                  <div style={{ position: 'absolute', bottom: '34%', left: '38%', border: '1px solid var(--accent-violet)', background: 'rgba(108,99,255,0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#FFFFFF' }}>
                    Canine Rhinaris (Nose Pad)
                  </div>
                </div>
              )}
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong>Canine Diagnostic Markers:</strong> Neural filters in layers 2–3 respond prominently to the elongated horizontal snout profile and rounded ear bases characteristic of Canidae.
            </div>
          </div>

          {/* Cat Visual Panel */}
          <div className="tech-card" style={{ padding: '24px', background: 'var(--bg-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-cyan">CLASS 0 // CAT</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>FELINE FEATURES</span>
              </div>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                FILTER: {activeAnnotation.toUpperCase()}
              </span>
            </div>

            {/* Specimen Frame with Dynamic Feature Overlay */}
            <div 
              style={{
                position: 'relative',
                width: '100%',
                height: '300px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                background: '#04060A',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}
            >
              <img 
                src="/samples/sample_cat_1.svg" 
                alt="Feline morphology specimen" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />

              {/* Explanatory Annotations */}
              {activeAnnotation === 'edge' && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <div style={{ position: 'absolute', top: '16%', left: '20%', border: '1px solid var(--accent-cyan)', background: 'rgba(85,230,208,0.15)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                    Erect Triangular Apex
                  </div>
                  <div style={{ position: 'absolute', bottom: '32%', left: '12%', border: '1px solid var(--accent-cyan)', background: 'rgba(85,230,208,0.15)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                    Horizontal Whisker Rays
                  </div>
                </div>
              )}

              {activeAnnotation === 'texture' && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <div style={{ position: 'absolute', top: '34%', left: '32%', border: '1px dashed var(--accent-cyan)', background: 'rgba(85,230,208,0.15)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#FFFFFF' }}>
                    Agouti Tabby Stripes ("M" Motif)
                  </div>
                </div>
              )}

              {activeAnnotation === 'shape' && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <div style={{ position: 'absolute', top: '45%', left: '34%', border: '1px solid var(--accent-blue)', background: 'rgba(77,163,255,0.15)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>
                    Compact Triangular Cranium
                  </div>
                </div>
              )}

              {activeAnnotation === 'pattern' && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <div style={{ position: 'absolute', top: '42%', left: '30%', border: '1px solid var(--accent-violet)', background: 'rgba(108,99,255,0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#FFFFFF' }}>
                    Elliptical Slit Pupil
                  </div>
                  <div style={{ position: 'absolute', bottom: '32%', right: '12%', border: '1px solid var(--accent-violet)', background: 'rgba(108,99,255,0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#FFFFFF' }}>
                    Vibrissae Whisker Filaments
                  </div>
                </div>
              )}
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong>Feline Diagnostic Markers:</strong> High-frequency edge filters detect sharp triangular ear vertices and slender whisker filaments characteristic of Felidae.
            </div>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          * Visual annotations represent explanatory biological cues, not fabricated model attention activation heatmaps.
        </div>
      </div>
    </section>
  );
}
