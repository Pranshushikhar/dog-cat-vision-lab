import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, X, Clipboard, Sparkles, Filter } from 'lucide-react';
import { SAMPLE_IMAGES } from '../../services/sampleData';

export default function ImageDropzone({ selectedImage, onSelectImage, onClearImage, isProcessing }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const fileInputRef = useRef(null);

  // Global Clipboard Paste Support (Ctrl + V to paste any screenshot or image)
  useEffect(() => {
    const handlePaste = (e) => {
      if (isProcessing) return;
      if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          e.preventDefault();
          processFile(file);
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isProcessing]);

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
      size: 'Benchmark Specimen',
      type: 'image/jpeg',
      url: sample.url,
      isSample: true,
      species: sample.species,
      sampleClass: sample.class,
      category: sample.category,
      keyFeatures: sample.keyFeatures,
      saliencyRegions: sample.saliencyRegions
    });
  };

  const filteredSamples = activeCategory === 'all'
    ? SAMPLE_IMAGES
    : SAMPLE_IMAGES.filter((s) => s.category === activeCategory);

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
          padding: selectedImage ? '14px' : '32px 20px',
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
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {/* Quick Clear Action Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onClearImage) onClearImage();
              }}
              disabled={isProcessing}
              title="Remove this image"
              style={{
                position: 'absolute',
                top: '-4px',
                right: '4px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                zIndex: 10,
                transition: 'all var(--transition-fast)'
              }}
            >
              <X size={14} />
            </button>

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
            <div style={{ marginTop: '12px', textAlign: 'center', width: '100%', maxWidth: '280px', padding: '0 8px' }}>
              <div 
                title={selectedImage.name}
                aria-label={`Uploaded image filename: ${selectedImage.name}`}
                tabIndex={0}
                style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: 600, 
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  display: 'block'
                }}
              >
                {selectedImage.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {selectedImage.size} • Standardized to 224 × 224 RGB
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div 
              style={{
                width: '46px',
                height: '46px',
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
              <UploadCloud size={22} />
            </div>

            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Drop an image here, or click to browse
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Supports JPG, PNG, and WebP (minimum 10 × 10 px)
            </div>

            {/* Quick Interactive Shortcut Hints */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span 
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-xs)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Clipboard size={11} />
                <span>Ctrl + V to paste</span>
              </span>
              <span 
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-xs)'
                }}
              >
                Drag & Drop
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Preset Benchmark Specimen Selector with Interactive Filter Tabs */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Benchmark Test Library:
          </div>

          {/* Category Filter Tabs */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              { id: 'all', label: 'All (7)' },
              { id: 'cat', label: '🐱 Cats' },
              { id: 'dog', label: '🐶 Dogs' },
              { id: 'unsupported', label: '🚫 Non-Pet' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-xs)',
                  background: activeCategory === tab.id ? 'var(--accent-sage)' : 'transparent',
                  color: activeCategory === tab.id ? 'var(--accent-green)' : 'var(--text-muted)',
                  border: activeCategory === tab.id ? '1px solid var(--accent-green)' : '1px solid transparent',
                  cursor: 'pointer',
                  fontWeight: activeCategory === tab.id ? 600 : 400,
                  transition: 'all var(--transition-fast)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Specimen Buttons Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(76px, 1fr))', gap: '8px' }}>
          {filteredSamples.map((sample) => {
            const isSelected = selectedImage?.url === sample.url;
            const isOod = sample.category === 'unsupported';

            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                disabled={isProcessing}
                title={`${sample.name} (${sample.species})`}
                style={{
                  background: isSelected ? 'var(--accent-sage)' : 'var(--bg-card)',
                  border: isSelected 
                    ? '1.5px solid var(--accent-green)' 
                    : isOod 
                    ? '1px dashed rgba(178, 109, 30, 0.4)' 
                    : '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '5px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  transition: 'all var(--transition-fast)',
                  textAlign: 'center',
                  minWidth: 0,
                  position: 'relative'
                }}
              >
                <div 
                  style={{ 
                    width: '100%', 
                    height: '48px', 
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
                <div 
                  style={{ 
                    fontSize: '0.68rem', 
                    fontWeight: 600, 
                    color: isOod ? '#8C5212' : 'var(--text-primary)', 
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%'
                  }}
                >
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
