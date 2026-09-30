import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Sliders, Shield, AlertTriangle, ArrowRight } from 'lucide-react';
import ImageDropzone from './ImageDropzone';
import PipelineVisualizer, { PIPELINE_STAGES } from './PipelineVisualizer';
import InferenceResult from './InferenceResult';
import { classifierService, CLASSIFIER_MODES } from '../../services/classifierService';

export default function LiveClassifier({ onOpenConfigModal }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(-1);
  const [inferenceResult, setInferenceResult] = useState(null);
  const [activeMode, setActiveMode] = useState(classifierService.getMode());

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

    // Animate through pipeline stages
    const stageInterval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < PIPELINE_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 180);

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Controls Bar */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          padding: '14px 20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Inference Controller
          </span>
          <div className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
            Target: 224 × 224 RGB
          </div>
          {activeMode === CLASSIFIER_MODES.DEMO_MODE ? (
            <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>
              <AlertTriangle size={11} />
              DEMO SIMULATION ACTIVE
            </span>
          ) : (
            <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
              <Shield size={11} />
              STRICT API INTEGRITY
            </span>
          )}
        </div>

        {/* Threshold Slider & Mode Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sliders size={14} color="var(--text-muted)" />
            <label htmlFor="threshold-slider" style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Threshold:
            </label>
            <input
              id="threshold-slider"
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
              style={{ width: '80px', accentColor: 'var(--accent-blue)', cursor: 'pointer' }}
              disabled={isProcessing}
            />
            <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', minWidth: '32px' }}>
              {confidenceThreshold.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenConfigModal}
            style={{ fontSize: '0.78rem' }}
          >
            Config API
          </button>
        </div>
      </div>

      {/* Main Two-Column Interactive Lab */}
      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Left: Dropzone & Specimen Selector */}
        <div className="tech-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              01 // Input Specimen
            </span>
            {selectedImage && (
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                LOADED
              </span>
            )}
          </div>

          <ImageDropzone
            selectedImage={selectedImage}
            onSelectImage={handleSelectImage}
            onClearImage={handleClearImage}
            isProcessing={isProcessing}
          />

          {/* Action Trigger Button */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRunClassification}
              disabled={!selectedImage || isProcessing}
              style={{
                flex: 1,
                opacity: (!selectedImage || isProcessing) ? 0.5 : 1,
                cursor: (!selectedImage || isProcessing) ? 'not-allowed' : 'pointer'
              }}
            >
              <Play size={16} />
              <span>{isProcessing ? 'EXTRACTING FEATURES...' : 'RUN CLASSIFICATION'}</span>
            </button>

            {selectedImage && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClearImage}
                disabled={isProcessing}
                title="Reset Image"
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Right: Inference Output and Analysis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <InferenceResult
            result={inferenceResult}
            isProcessing={isProcessing}
            hasImage={Boolean(selectedImage)}
            onOpenConfig={onOpenConfigModal}
            onSwitchToDemo={handleSwitchToDemo}
          />
        </div>
      </div>

      {/* Full-Width Visual Pipeline Stages Below */}
      <div className="tech-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            02 // Computer Vision Convolutional Pipeline
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Sequential Layer Transformations
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
