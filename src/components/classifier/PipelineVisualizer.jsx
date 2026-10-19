import React, { useState } from 'react';
import { Layers, Sliders, Scan, Cpu, CheckCircle2, Activity, Grid } from 'lucide-react';

export const PIPELINE_STAGES = [
  {
    id: 'input',
    num: '01',
    label: 'Input Image',
    sub: 'Source RGB Buffer',
    icon: Grid,
    desc: 'Unstructured spatial matrix of pixel intensity values.',
    details: 'Raw raster array containing channels for Red, Green, and Blue light intensities.'
  },
  {
    id: 'resize',
    num: '02',
    label: 'Resize & Decouple',
    sub: '224 × 224 × 3',
    icon: Scan,
    desc: 'Bilinear spatial interpolation to CNN receptive tensor dimensions.',
    details: 'Standardizes variable aspect ratios to match convolutional input weight dimensions.'
  },
  {
    id: 'normalize',
    num: '03',
    label: 'Normalize',
    sub: '[-1.0, +1.0] Range',
    icon: Sliders,
    desc: 'Rescaling pixel values: (x / 127.5) - 1.0 for numerical gradient stability.',
    details: 'Transforms [0, 255] uint8 pixels into float32 floating-point tensors.'
  },
  {
    id: 'features',
    num: '04',
    label: 'Feature Extraction',
    sub: 'MobileNetV2 Backbone',
    icon: Cpu,
    desc: 'Aggregates micro-edges into textures, contours, ears, muzzles, and whiskers.',
    details: 'Hierarchical inverted bottleneck convolutions extracting 1,280 pooled features.'
  },
  {
    id: 'classification',
    num: '05',
    label: 'Classification',
    sub: 'Dense Sigmoid',
    icon: Activity,
    desc: 'Fully-connected perceptron maps feature representations to log-odds.',
    details: 'Dense layer calculates decision scalar z followed by sigmoid activation.'
  },
  {
    id: 'output',
    num: '06',
    label: 'Decision',
    sub: 'Cat vs Dog',
    icon: CheckCircle2,
    desc: 'Thresholded decision outputs the binary classification result.',
    details: 'Dog if P(Dog) ≥ threshold, otherwise classified as Cat.'
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Horizontal Pipeline Steps Ribbon */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${PIPELINE_STAGES.length}, 1fr)`,
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}
      >
        {PIPELINE_STAGES.map((stage, idx) => {
          const isCurrentActive = isProcessing && currentStageIndex === idx;
          const isInspected = activeInspectionStage === idx;

          return (
            <div
              key={stage.id}
              onClick={() => handleStageClick(idx)}
              style={{
                background: isCurrentActive
                  ? 'var(--accent-sage)'
                  : isInspected
                  ? '#FFFFFF'
                  : 'var(--bg-surface)',
                border: isCurrentActive
                  ? '1px solid var(--accent-green)'
                  : isInspected
                  ? '1px solid var(--accent-green)'
                  : '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                userSelect: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: isCurrentActive || isInspected ? 'var(--accent-green)' : 'var(--text-muted)', fontWeight: 600 }}>
                  {stage.num}
                </span>
                {isCurrentActive && <span className="pulse-dot success" />}
              </div>

              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {stage.label}
              </div>

              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {stage.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Step Detail Box */}
      <div 
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', fontWeight: 600, textTransform: 'uppercase', marginRight: '8px' }}>
            {currentStage.num} · {currentStage.label}
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            {currentStage.desc}
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {currentStage.details}
        </div>
      </div>
    </div>
  );
}
