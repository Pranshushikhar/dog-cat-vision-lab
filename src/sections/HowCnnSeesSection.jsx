import React, { useState, useRef, useEffect } from 'react';
import { CONVOLUTION_FILTERS } from '../data/filterPresets';
import { Eye, Layers, Cpu, CheckCircle2, Sliders, Sparkles } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'INPUT',
    short: 'The image enters the network',
    detail: 'Digital images are stored as grids of numbers representing red, green, and blue (RGB) light intensities. For our CNN, each photo is standardized to 224 × 224 pixels with 3 color channels.',
    icon: Eye,
    color: '#4DA3FF'
  },
  {
    step: '02',
    title: 'CONVOLUTION',
    short: 'Filters scan local visual patterns',
    detail: 'Small mathematical grids called kernels (e.g., 3 × 3 matrix of numbers) slide across the image pixels. By computing element-wise dot products, they react strongly when specific patterns match the filter.',
    icon: Layers,
    color: '#6C63FF'
  },
  {
    step: '03',
    title: 'FEATURE EXTRACTION',
    short: 'The network learns edges, textures, and shapes',
    detail: 'Early layers detect elementary lines and contrast boundaries. Intermediate layers combine lines into textures and curves (whiskers, fur). Deep layers aggregate curves into complex anatomical shapes (snouts, triangular ears).',
    icon: Cpu,
    color: '#55E6D0'
  },
  {
    step: '04',
    title: 'CLASSIFICATION',
    short: 'Learned representation distinguishes DOG vs CAT',
    detail: 'The final dense layers flatten all extracted spatial features into numerical coordinates. A decision function (Sigmoid/Softmax) weighs whether these features are characteristic of a canine or feline.',
    icon: CheckCircle2,
    color: '#FFA24C'
  }
];

export default function HowCnnSeesSection() {
  const [selectedFilter, setSelectedFilter] = useState(CONVOLUTION_FILTERS[0]);
  const [selectedSpecimen, setSelectedSpecimen] = useState('/samples/sample_cat_1.svg');
  const canvasRef = useRef(null);
  const [isProcessingCanvas, setIsProcessingCanvas] = useState(false);

  // Apply real 3x3 convolution kernel onto canvas
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
    <section id="how-it-sees" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            EDUCATIONAL FOUNDATION
          </div>
          <h2 className="section-title">
            HOW THE CNN SEES
          </h2>
          <p className="section-subtitle">
            How a convolutional neural network breaks down photographs into numerical representations to distinguish dogs from cats.
          </p>
        </div>

        {/* 4 Architectural Stages Cards */}
        <div className="grid-4" style={{ marginBottom: '48px' }}>
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div 
                key={s.step} 
                className="tech-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  background: 'var(--bg-elevated)',
                  borderTop: `2px solid ${s.color}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: s.color, fontWeight: 700 }}>
                    STAGE {s.step}
                  </span>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                    <Icon size={15} />
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {s.title}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: s.color, fontWeight: 500, marginBottom: '8px' }}>
                    {s.short}
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {s.detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* Interactive Kernel Convolution Playground */}
        <div className="tech-card" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-medium)', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                  Interactive 3×3 Convolution Kernel Simulator
                </h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                Live in-browser mathematical convolution showing how spatial filters transform pixel matrices into feature maps.
              </p>
            </div>

            {/* Specimen Picker */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Target:</span>
              <button
                type="button"
                className={`btn btn-sm ${selectedSpecimen === '/samples/sample_cat_1.svg' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedSpecimen('/samples/sample_cat_1.svg')}
                style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              >
                Cat (Whiskers)
              </button>
              <button
                type="button"
                className={`btn btn-sm ${selectedSpecimen === '/samples/sample_dog_1.svg' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedSpecimen('/samples/sample_dog_1.svg')}
                style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              >
                Dog (Muzzle)
              </button>
            </div>
          </div>

          <div className="grid-2" style={{ alignItems: 'center' }}>
            {/* Filter Buttons & Kernel Matrix */}
            <div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
                Select Convolution Filter:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '20px' }}>
                {CONVOLUTION_FILTERS.map((f) => {
                  const isSelected = selectedFilter.id === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFilter(f)}
                      style={{
                        padding: '10px 12px',
                        background: isSelected ? 'rgba(77, 163, 255, 0.15)' : 'var(--bg-surface)',
                        border: isSelected ? '1px solid var(--accent-blue)' : '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-xs)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                        {f.name}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {f.category}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* 3x3 Kernel Matrix Display */}
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                    Active 3 × 3 Kernel Weights (W)
                  </span>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    Divisor: {selectedFilter.divisor || 1} • Offset: {selectedFilter.offset || 0}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', maxWidth: '240px', margin: '0 auto 12px auto' }}>
                  {selectedFilter.kernel.flatMap((row, rIdx) =>
                    row.map((val, cIdx) => (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        style={{
                          background: val !== 0 ? 'rgba(77, 163, 255, 0.12)' : 'var(--bg-surface)',
                          border: val !== 0 ? '1px solid rgba(77, 163, 255, 0.3)' : '1px solid var(--border-subtle)',
                          borderRadius: '4px',
                          padding: '8px 0',
                          textAlign: 'center',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: val > 0 ? 'var(--accent-cyan)' : val < 0 ? '#FF7A7A' : 'var(--text-muted)'
                        }}
                      >
                        {val > 0 ? `+${val}` : val}
                      </div>
                    ))
                  )}
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, textAlign: 'center' }}>
                  {selectedFilter.description}
                </p>
              </div>
            </div>

            {/* Visual Canvas Result */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div 
                style={{
                  width: '224px',
                  height: '224px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  background: '#030407',
                  border: '2px solid var(--border-strong)',
                  boxShadow: '0 0 24px rgba(0, 0, 0, 0.7)'
                }}
              >
                <canvas 
                  ref={canvasRef} 
                  style={{ width: '100%', height: '100%', display: 'block' }} 
                />
              </div>

              <div style={{ textAlign: 'center' }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                  CONVOLUTION ACTIVATION MAP
                </span>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '4px' }}>
                  224 × 224 Matrix • {selectedFilter.category}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
