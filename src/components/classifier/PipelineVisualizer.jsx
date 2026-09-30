import React, { useState } from 'react';
import { Layers, Sliders, Scan, Cpu, CheckCircle2, ChevronRight, Activity, Grid } from 'lucide-react';

export const PIPELINE_STAGES = [
  {
    id: 'input',
    label: 'INPUT IMAGE',
    sub: 'Source RGB Buffer',
    icon: Grid,
    desc: 'Unstructured spatial matrix of pixel intensity values.',
    details: 'Raw raster array containing channels for Red, Green, and Blue intensity.'
  },
  {
    id: 'resize',
    label: 'RESIZE',
    sub: '224 × 224 × 3',
    icon: Scan,
    desc: 'Bilinear spatial interpolation to CNN receptive tensor dimensions.',
    details: 'Standardizes variable input aspect ratios to match convolutional input weight dimensions.'
  },
  {
    id: 'normalize',
    label: 'NORMALIZE',
    sub: '[0.0, 1.0] Range',
    icon: Sliders,
    desc: 'Divides pixel bytes by 255.0 to achieve zero-mean gradient stability.',
    details: 'Transforms [0, 255] uint8 pixels into float32 floating-point values for stable backpropagation.'
  },
  {
    id: 'convolution',
    label: 'CONVOLUTION',
    sub: 'Spatial Filters 3×3',
    icon: Layers,
    desc: 'Learned filter kernels slide over tensors to detect local visual primitives.',
    details: 'Discrete mathematical cross-correlation producing high-dimensional feature activation maps.'
  },
  {
    id: 'features',
    label: 'FEATURE EXTRACTION',
    sub: 'Hierarchical Maps',
    icon: Cpu,
    desc: 'Aggregates micro-edges into contours, ears, muzzles, whiskers, and textures.',
    details: 'Hierarchical composition: Layer 1 sees lines; Layer 2 sees curves; Layer 3 sees holistic anatomy.'
  },
  {
    id: 'classification',
    label: 'CLASSIFICATION',
    sub: 'Dense Softmax / Sigmoid',
    icon: Activity,
    desc: 'Vectorized dense layer computes final decision boundary.',
    details: 'Fully-connected perceptrons map the pooled feature representations into class probabilities.'
  },
  {
    id: 'output',
    label: 'DECISION',
    sub: 'DOG vs CAT',
    icon: CheckCircle2,
    desc: 'Argmax or thresholded sigmoid generates binary classification score.',
    details: 'High-confidence threshold applied: Dog if P(Dog) > threshold, else Cat.'
  }
];

export default function PipelineVisualizer({ currentStageIndex = -1, isProcessing = false, onStageSelect }) {
  const [activeInspectionStage, setActiveInspectionStage] = useState(0);

  const handleStageClick = (index) => {
    setActiveInspectionStage(index);
    if (onStageSelect) onStageSelect(PIPELINE_STAGES[index]);
  };

  const currentStage = PIPELINE_STAGES[activeInspectionStage];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Horizontal Pipeline Steps Ribbon */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${PIPELINE_STAGES.length}, 1fr)`,
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px'
        }}
      >
        {PIPELINE_STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isCurrentActive = isProcessing && currentStageIndex === idx;
          const isPassed = currentStageIndex > idx;
          const isInspected = activeInspectionStage === idx;

          return (
            <div
              key={stage.id}
              onClick={() => handleStageClick(idx)}
              style={{
                background: isCurrentActive
                  ? 'rgba(77, 163, 255, 0.15)'
                  : isInspected
                  ? 'var(--bg-surface-hover)'
                  : 'var(--bg-surface)',
                border: isCurrentActive
                  ? '1px solid var(--accent-blue)'
                  : isInspected
                  ? '1px solid rgba(255, 255, 255, 0.25)'
                  : '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                position: 'relative'
              }}
            >
              {/* Active Step Indicator Pill */}
              {isCurrentActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--accent-cyan)',
                    boxShadow: '0 0 10px var(--accent-cyan)'
                  }}
                />
              )}

              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: isCurrentActive
                    ? 'rgba(77, 163, 255, 0.25)'
                    : isPassed
                    ? 'rgba(85, 230, 208, 0.15)'
                    : 'var(--bg-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isCurrentActive
                    ? 'var(--accent-blue)'
                    : isPassed
                    ? 'var(--accent-cyan)'
                    : 'var(--text-muted)'
                }}
              >
                <Icon size={16} />
              </div>

              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: isCurrentActive ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                  {stage.label}
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  {stage.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stage Detail Inspector Card */}
      {currentStage && (
        <div 
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)', boxShadow: '0 0 8px var(--accent-blue)' }} />
            <div>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Stage {activeInspectionStage + 1} of {PIPELINE_STAGES.length}: {currentStage.label}
              </span>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                {currentStage.desc}
              </p>
            </div>
          </div>
          <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
            {currentStage.details}
          </div>
        </div>
      )}
    </div>
  );
}
