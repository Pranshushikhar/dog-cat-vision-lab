import React, { useEffect, useRef } from 'react';
import { ArrowDown, Play, Layers, Eye, Cpu, Database, Award, Binary } from 'lucide-react';

export default function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Simulation grid nodes & scanning kernel
    const cols = 28;
    const rows = 16;
    const cellW = width / cols;
    const cellH = height / rows;

    let scanX = 0;
    let scanSpeed = 1.2;
    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle pixel matrix
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cellW;
          const y = r * cellH;
          const distToScan = Math.abs(x - scanX);
          
          let alpha = 0.05;
          let isExcited = distToScan < cellW * 3;

          if (isExcited) {
            alpha = Math.max(0.1, 0.45 - (distToScan / (cellW * 3)) * 0.35);
            ctx.fillStyle = (r + c) % 3 === 0 ? 'rgba(77, 163, 255, ' + alpha + ')' : 'rgba(85, 230, 208, ' + alpha + ')';
            ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4);
          } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
            ctx.strokeRect(x, y, cellW, cellH);
          }
        }
      }

      // 2. Convolution Kernel box (3x3 receptive field sliding)
      const kernelW = cellW * 3;
      const kernelH = cellH * 3;
      const kernelY = (height / 2 - kernelH / 2) + Math.sin(tick * 0.03) * (height * 0.2);

      ctx.save();
      ctx.strokeStyle = '#4DA3FF';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(scanX - kernelW / 2, kernelY, kernelW, kernelH);

      // Kernel corner brackets
      ctx.fillStyle = '#55E6D0';
      ctx.fillRect(scanX - kernelW / 2 - 2, kernelY - 2, 6, 2);
      ctx.fillRect(scanX - kernelW / 2 - 2, kernelY - 2, 2, 6);
      ctx.fillRect(scanX + kernelW / 2 - 4, kernelY - 2, 6, 2);
      ctx.fillRect(scanX + kernelW / 2, kernelY - 2, 2, 6);
      ctx.restore();

      // 3. Scanning Laser Line
      ctx.beginPath();
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, 'rgba(77, 163, 255, 0)');
      grad.addColorStop(0.5, 'rgba(85, 230, 208, 0.8)');
      grad.addColorStop(1, 'rgba(77, 163, 255, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.moveTo(scanX, 0);
      ctx.lineTo(scanX, height);
      ctx.stroke();

      // 4. Feature Extraction Node Signals
      const nodes = [
        { x: width * 0.8, y: height * 0.25, label: 'F_EDGE' },
        { x: width * 0.85, y: height * 0.5, label: 'F_TEXTURE' },
        { x: width * 0.8, y: height * 0.75, label: 'F_CLASS' }
      ];

      nodes.forEach((node, i) => {
        const pulse = Math.sin(tick * 0.05 + i) * 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 5 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = i === 2 ? '#6C63FF' : '#4DA3FF';
        ctx.fill();

        // Connecting conduit from scan
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(77, 163, 255, 0.12)';
        ctx.setLineDash([2, 4]);
        ctx.moveTo(scanX, kernelY + kernelH / 2);
        ctx.lineTo(node.x, node.y);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Update scan position
      scanX += scanSpeed;
      if (scanX > width + 40) {
        scanX = -40;
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section id="hero" className="section" style={{ paddingTop: '80px', paddingBottom: '90px', borderBottom: '1px solid var(--border-medium)' }}>
      <div className="container">
        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div className="section-eyebrow">
            MACHINE LEARNING / COMPUTER VISION
          </div>
          <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
            ACADEMIC LAB SPECIFICATION
          </span>
        </div>

        {/* Heading */}
        <h1 
          style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.8rem)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: '20px',
            maxWidth: '1000px'
          }}
        >
          DOG <span style={{ color: 'var(--text-muted)', fontWeight: 300 }}>vs</span> CAT
          <br />
          <span style={{ 
            background: 'linear-gradient(135deg, #FFFFFF 0%, #A8B0BE 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            IMAGE CLASSIFICATION
          </span>
        </h1>

        {/* Supporting Text */}
        <p 
          style={{
            fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            lineHeight: 1.6,
            marginBottom: '32px'
          }}
        >
          Teaching a convolutional neural network to distinguish visual patterns between dogs and cats.
        </p>

        {/* Action CTAs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '48px' }}>
          <a href="#classifier" className="btn btn-primary btn-lg">
            <Play size={18} />
            <span>TRY THE CLASSIFIER</span>
          </a>
          <a href="#architecture" className="btn btn-secondary btn-lg">
            <Layers size={18} />
            <span>EXPLORE THE MODEL</span>
          </a>
        </div>

        {/* Abstract Computer-Vision Visualization Canvas */}
        <div 
          className="tech-card"
          style={{
            padding: 0,
            height: '240px',
            position: 'relative',
            overflow: 'hidden',
            background: '#06070B',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8), 0 20px 40px rgba(0,0,0,0.5)'
          }}
        >
          <canvas 
            ref={canvasRef} 
            style={{ width: '100%', height: '100%', display: 'block' }}
          />

          {/* Technical HUD Overlay Labels */}
          <div style={{ position: 'absolute', top: '14px', left: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-dot active" />
            <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)', letterSpacing: '0.08em' }}>
              CONVOLUTIONAL SCANNING SIMULATOR
            </span>
          </div>

          <div style={{ position: 'absolute', bottom: '14px', right: '16px', display: 'flex', gap: '12px' }}>
            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              RECEPTIVE FIELD: 3 × 3
            </span>
            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              CHANNELS: 3 (RGB)
            </span>
          </div>
        </div>

        {/* Compact Metadata Row */}
        <div className="meta-row">
          <div className="meta-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Database size={13} color="var(--accent-blue)" />
              <span className="meta-label">DATASET</span>
            </div>
            <span className="meta-val">Kaggle — Dogs vs Cats</span>
          </div>

          <div className="meta-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={13} color="var(--accent-violet)" />
              <span className="meta-label">MODEL</span>
            </div>
            <span className="meta-val">CNN</span>
          </div>

          <div className="meta-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Binary size={13} color="var(--accent-cyan)" />
              <span className="meta-label">TASK</span>
            </div>
            <span className="meta-val">Binary Classification</span>
          </div>

          <div className="meta-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={13} color="#FFA24C" />
              <span className="meta-label">METRIC</span>
            </div>
            <span className="meta-val">Accuracy</span>
          </div>
        </div>
      </div>
    </section>
  );
}
