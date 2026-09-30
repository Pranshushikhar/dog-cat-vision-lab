import React from 'react';
import { Eye, Binary, Award, ArrowUpRight } from 'lucide-react';

const INSIGHTS = [
  {
    tag: 'REPRESENTATION LEARNING',
    title: 'VISUAL FEATURES',
    summary: 'CNNs learn hierarchical visual representations.',
    body: 'Rather than requiring hand-crafted descriptors like SIFT or HOG, convolutional networks automatically optimize filter weights during training. Shallow layers isolate elementary edges, while deeper layers autonomously synthesize complex facial landmarks (whiskers, snouts, ears).',
    icon: Eye,
    color: '#4DA3FF'
  },
  {
    tag: 'DECISION BOUNDARY',
    title: 'BINARY CLASSIFICATION',
    summary: 'The final decision separates two classes.',
    body: 'In binary classification, the high-dimensional feature space is projected down onto a single continuous decision axis via a sigmoid or two-neuron softmax function. The decision threshold balances false positives against false negatives.',
    icon: Binary,
    color: '#55E6D0'
  },
  {
    tag: 'METRIC ANALYSIS',
    title: 'MODEL EVALUATION',
    summary: 'Accuracy provides a simple measure of classification performance.',
    body: 'While accuracy measures the overall proportion of correct classifications, balanced datasets like Kaggle Dogs vs Cats are critical to preventing majority-class bias. Complementary metrics like Precision, Recall, and Loss provide deeper insight into model calibration.',
    icon: Award,
    color: '#6C63FF'
  }
];

export default function InsightsSection() {
  return (
    <section id="insights" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            THEORETICAL SYNTHESIS
          </div>
          <h2 className="section-title">
            PROJECT INSIGHTS
          </h2>
          <p className="section-subtitle">
            Core scientific takeaways on feature extraction, decision boundaries, and evaluation rigor in convolutional vision models.
          </p>
        </div>

        {/* 3 Concise Insight Cards */}
        <div className="grid-3">
          {INSIGHTS.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.title}
                className="tech-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-medium)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: item.color, letterSpacing: '0.1em' }}>
                    {item.tag}
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                    <Icon size={16} />
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {item.title}
                  </h3>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: item.color, marginBottom: '12px' }}>
                    {item.summary}
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
