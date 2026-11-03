import React, { useState } from 'react';
import { ArrowRight, Check, Copy, ShieldCheck, Cpu, Database, Award, Info, Heart, Sparkles } from 'lucide-react';
import { SAMPLE_IMAGES } from '../services/sampleData';

export default function HomeTab({ onNavigate, onSelectSpecimen }) {
  const [activeHeroSpecimen, setActiveHeroSpecimen] = useState('cat');
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [petsGiven, setPetsGiven] = useState(18);
  const [floatingPaws, setFloatingPaws] = useState([]);

  const handleSelectSample = (sample) => {
    if (onSelectSpecimen) {
      onSelectSpecimen(sample);
    }
    onNavigate('classifier');
  };

  const sampleCat = SAMPLE_IMAGES.find((s) => s.id === 'cat-01') || SAMPLE_IMAGES[2];
  const sampleDog = SAMPLE_IMAGES.find((s) => s.id === 'dog-02') || SAMPLE_IMAGES[1];
  const currentHeroSpecimen = activeHeroSpecimen === 'cat' ? sampleCat : sampleDog;

  const handleGivePet = (e) => {
    e.stopPropagation();
    setPetsGiven((p) => p + 1);
    const newPaw = {
      id: Date.now() + Math.random(),
      x: 50 + (Math.random() * 26 - 13),
      y: 40 + (Math.random() * 16 - 8),
      emoji: activeHeroSpecimen === 'cat' 
        ? (Math.random() > 0.4 ? '🐾' : '🐱') 
        : (Math.random() > 0.4 ? '🐾' : '🐶')
    };
    setFloatingPaws((prev) => [...prev.slice(-6), newPaw]);
    setTimeout(() => {
      setFloatingPaws((prev) => prev.filter((p) => p.id !== newPaw.id));
    }, 1000);
  };

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
    <div className="tab-pane-container" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Playful Floating Background Paws */}
      <div className="floating-paw-bg animate-float-slow" style={{ top: '24px', right: '3%', transform: 'rotate(16deg)' }}>
        🐾
      </div>
      <div className="floating-paw-bg animate-float-opposite" style={{ top: '380px', left: '1.5%', fontSize: '1.9rem', opacity: 0.09, transform: 'rotate(-20deg)' }}>
        🐾
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Balanced Two-Column Hero Showcase */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 0.95fr)',
            gap: '32px',
            alignItems: 'center',
            marginBottom: '32px',
            paddingTop: '8px'
          }}
          className="hero-grid"
        >
          {/* Left Column: Problem Statement & Actions */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span className="section-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <span className="animate-wiggle" style={{ display: 'inline-block' }}>🐾</span>
                <span>PawVision AI Lab</span>
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Kaggle Dogs vs Cats Benchmark
              </span>
            </div>

            <h1 
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 2.9rem)',
                fontWeight: 700,
                lineHeight: 1.18,
                letterSpacing: '-0.025em',
                color: 'var(--text-primary)',
                marginBottom: '16px'
              }}
            >
              Distinguishing canine and feline morphology with convolutional neural networks.
            </h1>

            <p 
              style={{
                fontSize: '0.98rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '22px'
              }}
            >
              PawVision AI is an applied computer vision research laboratory evaluating binary image classification across 20,000 photographic samples. Utilizing a fine-tuned MobileNetV2 architecture with depthwise separable convolutions to isolate discriminative biological features like ear curvature, muzzle geometry, and facial texture.
            </p>

            {/* Primary Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '22px' }}>
              <button 
                type="button" 
                className="btn btn-primary btn-lg"
                onClick={() => onNavigate('classifier')}
              >
                <span>Launch Classifier</span>
                <ArrowRight size={16} />
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-lg"
                onClick={() => onNavigate('dataset')}
              >
                <span>View Kaggle Dataset</span>
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
                  padding: '4px 9px', 
                  borderRadius: 'var(--radius-xs)', 
                  color: 'var(--text-secondary)',
                  transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                className="hover-spring"
              >
                <Database size={12} color="var(--accent-green)" />
                <span>20,000 Kaggle Images</span>
              </span>

              <span 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  fontSize: '0.74rem', 
                  fontFamily: 'var(--font-mono)', 
                  background: 'var(--accent-sage)', 
                  border: '1px solid rgba(85, 116, 92, 0.3)', 
                  padding: '4px 9px', 
                  borderRadius: 'var(--radius-xs)', 
                  color: '#314E38',
                  fontWeight: 600,
                  transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                className="hover-spring"
              >
                <Award size={12} color="var(--accent-green)" />
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
                  padding: '4px 9px', 
                  borderRadius: 'var(--radius-xs)', 
                  color: 'var(--text-secondary)',
                  transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                className="hover-spring"
              >
                <Cpu size={12} color="var(--accent-green)" />
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
                  padding: '4px 9px', 
                  borderRadius: 'var(--radius-xs)', 
                  color: 'var(--text-secondary)',
                  transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                className="hover-spring"
              >
                <ShieldCheck size={12} color="var(--accent-green)" />
                <span>ImageNet OOD Screening</span>
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Cute Specimen Inspector */}
          <div 
            className="tech-card" 
            style={{ 
              padding: '18px', 
              background: 'var(--bg-card)', 
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-medium)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="hover-wiggle">🐾</span>
                <span>Morphological Specimen Focus</span>
              </div>
              
              {/* Cute Cat vs Dog Animated Toggle Pill */}
              <div style={{ display: 'flex', background: 'var(--bg-surface)', padding: '3px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => setActiveHeroSpecimen('cat')}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    borderRadius: 'var(--radius-pill)',
                    border: 'none',
                    background: activeHeroSpecimen === 'cat' ? 'var(--bg-card)' : 'transparent',
                    color: activeHeroSpecimen === 'cat' ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: activeHeroSpecimen === 'cat' ? 700 : 500,
                    cursor: 'pointer',
                    boxShadow: activeHeroSpecimen === 'cat' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  <span className={activeHeroSpecimen === 'cat' ? 'animate-bounce-cute' : ''}>🐱</span>
                  <span>Feline</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveHeroSpecimen('dog')}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    borderRadius: 'var(--radius-pill)',
                    border: 'none',
                    background: activeHeroSpecimen === 'dog' ? 'var(--bg-card)' : 'transparent',
                    color: activeHeroSpecimen === 'dog' ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: activeHeroSpecimen === 'dog' ? 700 : 500,
                    cursor: 'pointer',
                    boxShadow: activeHeroSpecimen === 'dog' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  <span className={activeHeroSpecimen === 'dog' ? 'animate-tail-wag' : ''}>🐶</span>
                  <span>Canine</span>
                </button>
              </div>
            </div>

            {/* Specimen Photo with Morphological Overlay & Floating Pets */}
            <div 
              style={{ 
                position: 'relative', 
                height: '210px', 
                borderRadius: 'var(--radius-xs)', 
                overflow: 'hidden', 
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                marginBottom: '12px',
                cursor: 'pointer'
              }}
              onClick={handleGivePet}
              title="Click photo to give a pet! 🐾"
            >
              <img 
                src={currentHeroSpecimen.url} 
                alt={currentHeroSpecimen.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              />

              {/* Floating Pet Hearts / Paws */}
              {floatingPaws.map((fp) => (
                <div
                  key={fp.id}
                  className="animate-float-up"
                  style={{
                    left: `${fp.x}%`,
                    top: `${fp.y}%`,
                    fontSize: '1.4rem',
                    zIndex: 20
                  }}
                >
                  {fp.emoji}
                </div>
              ))}

              {/* Animated Landmark Pins with Ear Twitching */}
              {currentHeroSpecimen.saliencyRegions?.slice(0, 3).map((pin, i) => (
                <div
                  key={i}
                  className={`landmark-pin ${i === 0 ? 'animate-ear-twitch' : ''}`}
                  style={{
                    position: 'absolute',
                    left: `${pin.x}%`,
                    top: `${pin.y}%`,
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(37, 40, 33, 0.88)',
                    color: '#FFFFFF',
                    fontSize: '0.64rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}
                >
                  <span>
                    {activeHeroSpecimen === 'cat' 
                      ? (i === 0 ? '🐱 ' : i === 1 ? '👁️ ' : '🐾 ') 
                      : (i === 0 ? '🐶 ' : i === 1 ? '👃 ' : '🦴 ')}
                    {pin.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Specimen Spec Sheet & Cute Pet Me Button */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {currentHeroSpecimen.name}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Interactive Cute Pet Button */}
                  <button
                    type="button"
                    className="btn-pet"
                    onClick={handleGivePet}
                    title="Pet this cute specimen!"
                  >
                    <Heart size={12} className="animate-heartbeat" fill="#8C5212" />
                    <span>Pet Me! ({petsGiven})</span>
                  </button>

                  <span className="badge badge-green" style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                    {activeHeroSpecimen === 'cat' ? 'P(Feline) = 99.7%' : 'P(Canine) = 99.4%'}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                {currentHeroSpecimen.description}
              </p>
            </div>

            {/* Quick Action Button */}
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '9px', fontWeight: 600 }}
              onClick={() => handleSelectSample(currentHeroSpecimen)}
            >
              <span>Test {currentHeroSpecimen.name} in Classifier</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Interactive Benchmark Gallery with Cute Animal Badges */}
        <div 
          className="tech-card" 
          style={{ 
            padding: '22px', 
            marginBottom: '28px',
            background: 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="hover-wiggle">🐾</span>
                <span>Interactive Benchmark Gallery</span>
              </div>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                Click any specimen below to immediately run real convolutional neural inference:
              </div>
            </div>
            <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={11} />
              <span>98.55% Validation Accuracy</span>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
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
                  cursor: 'pointer'
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
                        background: sample.category === 'unsupported' ? '#FBF5EE' : 'var(--bg-card)',
                        color: sample.category === 'unsupported' ? '#8C5212' : 'var(--accent-green)',
                        padding: '2px 7px',
                        borderRadius: 'var(--radius-pill)',
                        border: '1px solid var(--border-subtle)',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      {sample.category === 'cat' ? '🐱 Feline' : sample.category === 'dog' ? '🐶 Canine' : '🚫 OOD Test'}
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
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} color="var(--accent-green)" />
              <span>Out-of-Distribution rejection benchmark:</span>
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
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--bg-surface)',
                    border: '1px dashed rgba(178, 109, 30, 0.4)',
                    color: '#8C5212',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                  className="hover-spring"
                >
                  <span>{s.id === 'ood-01' ? '🚗' : s.id === 'ood-02' ? '🍕' : '🏙️'} Test {s.name}</span>
                  <ArrowRight size={11} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notes from the Research Lab */}
        <div 
          className="tech-card" 
          style={{ 
            padding: '20px 22px', 
            marginBottom: '28px',
            background: 'var(--bg-card)',
            borderLeft: '4px solid var(--accent-green)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span className="hover-wiggle">🐾</span>
              <span>Notes from the Lab · Architectural Rationale</span>
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Pranshu Shikhar (Project Lead) &amp; Team
            </span>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
            Why We Chose MobileNetV2 Over Heavier Architectures
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            In academic machine learning, bigger is not always better. While VGG16 requires 138 million parameters and ResNet-50 requires 25 million, MobileNetV2 achieves <strong>98.55% validation accuracy with only 2.26 million parameters</strong>. By utilizing depthwise separable convolutions, inference executes in under 30ms on standard CPUs without requiring expensive cloud GPUs. Furthermore, our independent ImageNet-1K screening gate solves the classic binary classification flaw by rejecting non-pet imagery (cars, portraits, food, architecture) before inference runs.
          </p>
        </div>

        {/* Key Model & Benchmark Metrics Row with Cute Badges */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            marginBottom: '32px'
          }}
        >
          <div className="tech-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Validation Accuracy
              </span>
              <span style={{ fontSize: '1.1rem' }}>🏆</span>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--accent-green)', lineHeight: 1.1 }}>
              98.55%
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              3,942 / 4,000 validation images
            </div>
          </div>

          <div className="tech-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Dataset Size
              </span>
              <span style={{ fontSize: '1.1rem' }} className="hover-wiggle">🐾</span>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              20,000
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Balanced 10,000 cats / 10,000 dogs
            </div>
          </div>

          <div className="tech-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Architecture
              </span>
              <span style={{ fontSize: '1.1rem' }}>⚡</span>
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              MobileNetV2
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Depthwise separable convolutions
            </div>
          </div>

          <div className="tech-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Validation Loss
              </span>
              <span style={{ fontSize: '1.1rem' }}>🎯</span>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              0.0409
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Binary cross-entropy loss
            </div>
          </div>
        </div>

        {/* Academic Project Presentation Citation Box */}
        <div 
          className="tech-card" 
          style={{ 
            padding: '20px', 
            marginBottom: '32px',
            background: 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={15} color="var(--accent-green)" />
              <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                Academic Project Reference (BibTeX)
              </span>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCopyCitation}
              style={{ fontSize: '0.72rem', padding: '3px 8px', height: '26px' }}
            >
              {copiedCitation ? (
                <>
                  <Check size={12} color="var(--accent-green)" />
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
              padding: '12px', 
              fontSize: '0.74rem', 
              fontFamily: 'var(--font-mono)', 
              color: 'var(--text-secondary)',
              margin: 0,
              overflowX: 'auto',
              lineHeight: 1.5
            }}
          >
            {bibtexText}
          </pre>
        </div>

        {/* Editorial Project Breakdown */}
        <div style={{ borderTop: '1px solid var(--border-medium)', paddingTop: '28px' }}>
          <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span className="hover-wiggle">🐾</span>
            <span>End-to-End Tensor Pipeline</span>
          </div>

          <div className="grid-3">
            <div>
              <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', fontWeight: 600, marginBottom: '6px' }}>
                01 · Photographic Ingestion
              </div>
              <h3 style={{ fontSize: '1.02rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Standardized RGB Arrays
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Input images are decoded into 3-channel RGB matrices, rescaled to 224 × 224 pixels, and normalized into standard floating-point tensors in range [-1, +1].
              </p>
            </div>

            <div>
              <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', fontWeight: 600, marginBottom: '6px' }}>
                02 · Feature Extraction
              </div>
              <h3 style={{ fontSize: '1.02rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Hierarchical Convolutions
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Inverted residual blocks extract low-level edges, intermediate fur textures, and high-level morphological landmarks across 1,280 pooled features.
              </p>
            </div>

            <div>
              <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', fontWeight: 600, marginBottom: '6px' }}>
                03 · Logistic Inference
              </div>
              <h3 style={{ fontSize: '1.02rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Calibrated Probability
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                A dense classification layer computes sigmoid activations, mapping pooled representations to class probabilities with an empirical 98.55% validation accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
