import React from 'react';
import TechStackSection from '../sections/TechStackSection';
import StorySection from '../sections/StorySection';
import { AlertTriangle, Check } from 'lucide-react';

export default function AboutTab({ onOpenConfigModal }) {
  return (
    <div className="tab-pane-container">
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* 1. Project Background and Research Narrative */}
        <StorySection />

        {/* 2. Full Technology Stack */}
        <div style={{ marginTop: '40px' }}>
          <TechStackSection />
        </div>

        {/* 3. System Architecture & Data Flow */}
        <div style={{ marginTop: '40px' }}>
          <div className="tech-card" style={{ padding: '28px' }}>
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Engineering Architecture
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                System Architecture & Data Flow
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '6px 0 0 0' }}>
                Decoupled client-server architecture designed for reliability, sub-50ms inference, and zero synthetic data fabrication:
              </p>
            </div>

            <div 
              style={{ 
                background: 'var(--bg-surface)', 
                border: '1px solid var(--border-medium)', 
                borderRadius: 'var(--radius-sm)', 
                padding: '20px', 
                overflowX: 'auto',
                marginBottom: '16px' 
              }}
            >
              <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
{`Client Browser (PawVision AI SPA)
       │
       │  POST /api/predict (multipart/form-data: image file + threshold)
       ▼
Python Backend (FastAPI on Port 8000)
       │
       ├─► Validation Gate: PIL decode check (rejects non-images, corrupt files, <10x10 px)
       ├─► Preprocessing: Bilinear resize to 224×224 RGB, float32 normalization
       │
       ▼
TensorFlow Engine (models/dog_cat_cnn.keras)
       │
       ├─► MobileNetV2 Feature Extractor (frozen weights, 2.26M parameters)
       ├─► GlobalAveragePooling2D (1,280 features)
       └─► Binary Classification: Dense perceptron + Sigmoid activation [0, 1]
       │
       ▼
Inference Response: { prediction: "cat"|"dog", confidence: 0.9985, probabilities: { cat, dog } }`}
              </pre>
            </div>
          </div>
        </div>

        {/* 4. Model Limitations & Responsible AI Integrity */}
        <div style={{ marginTop: '40px' }}>
          <div className="grid-2" style={{ gap: '20px' }}>
            {/* Limitations Card */}
            <div className="tech-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <AlertTriangle size={18} color="#8C5212" />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Domain Scope & Limitations
                </h4>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: 1.5 }}>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#8C5212', fontWeight: 700 }}>•</span>
                  <span><strong>Closed-World Assumption:</strong> The classifier is trained specifically on domestic cats and dogs. Uploading unrelated objects (e.g. cars, fruit, humans) will force a binary projection onto feline/canine coordinates.</span>
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#8C5212', fontWeight: 700 }}>•</span>
                  <span><strong>Occlusion & Lighting:</strong> Heavy obstruction, motion blur, or abstract artistic renderings may diminish classification confidence.</span>
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#8C5212', fontWeight: 700 }}>•</span>
                  <span><strong>Raster Constraints:</strong> The neural tensor pipeline requires raster images (JPEG, PNG, WebP) with minimum 10 × 10 pixel resolution.</span>
                </li>
              </ul>
            </div>

            {/* Responsible AI Card */}
            <div className="tech-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Check size={18} color="var(--accent-green)" />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Scientific & Responsible AI Integrity
                </h4>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: 1.5 }}>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>•</span>
                  <span><strong>Zero Fabricated Metrics:</strong> All reported evaluation metrics (98.55% accuracy, 97.50% precision, 99.65% recall) originate from empirical evaluation on 4,000 real unseen test images.</span>
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>•</span>
                  <span><strong>Transparent Offline States:</strong> If the model server is offline, the interface signals an offline state. Client-side simulation is only enabled with explicit user action and prominent labelling.</span>
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>•</span>
                  <span><strong>Reproducible Artifacts:</strong> Training scripts, confusion matrix heatmaps, and test suite definitions are versioned alongside the model weights.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
