import React, { useState, useEffect } from 'react';
import { CNN_LAYERS, ARCHITECTURE_NOTE } from '../data/architectureData';
import { Info, RefreshCw } from 'lucide-react';
import { classifierService } from '../services/classifierService';

export default function ArchitectureSection() {
  const [archData, setArchData] = useState(null);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);

  const loadArchitecture = async () => {
    const data = await classifierService.fetchArchitecture();
    setArchData(data);
  };

  useEffect(() => {
    loadArchitecture();
    const unsub = classifierService.subscribe(loadArchitecture);
    return () => unsub();
  }, []);

  const isModelConnected = archData && archData.status === 'TRAINED_MODEL_CONNECTED';
  const displayLayers = (isModelConnected && archData.layers) ? archData.layers : CNN_LAYERS;
  const activeLayer = displayLayers[selectedLayerIndex] || displayLayers[0];

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Section Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="section-eyebrow">
            Topology Breakdown
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            2.26M Parameters • MobileNetV2
          </span>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
          Neural Network Architecture
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '640px' }}>
          Sequential layer hierarchy, tensor shapes, and activation functions mapping input photographs to a binary decision score.
        </p>
      </div>

      {/* Two-Column Layout: Layer List + Selected Layer Inspector */}
      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Left: Sequential Layer Hierarchy */}
        <div className="tech-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
            Layer Stack (Click to Inspect)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {displayLayers.map((layer, idx) => {
              const isSelected = selectedLayerIndex === idx;
              return (
                <button
                  key={layer.id || idx}
                  type="button"
                  onClick={() => setSelectedLayerIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-xs)',
                    background: isSelected ? 'var(--accent-sage)' : 'var(--bg-surface)',
                    border: isSelected ? '1px solid var(--accent-green)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      0{idx + 1}
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {layer.name}
                    </span>
                  </div>

                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {layer.outputShape || layer.shape || '—'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Layer Inspector Detail */}
        <div className="tech-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Layer Inspector
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {activeLayer.name}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
            {activeLayer.description || activeLayer.desc || 'Standard convolutional or transformation operation.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-xs)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Output Shape</span>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                {activeLayer.outputShape || activeLayer.shape || '—'}
              </span>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-xs)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Param Count</span>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                {typeof activeLayer.params === 'number' ? activeLayer.params.toLocaleString() : (activeLayer.params || '0')}
              </span>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-xs)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Activation Function</span>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-green)' }}>
                {activeLayer.activation || 'None / Linear'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
