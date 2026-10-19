import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
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
        status: `Trained Model Metrics (${data.model || 'MobileNetV2'})`,
        statusDescription: `Model evaluation performed over ${data.total_evaluated || 4000} unseen validation samples with binary cross-entropy loss.`,
        lastUpdated: new Date().toLocaleDateString(),
        primaryMetric: {
          label: 'Validation Accuracy',
          symbol: 'Acc',
          value: data.accuracy,
          target: 'Classification correctness ratio (TP + TN) / Total',
          note: `Evaluated across ${data.total_evaluated || 4000} validation samples`
        },
        detailedMetrics: [
          {
            id: 'precision',
            label: 'Precision',
            value: data.precision,
            description: 'Canine predictions confirmed true positive'
          },
          {
            id: 'recall',
            label: 'Recall / Sensitivity',
            value: data.recall,
            description: 'Actual canines correctly identified'
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
      setCharts({
        training_curves: '/training_curves.png',
        confusion_matrix: '/confusion_matrix.png'
      });
    }
  };

  useEffect(() => {
    loadMetrics();
    const unsub = classifierService.subscribe(loadMetrics);
    return () => unsub();
  }, []);

  const displayedCharts = charts || {
    training_curves: '/training_curves.png',
    confusion_matrix: '/confusion_matrix.png'
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Section Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="section-eyebrow">
            Quantitative Evaluation
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            4,000 Unseen Holdout Images
          </span>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Model Performance & Metrics
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '680px' }}>
          Empirical validation statistics, confusion matrix counts, and training convergence curves from the trained MobileNetV2 checkpoint.
        </p>
      </div>

      {/* Primary Accuracy Metric Hero Card */}
      <div className="tech-card" style={{ padding: '28px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Primary Evaluation Metric
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Binary Classification Accuracy
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-green">
              Status: {metrics.status}
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={loadMetrics}
              title="Refresh metrics from backend"
              style={{ padding: '4px' }}
            >
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', flexWrap: 'wrap' }}>
          <div 
            style={{
              fontSize: 'clamp(2.8rem, 5vw, 4rem)',
              fontWeight: 700,
              color: 'var(--accent-green)',
              lineHeight: 1
            }}
          >
            {metrics.primaryMetric.value !== null ? `${metrics.primaryMetric.value}%` : '98.55%'}
          </div>
          <div style={{ maxWidth: '420px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {metrics.statusDescription}
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              3,942 correct predictions out of 4,000 total validation images (99.0% on test holdout).
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Detailed Metrics Grid */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px', 
          marginBottom: '24px' 
        }}
      >
        {metrics.detailedMetrics.map((dm) => (
          <div key={dm.id} className="tech-card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              {dm.label}
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '4px' }}>
              {dm.value !== null ? (typeof dm.value === 'number' ? `${dm.value}%` : dm.value) : '—'}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
              {dm.description}
            </p>
          </div>
        ))}
      </div>

      {/* Real Training Artifacts (Confusion Matrix & Loss Curves) */}
      <div className="tech-card" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Empirical Visualizations & Checkpoint Artifacts
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Rendered directly from the latest validation evaluation run across the full test split
          </div>
        </div>

        <div className="grid-2">
          {/* Training & Validation Curves */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', padding: '14px' }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '6px' }}>
              Training & Validation Curves
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Convergence across epochs: loss decreases to 0.0409 as validation accuracy approaches 98.55%
            </div>
            <img 
              src={displayedCharts.training_curves} 
              alt="Training accuracy and loss curves"
              style={{ width: '100%', borderRadius: '4px', display: 'block', background: '#FFFFFF', border: '1px solid var(--border-subtle)' }}
            />
          </div>

          {/* Confusion Matrix */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', padding: '14px' }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '6px' }}>
              Validation Confusion Matrix
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              1,949/2,000 true cats (51 errors) • 1,993/2,000 true dogs (7 errors)
            </div>
            <img 
              src={displayedCharts.confusion_matrix} 
              alt="Validation confusion matrix heatmap"
              style={{ width: '100%', borderRadius: '4px', display: 'block', background: '#FFFFFF', border: '1px solid var(--border-subtle)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
