import React, { useState, useRef, useEffect } from 'react';
import { CONVOLUTION_FILTERS } from '../data/filterPresets';

const STEPS = [
  {
    step: '01',
    title: 'Input Raster',
    short: 'Standardized RGB pixel arrays',
    detail: 'Digital images enter as grids of red, green, and blue (RGB) light intensities. Each photo is decoded and normalized to 224 × 224 pixels with 3 color channels.'
  },
  {
    step: '02',
    title: 'Spatial Convolution',
    short: 'Filters scan local visual patterns',
    detail: 'Mathematical 3 × 3 matrix kernels slide across the pixel grid. Computing element-wise dot products isolates contrast boundaries, gradients, and lines.'
  },
  {
    step: '03',
    title: 'Feature Hierarchy',
    short: 'Learning edges, textures, and morphology',
    detail: 'Early layers detect simple lines. Intermediate layers combine lines into fur textures and whisker patterns. Deep layers assemble complex contours into snouts, ears, and facial structures.'
  },
  {
    step: '04',
    title: 'Logistic Decision',
    short: 'Classification scalar distinguishes Dog vs Cat',
    detail: 'Global average pooling aggregates the 1,280 feature maps into a vector. A sigmoid activation maps the log-odds scalar to the probability interval [0, 1].'
  }
];

export default function HowCnnSeesSection() {
  const [selectedFilter, setSelectedFilter] = useState(CONVOLUTION_FILTERS[0]);
  const [selectedSpecimen, setSelectedSpecimen] = useState('/samples/sample_cat_1.jpg');
  const canvasRef = useRef(null);

  // Apply real 3x3 convolution kernel onto HTML5 canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedSpecimen;

    img.onload = () => {
      canvas.width = 224;
      canvas.height = 224;

      // Draw original image scaled to 224x224
      ctx.drawImage(img, 0, 0, 224, 224);

      // Extract raw pixel data
      const imgData = ctx.getImageData(0, 0, 224, 224);
      const src = imgData.data;
      const output = ctx.createImageData(224, 224);
      const dst = output.data;

      const kernel = selectedFilter.kernel;
      const divisor = selectedFilter.divisor || 1;
      const offset = selectedFilter.offset || 0;

      // Apply 3x3 kernel convolution
      for (let y = 1; y < 223; y++) {
        for (let x = 1; x < 223; x++) {
          let r = 0, g = 0, b = 0;

          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const pixelIdx = ((y + ky) * 224 + (x + kx)) * 4;
              const weight = kernel[ky + 1][kx + 1];

              r += src[pixelIdx] * weight;
              g += src[pixelIdx + 1] * weight;
              b += src[pixelIdx + 2] * weight;
            }
          }

          const outIdx = (y * 224 + x) * 4;
          dst[outIdx] = Math.min(255, Math.max(0, r / divisor + offset));
          dst[outIdx + 1] = Math.min(255, Math.max(0, g / divisor + offset));
          dst[outIdx + 2] = Math.min(255, Math.max(0, b / divisor + offset));
          dst[outIdx + 3] = 255;
        }
      }

      ctx.putImageData(output, 0, 0);
    };
  }, [selectedFilter, selectedSpecimen]);

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Section Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="section-eyebrow">
            Educational Foundations
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Mathematical Convolution & Feature Learning
          </span>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          How the Neural Network Sees
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '680px' }}>
          How convolutional layers break down high-resolution photographs into spatial feature maps to distinguish feline from canine morphology.
        </p>
      </div>

      {/* 4 Architectural Stages (Numbered Steps) */}
      <div className="grid-4" style={{ marginBottom: '36px' }}>
        {STEPS.map((s) => (
          <div 
            key={s.step} 
            className="tech-card"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', fontWeight: 600, marginBottom: '6px' }}>
                Stage {s.step}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {s.title}
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                {s.short}
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {s.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Interactive 3x3 Convolution Simulator */}
      <div className="tech-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Interactive 3 × 3 Convolution Kernel Simulator
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Live in-browser spatial convolution calculating discrete cross-correlation on real test pixels
            </div>
          </div>

          {/* Specimen Picker */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Specimen:</span>
            <button
              type="button"
              className={`btn btn-sm ${selectedSpecimen === '/samples/sample_cat_1.jpg' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedSpecimen('/samples/sample_cat_1.jpg')}
              style={{ fontSize: '0.75rem', padding: '5px 10px' }}
            >
              Cat (Whiskers)
            </button>
            <button
              type="button"
              className={`btn btn-sm ${selectedSpecimen === '/samples/sample_dog_1.jpg' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedSpecimen('/samples/sample_dog_1.jpg')}
              style={{ fontSize: '0.75rem', padding: '5px 10px' }}
            >
              Dog (Muzzle)
            </button>
          </div>
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          {/* Left: Filter Buttons & Kernel Weights Matrix */}
          <div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Select Convolution Filter:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '18px' }}>
              {CONVOLUTION_FILTERS.map((f) => {
                const isSelected = selectedFilter.id === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFilter(f)}
                    style={{
                      padding: '8px 10px',
                      background: isSelected ? 'var(--accent-sage)' : 'var(--bg-surface)',
                      border: isSelected ? '1px solid var(--accent-green)' : '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-xs)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: isSelected ? 'var(--accent-green)' : 'var(--text-primary)' }}>
                      {f.name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {f.category}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 3x3 Kernel Matrix Display */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Active 3 × 3 Kernel Weights (W)
                </span>
                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  Divisor: {selectedFilter.divisor || 1} • Offset: {selectedFilter.offset || 0}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', maxWidth: '240px', margin: '0 auto 10px auto' }}>
                {selectedFilter.kernel.map((row, rIdx) =>
                  row.map((val, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid var(--border-medium)',
                        borderRadius: '3px',
                        padding: '6px',
                        textAlign: 'center',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: val !== 0 ? 'var(--text-primary)' : 'var(--text-muted)'
                      }}
                    >
                      {val}
                    </div>
                  ))
                )}
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.4 }}>
                {selectedFilter.description}
              </div>
            </div>
          </div>

          {/* Right: Real Canvas Feature Map Output */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Transformed Feature Activation Map
            </div>

            <div style={{ width: '224px', height: '224px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-xs)', overflow: 'hidden', background: '#FFFFFF', boxShadow: 'var(--shadow-xs)' }}>
              <canvas
                ref={canvasRef}
                width={224}
                height={224}
                style={{ display: 'block', width: '100%', height: '100%' }}
              />
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'center' }}>
              Computed in real time via JavaScript 2D context array buffers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
