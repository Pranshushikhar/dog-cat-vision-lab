import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, CheckCircle2, Sparkles } from 'lucide-react';
import { SAMPLE_IMAGES } from '../../services/sampleData';

export default function ImageDropzone({ selectedImage, onSelectImage, onClearImage, isProcessing }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isProcessing) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isProcessing) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP, SVG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      onSelectImage({
        file,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type,
        url: event.target.result,
        isSample: false
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample) => {
    if (isProcessing) return;
    onSelectImage({
      file: null,
      name: sample.name,
      size: 'Sample Asset',
      type: 'image/svg+xml',
      url: sample.url,
      isSample: true,
      species: sample.species,
      sampleClass: sample.class
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedImage && fileInputRef.current?.click()}
        style={{
          border: isDragOver
            ? '2px dashed var(--accent-blue)'
            : selectedImage
            ? '1px solid var(--border-strong)'
            : '2px dashed var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          background: isDragOver
            ? 'rgba(77, 163, 255, 0.08)'
            : selectedImage
            ? 'var(--bg-secondary)'
            : 'rgba(17, 20, 29, 0.5)',
          padding: selectedImage ? '16px' : '40px 24px',
          textAlign: 'center',
          cursor: selectedImage ? 'default' : 'pointer',
          transition: 'all var(--transition-normal)',
          position: 'relative',
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileInput}
          disabled={isProcessing}
        />

        {selectedImage ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Image Preview Box with Technical Frame */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '280px',
                height: '240px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                background: '#040508',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.name || 'Target evaluation image'}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />

              {/* Scanning Laser Line when processing */}
              {isProcessing && <div className="laser-scanner" />}

              {/* Corner Reticles */}
              <div style={{ position: 'absolute', top: '6px', left: '6px', width: '12px', height: '12px', borderTop: '2px solid var(--accent-blue)', borderLeft: '2px solid var(--accent-blue)' }} />
              <div style={{ position: 'absolute', top: '6px', right: '6px', width: '12px', height: '12px', borderTop: '2px solid var(--accent-blue)', borderRight: '2px solid var(--accent-blue)' }} />
              <div style={{ position: 'absolute', bottom: '6px', left: '6px', width: '12px', height: '12px', borderBottom: '2px solid var(--accent-blue)', borderLeft: '2px solid var(--accent-blue)' }} />
              <div style={{ position: 'absolute', bottom: '6px', right: '6px', width: '12px', height: '12px', borderBottom: '2px solid var(--accent-blue)', borderRight: '2px solid var(--accent-blue)' }} />
            </div>

            {/* Metadata Bar */}
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', padding: '0 8px' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {selectedImage.name}
                </div>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {selectedImage.size} • {selectedImage.type.replace('image/', '').toUpperCase()}
                </div>
              </div>

              {!isProcessing && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload different image"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={onClearImage}
                    title="Clear image"
                    style={{ color: 'var(--status-error)' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(77, 163, 255, 0.08)',
                border: '1px solid rgba(77, 163, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-blue)'
              }}
            >
              <UploadCloud size={28} />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Drag & drop image here or click to browse
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                PNG, JPG, WEBP, SVG • Resized to 224 × 224 for CNN
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preset Test Specimens */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Or Load Research Specimen:
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
            Instant Evaluation
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {SAMPLE_IMAGES.map((sample) => {
            const isCurrent = selectedImage?.name === sample.name;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                disabled={isProcessing}
                style={{
                  background: isCurrent ? 'rgba(77, 163, 255, 0.15)' : 'var(--bg-surface)',
                  border: isCurrent ? '1px solid var(--accent-blue)' : '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  transition: 'all var(--transition-fast)',
                  textAlign: 'center'
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '4px', overflow: 'hidden', background: '#0B0D14', border: '1px solid var(--border-subtle)' }}>
                  <img src={sample.url} alt={sample.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                  {sample.name}
                </div>
                <span className={`badge ${sample.class === 'dog' ? 'badge-blue' : 'badge-cyan'}`} style={{ fontSize: '0.62rem', padding: '2px 6px' }}>
                  {sample.class.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
