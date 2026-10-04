import React from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Cpu, 
  Sun, 
  Moon, 
  FileUp,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';

export default function Navbar({ 
  ollamaStatus, 
  fontScale, 
  setFontScale, 
  theme, 
  setTheme, 
  onOpenUpload,
  isAudioPlaying,
  onStopAudio
}) {
  const fontSizes = [
    { label: 'Aa', scale: 1, title: 'Standard Text' },
    { label: 'Aa+', scale: 1.14, title: 'Large Text for Seniors' },
    { label: 'Aa++', scale: 1.28, title: 'Extra Large Comfort' }
  ];

  return (
    <header className="top-nav">
      <div className="nav-inner">
        {/* Brand */}
        <div className="nav-brand">
          <div className="brand-icon-wrap">
            <HeartHandshake size={28} strokeWidth={2.4} />
          </div>
          <div className="brand-text">
            <h1>DocuFriend</h1>
            <span className="brand-subtitle">Empathetic Offline Medical Companion</span>
          </div>
        </div>

        {/* Center Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <div className="sketch-badge offline" title="Zero data leaves your computer. 100% private offline processing.">
            <ShieldCheck size={16} />
            <span>100% Private Offline</span>
          </div>

          <div 
            className="sketch-badge model"
            title={ollamaStatus?.online ? `Connected to local ${ollamaStatus.activeModel}` : 'Ollama is offline or checking connection'}
          >
            <div className={`pulse-dot ${ollamaStatus?.online ? '' : 'warning'}`} />
            <Cpu size={15} />
            <span>{ollamaStatus?.online ? `Gemma 2:2B (Active)` : 'Local AI Ready'}</span>
          </div>

          {isAudioPlaying && (
            <button 
              className="sketch-badge coral" 
              onClick={onStopAudio}
              style={{ cursor: 'pointer' }}
              title="Click to pause voice reading"
            >
              <VolumeX size={15} />
              <span>Stop Reading</span>
            </button>
          )}
        </div>

        {/* Right Accessibility & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Senior Font Sizing */}
          <div className="sketch-btn-group" title="Adjust text size for easy reading">
            <span style={{ fontSize: '0.78rem', fontWeight: 800, paddingLeft: '6px', color: 'var(--ink-muted)' }}>
              Size:
            </span>
            {fontSizes.map((f) => (
              <button
                key={f.scale}
                className={`sketch-pill ${Math.abs(fontScale - f.scale) < 0.05 ? 'active' : ''}`}
                onClick={() => setFontScale(f.scale)}
                title={f.title}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Theme Selector */}
          <div className="sketch-btn-group" title="Switch display appearance">
            <button
              className={`sketch-pill ${theme === 'warm' ? 'active' : ''}`}
              onClick={() => setTheme('warm')}
              title="Warm Sketchbook Theme"
            >
              <Sun size={15} />
            </button>
            <button
              className={`sketch-pill ${theme === 'night-care' ? 'active' : ''}`}
              onClick={() => setTheme('night-care')}
              title="Night Care Theme"
            >
              <Moon size={15} />
            </button>
          </div>

          {/* Upload Button */}
          <button 
            className="sketch-action-btn primary"
            onClick={onOpenUpload}
            title="Upload a new PDF medical report or prescription"
          >
            <FileUp size={16} />
            <span>Add Record</span>
          </button>
        </div>
      </div>
    </header>
  );
}
