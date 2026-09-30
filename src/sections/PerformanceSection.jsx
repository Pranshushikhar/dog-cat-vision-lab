import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, Clock, UploadCloud, RotateCcw, AlertCircle, RefreshCw, BarChart2 } from 'lucide-react';
import { INITIAL_METRICS } from '../data/defaultMetrics';
import { classifierService } from '../services/classifierService';

export default function PerformanceSection() {
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [liveMetricsConnected, setLiveMetricsConnected] = useState(false);
  const [charts, setCharts] = useState(null);

  const loadMetrics = async () => {
    const data = await classifierService.fetchMetrics();
    if (data && data.accuracy !== undefined) {
      setMetrics({
        isConfigured: true,
        status: `Trained Model Metrics (${data.model || 'CNN'})`,
        statusDescription: `Model evaluation performed over ${data.total_evaluated || 'all'} test samples with binary cross-entropy loss.`,
        lastUpdated: new Date().toLocaleDateString(),
        primaryMetric: {
          label: 'Accuracy',
          symbol: 'Acc',
          value: data.accuracy,
          target: 'Classification correctness ratio (TP + TN) / Total',
          note: `Evaluated across ${data.total_evaluated || 'test'} samples`
        },
        detailedMetrics: [
          {
            id: 'precision',
            label: 'Precision',
            value: data.precision,
            description: 'Proportion of dog predictions confirmed to be canine'
          },
          {
            id: 'recall',
            label: 'Recall / Sensitivity',
            value: data.recall,
            description: 'Proportion of actual dogs correctly identified'
          },
          {
            id: 'f1',
            label: 'F1 Score',
            value: data.f1_score,
            description: 'Harmonic mean balancing precision and recall'
          },
          {
            id: 'val_loss',
            label: 'Validation Loss',
            value: data.val_loss,
            description: 'Binary cross-entropy loss across validation partition'
          }
        ]
      });
      setLiveMetricsConnected(true);
      if (data.charts) {
        setCharts(data.charts);
      }
    } else {
      setLiveMetricsConnected(false);
      setMetrics(INITIAL_METRICS);
      setCharts(null);
    }
  };

  useEffect(() => {
    loadMetrics();
    const unsub = classifierService.subscribe(loadMetrics);
    return () => unsub();
  }, []);

  return (
    <section id="performance" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div className="section-eyebrow">
              QUANTITATIVE EVALUATION
            </div>
            {liveMetricsConnected ? (
              <span className="badge badge-cyan">
                <span className="pulse-dot success" />
                VERIFIED EVALUATION RUN CONNECTED
              </span>
            ) : (
              <span className="badge badge-neutral">
                DATA NOT CONNECTED
              </span>
            )}
          </div>
          <h2 className="section-title">
            MODEL PERFORMANCE
          </h2>
          <p className="section-subtitle">
            Evaluation metrics across test data. Bound directly to real training run outputs and confusion matrices.
          </p>
        </div>

        {/* Dynamic Metric Component */}
        <div className="tech-card" style={{ padding: '36px', marginBottom: '32px', border: '1px solid var(--border-strong)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(77, 163, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)' }}>
                <Award size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  PRIMARY EVALUATION METRIC
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Binary Classification Accuracy
                </div>
              </div>
            </div>

            {/* Dynamic Status Tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                className={`badge ${metrics.isConfigured ? 'badge-cyan' : 'badge-neutral'}`}
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
              >
                <span className={`pulse-dot ${metrics.isConfigured ? 'success' : 'idle'}`} />
                <span>STATUS: {metrics.status}</span>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={loadMetrics}
                title="Refresh metrics from backend"
                style={{ padding: '6px' }}
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Primary Accuracy Metric Hero Card */}
          <div 
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
              marginBottom: '28px'
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                ACCURACY
              </div>
              <div 
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                  fontWeight: 700,
                  color: metrics.isConfigured ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  lineHeight: 1
                }}
              >
                {metrics.primaryMetric.value !== null ? `${metrics.primaryMetric.value}%` : '—%'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>
                {metrics.primaryMetric.note}
              </div>
            </div>

            <div style={{ maxWidth: '380px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
                {metrics.statusDescription}
              </div>
              {!liveMetricsConnected && (
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '10px', borderRadius: '4px' }}>
                  Generate real metrics with: <code>python ml/train.py</code>
                </div>
              )}
            </div>
          </div>

          {/* Secondary Detailed Metrics Grid */}
          <div className="grid-4" style={{ marginBottom: charts ? '32px' : '0' }}>
            {metrics.detailedMetrics.map((dm) => (
              <div 
                key={dm.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px'
                }}
              >
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  {dm.label}
                </div>
                <div 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    color: dm.value !== null ? 'var(--accent-blue)' : 'var(--text-muted)',
                    marginBottom: '8px'
                  }}
                >
                  {dm.value !== null ? (typeof dm.value === 'number' ? `${dm.value}%` : dm.value) : '—'}
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                  {dm.description}
                </p>
              </div>
            ))}
          </div>

          {/* Real Training History & Confusion Matrix Charts */}
          {charts && (
            <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <BarChart2 size={18} color="var(--accent-cyan)" />
                <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>
                  Empirical Training Artifacts & Visualizations
                </h4>
              </div>

              <div className="grid-2">
                {charts.training_curves && (
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', padding: '12px' }}>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)', marginBottom: '8px' }}>
                      TRAINING & VALIDATION CURVES
                    </div>
                    <img 
                      src={charts.training_curves} 
                      alt="Training accuracy and loss curves"
                      style={{ width: '100%', borderRadius: '4px', display: 'block' }}
                    />
                  </div>
                )}

                {charts.confusion_matrix && (
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', padding: '12px' }}>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
                      VALIDATION CONFUSION MATRIX
                    </div>
                    <img 
                      src={charts.confusion_matrix} 
                      alt="Confusion matrix heatmap"
                      style={{ width: '100%', borderRadius: '4px', display: 'block' }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
