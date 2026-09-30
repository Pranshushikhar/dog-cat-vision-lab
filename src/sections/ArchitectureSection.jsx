import React, { useState, useEffect } from 'react';
import { CNN_LAYERS, ARCHITECTURE_NOTE } from '../data/architectureData';
import { Layers, ArrowDown, Info, Cpu, CheckCircle, RefreshCw } from 'lucide-react';
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
    <section id="architecture" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div className="section-eyebrow">
              NEURAL NETWORK TOPOLOGY
            </div>
            {isModelConnected ? (
              <span className="badge badge-cyan">
                <span className="pulse-dot success" />
                TRAINED MODEL CONNECTED ({archData.total_params?.toLocaleString()} PARAMS)
              </span>
            ) : (
              <span className="badge badge-neutral">
                MODEL ARCHITECTURE: Awaiting trained model
              </span>
            )}
          </div>
          <h2 className="section-title">
            MODEL ARCHITECTURE
          </h2>
          <p className="section-subtitle">
            Structural topology of the convolutional network for binary visual discrimination between dogs and cats.
          </p>
        </div>

        {/* Status Notice */}
        <div 
          style={{
            background: isModelConnected ? 'rgba(85, 230, 208, 0.08)' : 'rgba(77, 163, 255, 0.08)',
            border: `1px solid ${isModelConnected ? 'rgba(85, 230, 208, 0.3)' : 'rgba(77, 163, 255, 0.25)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '36px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Info size={18} color={isModelConnected ? 'var(--accent-cyan)' : 'var(--accent-blue)'} />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {isModelConnected ? (
                <span>
                  <strong style={{ color: 'var(--text-primary)' }}>Trained Checkpoint Verified:</strong>{' '}
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{archData.architecture_name || 'DogCat_CNN_Classifier'}</span>. 
                  Extracted live weights from <code>models/dog_cat_cnn.keras</code> with {archData.total_params?.toLocaleString()} trainable parameters.
                </span>
              ) : (
                <span>
                  <strong style={{ color: 'var(--text-primary)' }}>Architecture Specification Notice:</strong>{' '}
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>"{ARCHITECTURE_NOTE}"</span>. 
                  Dimensions represent candidate baseline topology. Run <code>python run_pipeline.py</code> to bind trained weights.
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={loadArchitecture}
            title="Refresh architecture metadata"
            style={{ padding: '6px' }}
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Two-Column Layout: Architecture Flow + Layer Inspector */}
        <div className="grid-2" style={{ alignItems: 'start' }}>
          {/* Left: Sequential Layer Hierarchy */}
          <div className="tech-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Pipeline Sequence ({displayLayers.length} Layers)
              </span>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>
                Click layer to inspect
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {displayLayers.map((layer, idx) => {
                const isSelected = selectedLayerIndex === idx;
                const layerName = layer.name || layer.type;
                const layerShape = layer.shape || (layer.output_shape ? JSON.stringify(layer.output_shape) : null);

                return (
                  <React.Fragment key={layer.id || layer.name || idx}>
                    <div
                      onClick={() => setSelectedLayerIndex(idx)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-xs)',
                        background: isSelected ? 'rgba(77, 163, 255, 0.12)' : 'var(--bg-surface)',
                        border: isSelected ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div 
                          style={{ 
                            width: '24px', 
                            height: '24px', 
                            borderRadius: '4px', 
                            background: isSelected ? 'var(--accent-blue)' : 'rgba(255,255,255,0.06)',
                            color: isSelected ? '#07080D' : 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700
                          }}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                            {layerName}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {layer.type} {layer.params !== undefined ? `• ${layer.params.toLocaleString()} params` : ''}
                          </div>
                        </div>
                      </div>

                      {layerShape && (
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                          {layerShape}
                        </div>
                      )}
                    </div>

                    {idx < displayLayers.length - 1 && (
                      <div style={{ display: 'flex', justifyContent: 'center', padding: '2px 0' }}>
                        <ArrowDown size={14} color="var(--border-strong)" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Right: Layer Inspector Panel */}
          <div className="tech-card" style={{ position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Cpu size={16} color="var(--accent-cyan)" />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                Layer Inspector // Layer {selectedLayerIndex + 1}
              </span>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              {activeLayer.name}
            </h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              <span className="badge badge-blue">
                {activeLayer.type}
              </span>
              {activeLayer.params !== undefined && (
                <span className="badge badge-cyan">
                  Params: {activeLayer.params.toLocaleString()}
                </span>
              )}
              {activeLayer.activation && (
                <span className="badge badge-violet">
                  Activation: {activeLayer.activation}
                </span>
              )}
            </div>

            {activeLayer.math && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Mathematical Formulation
                </div>
                <div 
                  style={{
                    background: '#040508',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '12px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    color: 'var(--accent-cyan)'
                  }}
                >
                  {activeLayer.math}
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Operational Role in Vision Pipeline
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {activeLayer.description || `Performs ${activeLayer.type} transformation within the neural topology.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
