import React, { useState, useEffect } from 'react';
import { Database, Binary, AlertCircle, ExternalLink, Image as ImageIcon, CheckCircle, RefreshCw } from 'lucide-react';
import { classifierService } from '../services/classifierService';

export default function DatasetSection() {
  const [stats, setStats] = useState({
    connected: false,
    status: 'DATA_NOT_CONNECTED',
    total_images: null,
    dog_images: null,
    cat_images: null,
    corrupted_images: 0,
    train_count: null,
    validation_count: null,
    dimensions_summary: null
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    const data = await classifierService.fetchDatasetStats();
    if (data && data.connected) {
      setStats(data);
    } else {
      setStats({
        connected: false,
        status: data?.status || 'DATA_NOT_CONNECTED',
        message: data?.message || 'Dataset statistics will appear when the training metadata is connected.',
        total_images: null,
        dog_images: null,
        cat_images: null,
        corrupted_images: 0,
        train_count: null,
        validation_count: null,
        dimensions_summary: null
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
    const unsub = classifierService.subscribe(loadStats);
    return () => unsub();
  }, []);

  return (
    <section id="dataset" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div className="section-eyebrow">
              BENCHMARK CORPUS
            </div>
            {stats.connected ? (
              <span className="badge badge-cyan">
                <span className="pulse-dot success" />
                REAL DATASET INGESTED
              </span>
            ) : (
              <span className="badge badge-neutral">
                DATA NOT CONNECTED
              </span>
            )}
          </div>
          <h2 className="section-title">
            THE DATA
          </h2>
          <p className="section-subtitle">
            Kaggle — Dogs vs Cats benchmark dataset for computer vision and binary representation learning.
          </p>
        </div>

        {/* Dataset Core Cards */}
        <div className="grid-2" style={{ marginBottom: '32px' }}>
          {/* Left: Class Distribution & Definition */}
          <div className="tech-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Binary size={16} color="var(--accent-blue)" />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>
                Classification Problem Formulation
              </span>
            </div>

            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '10px' }}>
              Binary Image Classification
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              The Dogs vs Cats benchmark presents a foundational challenge: given a photo containing variable illumination, orientation, breed variations, and occlusion, accurately map the pixel grid to one of two mutually exclusive labels.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {/* Dog Class Card */}
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>CLASS 1</span>
                  <span className="badge badge-blue" style={{ fontSize: '0.62rem' }}>
                    {stats.dog_images ? `${stats.dog_images.toLocaleString()} SAMPLES` : 'POSITIVE'}
                  </span>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  DOG
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Canis lupus familiaris. Features pronounced muzzle geometry, varied ear morphologies, and broad facial planes.
                </p>
              </div>

              {/* Cat Class Card */}
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>CLASS 0</span>
                  <span className="badge badge-cyan" style={{ fontSize: '0.62rem' }}>
                    {stats.cat_images ? `${stats.cat_images.toLocaleString()} SAMPLES` : 'NEGATIVE'}
                  </span>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  CAT
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Felis catus. Characterized by pointed upright pinnae, elliptical slit pupils, and prominent tactile vibrissae.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Dataset Statistics State (Real Ingested Stats or Honest Awaiting) */}
          <div className="tech-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Database size={16} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                    Corpus Statistics
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={loadStats}
                  style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                  title="Refresh Dataset Stats"
                >
                  <RefreshCw size={12} />
                </button>
              </div>

              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
                {stats.connected ? 'Verified Dataset Telemetry' : 'Corpus Metadata'}
              </h3>

              {!stats.connected ? (
                <div 
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px dashed var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}
                >
                  <AlertCircle size={18} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                      DATA NOT CONNECTED
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                      Dataset statistics will appear when the training metadata is connected via <code>scripts/setup_dataset.py</code>.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>TOTAL IMAGES</div>
                    <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {stats.total_images?.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>TRAIN COUNT</div>
                    <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-blue)' }}>
                      {stats.train_count?.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>VAL COUNT</div>
                    <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#FFA24C' }}>
                      {stats.validation_count?.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Canonical Source</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Kaggle Competition (dogs-vs-cats)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Standardized Dimension</span>
                  <span style={{ color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>224 × 224 × 3 RGB</span>
                </div>
                {stats.dimensions_summary && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Mean Raw Dimension</span>
                    <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                      {stats.dimensions_summary.mean_width} × {stats.dimensions_summary.mean_height} px
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <a 
                href="https://www.kaggle.com/c/dogs-vs-cats" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                <ExternalLink size={13} />
                <span>View Kaggle Competition</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
