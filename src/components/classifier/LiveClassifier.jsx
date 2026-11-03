import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, RotateCcw, AlertTriangle, History, Clock, Check, Sliders, Trash2, X } from 'lucide-react';
import ImageDropzone from './ImageDropzone';
import PipelineVisualizer, { PIPELINE_STAGES } from './PipelineVisualizer';
import InferenceResult from './InferenceResult';
import { classifierService, CLASSIFIER_MODES } from '../../services/classifierService';

const HISTORY_STORAGE_KEY = 'pawvision_prediction_history';

export default function LiveClassifier({ onOpenConfigModal, initialImage = null }) {
  const [selectedImage, setSelectedImage] = useState(initialImage);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(-1);
  const [inferenceResult, setInferenceResult] = useState(null);
  const [activeMode, setActiveMode] = useState(classifierService.getMode());
  const [sessionHistory, setSessionHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    if (initialImage) {
      setSelectedImage(initialImage);
      setInferenceResult(null);
      setCurrentStageIndex(-1);
    }
  }, [initialImage]);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(sessionHistory));
    } catch (e) {
      // Ignore localStorage quote limits
    }
  }, [sessionHistory]);

  useEffect(() => {
    return classifierService.subscribe((state) => {
      setActiveMode(state.mode);
    });
  }, []);

  // Keyboard shortcut listener (Enter = classify, Esc = clear)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'Enter' && selectedImage && !isProcessing) {
        e.preventDefault();
        handleRunClassification();
      } else if (e.key === 'Escape' && selectedImage && !isProcessing) {
        e.preventDefault();
        handleClearImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, isProcessing, confidenceThreshold]);

  const handleSelectImage = (img) => {
    setSelectedImage(img);
    setInferenceResult(null);
    setCurrentStageIndex(-1);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setInferenceResult(null);
    setCurrentStageIndex(-1);
  };

  const handleRunClassification = async () => {
    if (!selectedImage || isProcessing) return;

    setIsProcessing(true);
    setCurrentStageIndex(0);

    const stageInterval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < PIPELINE_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 45);

    try {
      const targetPayload = selectedImage.file || selectedImage.url;
      const result = await classifierService.predict(targetPayload, {
        confidenceThreshold
      });

      clearInterval(stageInterval);
      setCurrentStageIndex(PIPELINE_STAGES.length - 1);
      setInferenceResult(result);

      // Append to session test history
      if (result && result.success) {
        const historyItem = {
          id: Date.now(),
          image: {
            url: selectedImage.url,
            name: selectedImage.name,
            size: selectedImage.size
          },
          result: { ...result },
          threshold: confidenceThreshold,
          timeStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
        setSessionHistory((prev) => [historyItem, ...prev.filter((h) => h.image.url !== selectedImage.url).slice(0, 11)]);
      }
    } catch (err) {
      clearInterval(stageInterval);
      setInferenceResult({
        success: false,
        isModelConnected: false,
        error: err.message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestoreHistoryItem = (item) => {
    if (isProcessing) return;
    setSelectedImage(item.image);
    setInferenceResult(item.result);
    setConfidenceThreshold(item.threshold || 0.5);
    setCurrentStageIndex(PIPELINE_STAGES.length - 1);
  };

  const handleDeleteHistoryItem = (id, e) => {
    e.stopPropagation();
    setSessionHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllHistory = () => {
    setSessionHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (e) {
      // Ignore
    }
  };

  const handleSwitchToDemo = () => {
    classifierService.setMode(CLASSIFIER_MODES.DEMO_MODE);
    setActiveMode(CLASSIFIER_MODES.DEMO_MODE);
    if (selectedImage) {
      setTimeout(() => {
        handleRunClassification();
      }, 50);
    }
  };

  // Real-time reactive decision boundary re-evaluation
  const effectiveResult = useMemo(() => {
    if (!inferenceResult || !inferenceResult.success || !inferenceResult.isSupported || !inferenceResult.rawProbabilities) {
      return inferenceResult;
    }
    const dogP = inferenceResult.rawProbabilities.dog;
    const catP = inferenceResult.rawProbabilities.cat;
    const isDog = dogP >= confidenceThreshold;
    return {
      ...inferenceResult,
      prediction: isDog ? 'DOG' : 'CAT',
      confidence: isDog ? dogP : catP,
      effectiveThreshold: confidenceThreshold
    };
  }, [inferenceResult, confidenceThreshold]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Workspace Configuration Bar */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 18px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span className="hover-wiggle">🐾</span>
            <span>Threshold: {(confidenceThreshold * 100).toFixed(0)}%</span>
          </span>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.78rem' }} title="Feline boundary">🐱</span>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
              disabled={isProcessing}
              style={{
                width: '120px',
                accentColor: 'var(--accent-green)',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                opacity: isProcessing ? 0.6 : 1
              }}
              aria-label="Confidence decision threshold"
            />
            <span style={{ fontSize: '0.78rem' }} title="Canine boundary">🐶</span>
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            (Cat &lt; {(confidenceThreshold * 100).toFixed(0)}% ≤ Dog)
          </span>
          {inferenceResult && inferenceResult.isSupported && (
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', background: 'var(--accent-sage)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span className="pulse-dot success" style={{ width: '5px', height: '5px' }} />
              <span>Live boundary</span>
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {activeMode === CLASSIFIER_MODES.DEMO_MODE ? (
            <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
              <AlertTriangle size={12} />
              Demo Simulation Mode
            </span>
          ) : (
            <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
              Real Backend Inference
            </span>
          )}
        </div>
      </div>

      {/* Main Classifier Workspace Grid (Upload Box & Inference Result) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px', alignItems: 'start', width: '100%' }}>
        {/* Left: Dropzone Workspace */}
        <div className="tech-card" style={{ padding: '20px', background: 'var(--bg-card)', minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
          <ImageDropzone
            selectedImage={selectedImage}
            onSelectImage={handleSelectImage}
            onClearImage={handleClearImage}
            isProcessing={isProcessing}
          />

          {/* Action Trigger Row */}
          {selectedImage && (
            <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleRunClassification}
                disabled={isProcessing}
                aria-busy={isProcessing}
                style={{ 
                  flex: 1,
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  pointerEvents: isProcessing ? 'none' : 'auto'
                }}
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin" style={{ display: 'inline-block', fontSize: '1rem' }}>🐾</span>
                    <span>Sniffing Features...</span>
                  </>
                ) : (
                  <>
                    <span>Classify Photograph</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClearImage}
                disabled={isProcessing}
                title="Clear selected image (Esc)"
                style={{ padding: '10px' }}
              >
                <RotateCcw size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Right: Inference Result Panel */}
        <div style={{ minWidth: 0, width: '100%' }}>
          <InferenceResult
            result={effectiveResult}
            selectedImage={selectedImage}
            isProcessing={isProcessing}
            hasImage={!!selectedImage}
            onOpenConfig={onOpenConfigModal}
            onSwitchToDemo={handleSwitchToDemo}
            onClassifyAnother={handleClearImage}
          />
        </div>
      </div>

      {/* Session Test History / Quick Comparison Tray */}
      <div className="tech-card" style={{ padding: '18px 20px', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={15} color="var(--accent-teal)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Prediction History {sessionHistory.length > 0 && `(${sessionHistory.length})`}
            </span>
          </div>

          {sessionHistory.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Click specimen to inspect · Saved locally
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleClearAllHistory}
                style={{ padding: '3px 8px', fontSize: '0.72rem', color: 'var(--accent-red)' }}
                title="Clear all stored test history"
              >
                <Trash2 size={12} />
                <span>Clear All</span>
              </button>
            </div>
          ) : (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Saved automatically in browser storage
            </span>
          )}
        </div>

        {sessionHistory.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
            {sessionHistory.map((item) => {
              const isCurrent = selectedImage?.url === item.image.url;
              const isUnsupported = !item.result.isSupported;
              const isDog = item.result.prediction === 'DOG';

              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleRestoreHistoryItem(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-xs)',
                    background: isCurrent ? 'var(--accent-teal-subtle)' : 'var(--bg-surface)',
                    border: isCurrent ? '1px solid var(--accent-teal)' : '1px solid var(--border-medium)',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}
                  className="hover-card"
                >
                  <img
                    src={item.image.url}
                    alt={item.image.name}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '4px',
                      objectFit: 'cover',
                      flexShrink: 0,
                      background: 'var(--bg-surface)'
                    }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: isUnsupported ? 'var(--accent-amber)' : 'var(--accent-teal)',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {item.result.prediction}
                      </span>
                      {item.result.confidence && (
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          {(item.result.confidence * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                    <div
                      title={item.image.name}
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {item.image.name}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                    title="Remove from history"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      opacity: 0.6
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--accent-red)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                  >
                    <X size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            No past classifications in this session. Classify a photograph above to start tracking history.
          </div>
        )}
      </div>

      {/* Pipeline Visualizer (Subtle & Purposeful) */}
      <div className="tech-card" style={{ padding: '20px', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Transformation Pipeline
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Step-by-step tensor processing from raw RGB bytes to decision scalar
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            Input: 224 × 224 × 3
          </span>
        </div>

        <PipelineVisualizer
          currentStageIndex={currentStageIndex}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
}
