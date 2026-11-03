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

        {/* 1.5 Research & Engineering Team Credits */}
        <div style={{ marginTop: '40px' }}>
          <div className="tech-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Research &amp; Engineering Team
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Developed by Pranshu Shikhar &amp; Team
                </h3>
              </div>
              <span className="badge badge-green" style={{ fontSize: '0.74rem' }}>
                PAWVISION AI CORE TEAM
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Pranshu Shikhar
                </div>
                <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', fontWeight: 600, marginBottom: '6px' }}>
                  Project Lead &amp; ML Architecture
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                  Model design, MobileNetV2 fine-tuning, OOD screening architecture, and full-stack integration.
                </p>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Rishabh Vaish
                </div>
                <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', fontWeight: 600, marginBottom: '6px' }}>
                  Deep Learning Engineer
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                  Dataset curation, pipeline optimization, training script stabilization, and hyperparameter tuning.
                </p>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Ankit Raj
                </div>
                <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', fontWeight: 600, marginBottom: '6px' }}>
                  Backend &amp; API Engineer
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                  FastAPI service architecture, tensor preprocessing validation, latency optimization, and endpoints.
                </p>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Kanika Rani
                </div>
                <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', fontWeight: 600, marginBottom: '6px' }}>
                  QA &amp; Evaluation Specialist
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                  Model validation, confusion matrix analytics, classification threshold tests, and holdout verification.
                </p>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Ishita Goel
                </div>
                <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', fontWeight: 600, marginBottom: '6px' }}>
                  UI/UX &amp; Research Analyst
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                  Frontend visualization design, user experience flow, research documentation, and presentation materials.
                </p>
              </div>
            </div>
          </div>
        </div>

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
       ├─► Validation Gate 1: Format & corrupt file check (<10x10 px rejected)
       │
       ├─► Validation Gate 2: Independent OOD Screening (ImageNet MobileNetV2)
       │       ├─► 143 feline & canine classes (indices 151..293)
       │       ├─► 857 open-domain classes (vehicles, food, architecture, portraits, etc.)
       │       └─► Rejects unrelated images with "Unsupported Image" advisory
       │
       ▼ (Only verified feline/canine images proceed)
TensorFlow Engine (models/dog_cat_cnn.keras)
       │
       ├─► MobileNetV2 Feature Extractor (frozen weights, 2.26M parameters)
       ├─► GlobalAveragePooling2D (1,280 features)
       └─► Binary Classification: Dense perceptron + Sigmoid activation [0, 1]
       │
       ▼
Inference Response: { is_supported: true, prediction: "cat"|"dog", confidence, probabilities }`}
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
                  <span><strong>Independent OOD Screening:</strong> Non-cat/non-dog images (cars, portraits, food, architecture, landscapes) are screened by an independent ImageNet-1K validator and rejected rather than forced onto a binary decision.</span>
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#8C5212', fontWeight: 700 }}>•</span>
                  <span><strong>OOD Calibration Tradeoffs:</strong> The screening threshold is conservatively tuned to minimize false rejections of genuine pets. Edge cases like plush pet toys, cartoons, or ambiguous animal hybrids may challenge boundary discrimination.</span>
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#8C5212', fontWeight: 700 }}>•</span>
                  <span><strong>Occlusion & Lighting:</strong> Severe obstruction, extreme motion blur, or abstract artistic renderings may lower classification confidence.</span>
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#8C5212', fontWeight: 700 }}>•</span>
                  <span><strong>Raster Constraints:</strong> The neural tensor pipeline requires standard raster formats (JPEG, PNG, WebP) with minimum 10 × 10 pixel resolution.</span>
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
                  <span><strong>Zero Fabricated Metrics:</strong> All reported evaluation metrics (98.55% validation accuracy, 99.0% test-holdout accuracy, 97.50% precision, 99.65% recall) originate from empirical evaluation on real unseen test splits.</span>
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
