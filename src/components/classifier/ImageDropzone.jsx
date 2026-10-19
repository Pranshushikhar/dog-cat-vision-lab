import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';
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
      alert('Please upload a valid image file (JPG, PNG, WebP).');
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
      size: 'Benchmark Sample',
      type: 'image/jpeg',
      url: sample.url,
      isSample: true,
      species: sample.species,
      sampleClass: sample.class
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Upload Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedImage && fileInputRef.current?.click()}
        style={{
          border: isDragOver
            ? '2px dashed var(--accent-green)'
            : selectedImage
            ? '1px solid var(--border-medium)'
            : '2px dashed var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          background: isDragOver
            ? 'var(--accent-sage)'
            : selectedImage
            ? 'var(--bg-card)'
            : 'var(--bg-surface)',
          padding: selectedImage ? '14px' : '36px 20px',
          textAlign: 'center',
          cursor: selectedImage ? 'default' : 'pointer',
          transition: 'all var(--transition-fast)',
          minHeight: '220px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
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
            {/* Clean Photographic Preview Box */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '260px',
                height: '210px',
                borderRadius: 'var(--radius-xs)',
                overflow: 'hidden',
                background: '#EAEBE3',
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
            </div>

            {/* Specimen File Information */}
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {selectedImage.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {selectedImage.size} • Standardized to 224 × 224 RGB
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div 
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
                color: 'var(--accent-green)'
              }}
            >
              <UploadCloud size={20} />
            </div>

            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Drag and drop an image here, or click to browse
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Supports JPG, PNG, and WebP (minimum 10 × 10 px)
            </div>
          </div>
        )}
      </div>

      {/* Preset Real Benchmark Specimen Selector */}
      <div>
        <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
          Or test with a benchmark specimen:
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {SAMPLE_IMAGES.map((sample) => {
            const isSelected = selectedImage?.url === sample.url;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                disabled={isProcessing}
                style={{
                  background: isSelected ? 'var(--accent-sage)' : 'var(--bg-card)',
                  border: isSelected ? '1px solid var(--accent-green)' : '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  transition: 'all var(--transition-fast)',
                  textAlign: 'center'
                }}
              >
                <div 
                  style={{ 
                    width: '100%', 
                    height: '52px', 
                    borderRadius: 'var(--radius-xs)', 
                    overflow: 'hidden', 
                    background: '#EAEBE3' 
                  }}
                >
                  <img
                    src={sample.url}
                    alt={sample.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  {sample.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
