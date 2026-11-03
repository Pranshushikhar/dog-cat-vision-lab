import React, { useState } from 'react';
import { ArrowRight, Check, Copy, ShieldCheck, Cpu, Database, Award, Info, Sparkles, Layers } from 'lucide-react';
import { SAMPLE_IMAGES } from '../services/sampleData';

export default function HomeTab({ onNavigate, onSelectSpecimen }) {
  const [activeHeroSpecimen, setActiveHeroSpecimen] = useState('cat');
  const [copiedCitation, setCopiedCitation] = useState(false);

  const handleSelectSample = (sample) => {
    if (onSelectSpecimen) {
      onSelectSpecimen(sample);
    }
    onNavigate('classifier');
  };

  const sampleCat = SAMPLE_IMAGES.find((s) => s.id === 'cat-01') || SAMPLE_IMAGES[2];
  const sampleDog = SAMPLE_IMAGES.find((s) => s.id === 'dog-02') || SAMPLE_IMAGES[1];
  const currentHeroSpecimen = activeHeroSpecimen === 'cat' ? sampleCat : sampleDog;

  const bibtexText = `@article{shikhar2024pawvision,
  title={PawVision AI: Canine and Feline Morphological Feature Discrimination Using Inverted Residual Convolutions},
  author={Shikhar, Pranshu and Vaish, Rishabh and Raj, Ankit and Rani, Kanika and Goel, Ishita},
  journal={Computer Vision Project Repository},
  year={2024},
  note={MobileNetV2 Architecture, 98.55% Validation Accuracy on Kaggle Benchmark}
}`;

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(bibtexText);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2200);
  };

  return (
    <div className="tab-pane-container">
      <div className="container">
        {/* Professional Startup Hero Showcase */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 0.95fr)',
            gap: '36px',
            alignItems: 'center',
            marginBottom: '36px',
            paddingTop: '12px'
          }}
          className="hero-grid"
        >
          {/* Left Column: Problem Statement & Actions */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulse-dot success" />
                <span>PAWVISION AI v2.0</span>
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                See the Difference. Let AI Decide.
              </span>
            </div>

            <h1 
              style={{
                fontSize: 'clamp(2.2rem, 4.2vw, 3.2rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                marginBottom: '18px'
              }}
            >
              AI That Knows Who&apos;s Who.
            </h1>

            <p 
              style={{
                fontSize: '1.05rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                marginBottom: '26px',
                maxWidth: '560px'
              }}
            >
              Upload a photograph and let PawVision AI identify whether your furry friend is a cat or a dog using deep learning and computer vision. Powered by a fine-tuned MobileNetV2 architecture with independent Out-of-Distribution validation.
            </p>

            {/* Primary Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '26px' }}>
              <button 
                type="button" 
                className="btn btn-primary btn-lg"
                onClick={() => onNavigate('classifier')}
              >
                <span>Start Classifying</span>
                <ArrowRight size={16} />
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-lg"
                onClick={() => onNavigate('how-it-works')}
              >
                <span>Explore How It Works</span>
              </button>
            </div>

            {/* Verified Academic Credentials Pill Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  fontSize: '0.74rem', 
                  fontFamily: 'var(--font-mono)', 
                  background: 'var(--bg-surface)', 
                  border: '1px solid var(--border-medium)', 
                  padding: '5px 10px', 
                  borderRadius: 'var(--radius-xs)', 
                  color: 'var(--text-secondary)'
                }}
              >
                <Database size={12} color="var(--accent-teal)" />
                <span>20,000 Kaggle Images</span>
              </span>

              <span 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  fontSize: '0.74rem', 
                  fontFamily: 'var(--font-mono)', 
                  background: 'var(--accent-teal-subtle)', 
                  border: '1px solid rgba(15, 118, 110, 0.25)', 
                  padding: '5px 10px', 
                  borderRadius: 'var(--radius-xs)', 
                  color: 'var(--accent-teal)',
                  fontWeight: 600
                }}
              >
                <Award size={12} color="var(--accent-teal)" />
                <span>98.55% Validation Accuracy</span>
              </span>

              <span 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  fontSize: '0.74rem', 
                  fontFamily: 'var(--font-mono)', 
                  background: 'var(--bg-surface)', 
                  border: '1px solid var(--border-medium)', 
                  padding: '5px 10px', 
                  borderRadius: 'var(--radius-xs)', 
                  color: 'var(--text-secondary)'
                }}
              >
                <Cpu size={12} color="var(--accent-teal)" />
                <span>MobileNetV2 (2.26M Params)</span>
              </span>

              <span 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  fontSize: '0.74rem', 
                  fontFamily: 'var(--font-mono)', 
                  background: 'var(--bg-surface)', 
                  border: '1px solid var(--border-medium)', 
                  padding: '5px 10px', 
                  borderRadius: 'var(--radius-xs)', 
                  color: 'var(--text-secondary)'
                }}
              >
                <ShieldCheck size={12} color="var(--accent-teal)" />
                <span>Dual OOD Screening</span>
              </span>
            </div>
          </div>

          {/* Right Column: Specimen Preview Card */}
          <div 
            className="tech-card" 
            style={{ 
              padding: '20px', 
              background: 'var(--bg-card)', 
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={13} />
                <span>Morphological Specimen Focus</span>
              </div>
              
              {/* Cat vs Dog Toggle Pill */}
              <div style={{ display: 'flex', background: 'var(--bg-surface)', padding: '3px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => setActiveHeroSpecimen('cat')}
                  style={{
                    padding: '4px 12px',
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    borderRadius: 'var(--radius-pill)',
                    border: 'none',
                    background: activeHeroSpecimen === 'cat' ? 'var(--bg-card)' : 'transparent',
                    color: activeHeroSpecimen === 'cat' ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: activeHeroSpecimen === 'cat' ? 700 : 500,
                    cursor: 'pointer',
                    boxShadow: activeHeroSpecimen === 'cat' ? 'var(--shadow-xs)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Feline (Cat)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveHeroSpecimen('dog')}
                  style={{
                    padding: '4px 12px',
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    borderRadius: 'var(--radius-pill)',
                    border: 'none',
                    background: activeHeroSpecimen === 'dog' ? 'var(--bg-card)' : 'transparent',
                    color: activeHeroSpecimen === 'dog' ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: activeHeroSpecimen === 'dog' ? 700 : 500,
                    cursor: 'pointer',
                    boxShadow: activeHeroSpecimen === 'dog' ? 'var(--shadow-xs)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Canine (Dog)
                </button>
              </div>
            </div>

            {/* Specimen Photo with Feature Pins */}
            <div 
              style={{ 
                position: 'relative', 
                height: '230px', 
                borderRadius: 'var(--radius-sm)', 
                overflow: 'hidden', 
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                marginBottom: '14px'
              }}
            >
              <img 
                src={currentHeroSpecimen.url} 
                alt={currentHeroSpecimen.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />

              {/* Landmark Pins */}
              {currentHeroSpecimen.saliencyRegions?.slice(0, 3).map((pin, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${pin.x}%`,
                    top: `${pin.y}%`,
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(15, 23, 42, 0.88)',
                    color: '#FFFFFF',
                    fontSize: '0.66rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}
                >
                  {pin.label}
                </div>
              ))}
            </div>

            {/* Specimen Spec Sheet */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {currentHeroSpecimen.name}
                </span>

                <span className="badge badge-green" style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                  {activeHeroSpecimen === 'cat' ? 'P(Cat) = 99.7%' : 'P(Dog) = 99.4%'}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                {currentHeroSpecimen.description}
              </p>
            </div>

            {/* Quick Action Button */}
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem', padding: '10px', fontWeight: 600 }}
              onClick={() => handleSelectSample(currentHeroSpecimen)}
            >
              <span>Test {currentHeroSpecimen.name} in Classifier</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Interactive Benchmark Gallery */}
        <div 
          className="tech-card" 
          style={{ 
            padding: '24px', 
            marginBottom: '32px',
            background: 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span>Benchmark Specimen Gallery</span>
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Select any sample below to run instant inference in the classifier workspace:
              </div>
            </div>
            <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={11} />
              <span>98.55% Validation Accuracy</span>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
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
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
                }}
                className="specimen-card"
              >
                <div style={{ height: '150px', overflow: 'hidden', background: 'var(--bg-surface)' }}>
                  <img 
                    src={sample.url} 
                    alt={sample.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {sample.name}
                    </div>
                    <span 
                      style={{ 
                        fontSize: '0.68rem', 
                        fontFamily: 'var(--font-mono)', 
                        background: sample.category === 'unsupported' ? '#FEF3C7' : 'var(--bg-card)',
                        color: sample.category === 'unsupported' ? '#92400E' : 'var(--accent-teal)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
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
          <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="var(--accent-teal)" />
              <span>Out-of-Distribution rejection benchmark (rejection guarantee):</span>
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {SAMPLE_IMAGES.filter(s => s.category === 'unsupported').map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectSample(s)}
                  style={{
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--bg-surface)',
                    border: '1px dashed var(--border-strong)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Test {s.name}</span>
                  <ArrowRight size={11} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Model & Benchmark Metrics Row */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}
        >
          <div className="tech-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Validation Accuracy
              </span>
              <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>EVAL</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-teal)', lineHeight: 1.1 }}>
              98.55%
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              3,942 / 4,000 validation split
            </div>
          </div>

          <div className="tech-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Test Holdout Accuracy
              </span>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>HOLDOUT</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              99.00%
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Independent 1,000 test images
            </div>
          </div>

          <div className="tech-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Validation Loss
              </span>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>BCE</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              0.0409
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Binary cross-entropy loss
            </div>
          </div>

          <div className="tech-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Architecture
              </span>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>CNN</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              MobileNetV2
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              2.26M parameters · ~30ms CPU
            </div>
          </div>
        </div>

        {/* Academic Project Presentation Citation Box */}
        <div 
          className="tech-card" 
          style={{ 
            padding: '22px', 
            marginBottom: '36px',
            background: 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={16} color="var(--accent-teal)" />
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Academic Project Reference (BibTeX)
              </span>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCopyCitation}
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              {copiedCitation ? (
                <>
                  <Check size={12} color="var(--accent-teal)" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy BibTeX</span>
                </>
              )}
            </button>
          </div>
          <pre 
            style={{ 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--border-medium)', 
              borderRadius: 'var(--radius-xs)', 
              padding: '14px', 
              fontSize: '0.76rem', 
              fontFamily: 'var(--font-mono)', 
              color: 'var(--text-secondary)',
              margin: 0,
              overflowX: 'auto',
              lineHeight: 1.55
            }}
          >
            {bibtexText}
          </pre>
        </div>

        {/* End-to-End Pipeline Summary */}
        <div style={{ borderTop: '1px solid var(--border-medium)', paddingTop: '32px' }}>
          <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
            End-to-End Processing Pipeline
          </div>

          <div className="grid-3">
            <div>
              <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', fontWeight: 600, marginBottom: '6px' }}>
                01 · Input Validation &amp; OOD
              </div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Photographic Screening
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Images are inspected for valid dimensions and filtered through ImageNet-1K screening to reject cars, portraits, food, and landscapes before classification.
              </p>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', fontWeight: 600, marginBottom: '6px' }}>
                02 · Feature Extraction
              </div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Hierarchical Convolutions
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Pretrained inverted residual blocks extract 1,280 pooled features capturing subtle differences in ear shape, muzzle contour, and ocular spacing.
              </p>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', fontWeight: 600, marginBottom: '6px' }}>
                03 · Calibrated Inference
              </div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Probability &amp; Latency
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                A dense layer with sigmoid activation yields calibrated probabilities (Cat vs Dog) alongside sub-50ms inference latency reporting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
