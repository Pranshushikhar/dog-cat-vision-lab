import React, { useState, useEffect } from 'react';
import { ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';
import ImageDropzone from './ImageDropzone';
import PipelineVisualizer, { PIPELINE_STAGES } from './PipelineVisualizer';
import InferenceResult from './InferenceResult';
import { classifierService, CLASSIFIER_MODES } from '../../services/classifierService';

export default function LiveClassifier({ onOpenConfigModal, initialImage = null }) {
  const [selectedImage, setSelectedImage] = useState(initialImage);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(-1);
  const [inferenceResult, setInferenceResult] = useState(null);
  const [activeMode, setActiveMode] = useState(classifierService.getMode());

  useEffect(() => {
    if (initialImage) {
      setSelectedImage(initialImage);
      setInferenceResult(null);
      setCurrentStageIndex(-1);
    }
  }, [initialImage]);

  useEffect(() => {
    return classifierService.subscribe((state) => {
      setActiveMode(state.mode);
    });
  }, []);

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
    }, 160);

    try {
      const targetPayload = selectedImage.file || selectedImage.url;
      const result = await classifierService.predict(targetPayload, {
        confidenceThreshold
      });

      clearInterval(stageInterval);
      setCurrentStageIndex(PIPELINE_STAGES.length - 1);
      setInferenceResult(result);
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

  const handleSwitchToDemo = () => {
    classifierService.setMode(CLASSIFIER_MODES.DEMO_MODE);
    setActiveMode(CLASSIFIER_MODES.DEMO_MODE);
    if (selectedImage) {
      setTimeout(() => {
        handleRunClassification();
      }, 50);
    }
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Threshold: {(confidenceThreshold * 100).toFixed(0)}%
          </span>
          <input
            type="range"
            min="0.1"
            max="0.9"
            step="0.05"
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
            style={{
              width: '120px',
              accentColor: 'var(--accent-green)',
              cursor: 'pointer'
            }}
            aria-label="Confidence decision threshold"
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            (Cat ≤ threshold &lt; Dog)
          </span>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', alignItems: 'start' }}>
        {/* Left: Pure White Dropzone Workspace */}
        <div className="tech-card" style={{ padding: '20px', background: 'var(--bg-card)' }}>
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
                style={{ flex: 1 }}
              >
                <span>{isProcessing ? 'Analyzing Features...' : 'Classify Photograph'}</span>
                {!isProcessing && <ArrowRight size={15} />}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClearImage}
                disabled={isProcessing}
                title="Clear selected image"
                style={{ padding: '10px' }}
              >
                <RotateCcw size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Right: Inference Result Panel */}
        <div>
          <InferenceResult
            result={inferenceResult}
            isProcessing={isProcessing}
            hasImage={!!selectedImage}
            onOpenConfig={onOpenConfigModal}
            onSwitchToDemo={handleSwitchToDemo}
          />
        </div>
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
