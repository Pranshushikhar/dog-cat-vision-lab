import React from 'react';
import { HelpCircle, Database, Cpu, Activity, Award, Rocket } from 'lucide-react';

const TIMELINE_STEPS = [
  {
    num: '01',
    phase: 'PROBLEM',
    title: 'Distinguishing Visual Classes',
    desc: 'How can a machine distinguish two visually diverse biological classes across arbitrary lighting, postures, and backgrounds without manual feature engineering?',
    icon: HelpCircle,
    color: '#4DA3FF'
  },
  {
    num: '02',
    phase: 'DATA',
    title: 'Kaggle Dogs vs Cats Corpus',
    desc: 'Acquiring and preparing thousands of labeled canine and feline photographs. Standardizing resolutions to 224 × 224 RGB tensors with data augmentation.',
    icon: Database,
    color: '#55E6D0'
  },
  {
    num: '03',
    phase: 'MODEL',
    title: 'Convolutional Architecture',
    desc: 'Constructing multi-layer convolutional blocks with ReLU non-linearities and max-pooling reductions to automatically extract hierarchical spatial patterns.',
    icon: Cpu,
    color: '#6C63FF'
  },
  {
    num: '04',
    phase: 'TRAIN',
    title: 'Pattern Representation Learning',
    desc: 'Iterative backpropagation with Adam optimization and binary cross-entropy loss, tuning convolutional kernel weights to detect diagnostic anatomical cues.',
    icon: Activity,
    color: '#9B94FF'
  },
  {
    num: '05',
    phase: 'EVALUATE',
    title: 'Accuracy & Metric Verification',
    desc: 'Rigorous quantitative testing against withheld test samples, measuring accuracy, precision, recall, and false-positive rates to ensure generalization.',
    icon: Award,
    color: '#FFA24C'
  },
  {
    num: '06',
    phase: 'DEPLOY',
    title: 'Interactive Web Laboratory',
    desc: 'Exposing the trained CNN pipeline through an accessible web interface with real-time inference, pipeline visualization, and Cloudflare Pages hosting.',
    icon: Rocket,
    color: '#55E6D0'
  }
];

export default function StorySection() {
  return (
    <section id="story" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            PROJECT LIFECYCLE
          </div>
          <h2 className="section-title">
            PROJECT STORY
          </h2>
          <p className="section-subtitle">
            The end-to-end progression from foundational computer-vision research question to an interactive deployment.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid-3" style={{ gap: '20px' }}>
          {TIMELINE_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.num}
                className="tech-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  background: 'var(--bg-elevated)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span 
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      color: step.color,
                      lineHeight: 1
                    }}
                  >
                    {step.num}
                  </span>
                  <div 
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: step.color
                    }}
                  >
                    <Icon size={16} />
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: step.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                    PHASE // {step.phase}
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {step.title}
                  </h4>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
