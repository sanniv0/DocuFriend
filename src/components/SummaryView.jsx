import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertTriangle, 
  Stethoscope, 
  RotateCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { summarizeMedicalDoc } from '../services/ollamaService';

export default function SummaryView({ 
  currentDoc, 
  isAudioPlaying, 
  onStartAudio, 
  onStopAudio,
  onOpenChatWithQuery
}) {
  const [showRawText, setShowRawText] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [liveGemmaSummary, setLiveGemmaSummary] = useState(null);

  if (!currentDoc) return null;

  const summaryData = liveGemmaSummary || currentDoc.summary;

  const handleReadAloud = () => {
    if (isAudioPlaying) {
      onStopAudio();
    } else {
      const fullNarration = `
        Medical summary for ${currentDoc.patientName}. 
        What this report means: ${summaryData?.plainEnglish || ''}. 
        Good news: ${(summaryData?.goodNews || []).join('. ')}. 
        Things to watch: ${(summaryData?.watchOuts || []).join('. ')}. 
        Doctor's action plan: ${(summaryData?.doctorActions || []).join('. ')}.
      `;
      onStartAudio(fullNarration);
    }
  };

  const handleReSummarizeWithGemma = async () => {
    setIsRegenerating(true);
    try {
      const result = await summarizeMedicalDoc(currentDoc.fullRawText, currentDoc.patientName);
      if (result?.text) {
        setLiveGemmaSummary({
          plainEnglish: result.text,
          goodNews: currentDoc.summary?.goodNews || [],
          watchOuts: currentDoc.summary?.watchOuts || [],
          doctorActions: currentDoc.summary?.doctorActions || []
        });
      }
    } catch (err) {
      console.error('Failed to regenerate summary:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="sketch-card animate-fade-in">
      <div className="washi-tape" />

      {/* Header */}
      <div className="sketch-card-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="hand-note" style={{ fontSize: '1.4rem' }}>Plain English</span>
            <h2 className="sketch-card-title">Medical Record Translation</h2>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--ink-secondary)' }}>
            Jargon-free clinical breakdown for <strong>{currentDoc.patientName}</strong> & family caregivers
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Read Aloud Button */}
          <button 
            className={`sketch-action-btn ${isAudioPlaying ? 'coral' : 'secondary'}`}
            onClick={handleReadAloud}
            title={isAudioPlaying ? 'Stop listening' : 'Listen to this summary read aloud in calm voice'}
          >
            {isAudioPlaying ? <VolumeX size={17} /> : <Volume2 size={17} />}
            <span>{isAudioPlaying ? 'Stop Reading' : 'Read Aloud'}</span>
          </button>

          {/* Gemma Deep Dive Button */}
          <button 
            className="sketch-action-btn yellow"
            onClick={handleReSummarizeWithGemma}
            disabled={isRegenerating}
            title="Ask local Gemma 2:2B to generate a fresh clinical breakdown"
          >
            <RotateCw size={15} className={isRegenerating ? 'animate-spin' : ''} />
            <span>{isRegenerating ? 'Gemma Thinking...' : 'Deep Dive (Gemma)'}</span>
          </button>
        </div>
      </div>

      {/* Audio Waveform Banner when speaking */}
      {isAudioPlaying && (
        <div className="sketch-audio-bar animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '0.9rem' }}>
            <Volume2 size={20} />
            <span>Narrating summary in calm senior pace...</span>
          </div>
          <div className="soundwave">
            <div className="soundwave-bar" style={{ background: 'var(--ink-primary)' }} />
            <div className="soundwave-bar" style={{ background: 'var(--ink-primary)' }} />
            <div className="soundwave-bar" style={{ background: 'var(--ink-primary)' }} />
            <div className="soundwave-bar" style={{ background: 'var(--ink-primary)' }} />
            <div className="soundwave-bar" style={{ background: 'var(--ink-primary)' }} />
          </div>
        </div>
      )}

      {/* Core Plain English Post-It Callout */}
      <div className="postit-note" style={{ transform: 'rotate(-0.8deg)', margin: '0.5rem 0' }}>
        <div className="pushpin" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 900, color: '#854D0E', fontSize: '1.05rem' }}>
          <Sparkles size={18} />
          <span>WHAT THIS REPORT MEANS FOR YOU IN EVERYDAY WORDS:</span>
        </div>
        <p style={{ fontSize: '1.15rem', lineHeight: 1.7, color: '#1E293B', fontWeight: 600 }}>
          {summaryData?.plainEnglish}
        </p>
      </div>

      {/* 3-Pillar Triage Highlights (Post-It notes layout) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Pillar 1: Good News */}
        <div className="postit-note green">
          <div className="pushpin" style={{ background: '#16A34A', borderColor: '#14532D' }} />
          <div style={{ fontWeight: 900, fontSize: '1rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            <span>Good News & Stable Findings</span>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '4px' }}>
            {(summaryData?.goodNews || []).map((item, idx) => (
              <li key={idx} style={{ fontSize: '0.94rem', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ marginTop: '5px', width: '6px', height: '6px', borderRadius: '50%', background: '#166534', flexShrink: 0 }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pillar 2: Things to Watch */}
        <div className="postit-note" style={{ background: '#FEF08A' }}>
          <div className="pushpin" style={{ background: '#D97706', borderColor: '#78350F' }} />
          <div style={{ fontWeight: 900, fontSize: '1rem', color: '#92400E', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} />
            <span>Things to Keep an Eye On</span>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '4px' }}>
            {(summaryData?.watchOuts || []).map((item, idx) => (
              <li key={idx} style={{ fontSize: '0.94rem', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ marginTop: '5px', width: '6px', height: '6px', borderRadius: '50%', background: '#92400E', flexShrink: 0 }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pillar 3: Doctor's Action Plan */}
        <div className="postit-note blue">
          <div className="pushpin" style={{ background: '#2563EB', borderColor: '#1E3A8A' }} />
          <div style={{ fontWeight: 900, fontSize: '1rem', color: '#1E40AF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Stethoscope size={18} />
            <span>Doctor's Action Plan</span>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '4px' }}>
            {(summaryData?.doctorActions || []).map((item, idx) => (
              <li key={idx} style={{ fontSize: '0.94rem', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ marginTop: '5px', width: '6px', height: '6px', borderRadius: '50%', background: '#1E40AF', flexShrink: 0 }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.85rem',
        borderTop: '2px dashed var(--ink-border)',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <button 
          className="sketch-pill"
          style={{ background: 'var(--bg-secondary)', padding: '0.4rem 0.85rem' }}
          onClick={() => setShowRawText(!showRawText)}
        >
          {showRawText ? <EyeOff size={15} /> : <Eye size={15} />}
          <span>{showRawText ? 'Hide Clinical Note' : 'View Original Doctor Text'}</span>
        </button>

        <button 
          className="sketch-pill"
          style={{ background: 'var(--highlighter-yellow)', fontWeight: 800 }}
          onClick={() => onOpenChatWithQuery(`Can you explain the summary of ${currentDoc.patientName}'s report in more detail?`)}
        >
          <span>💬 Ask Gemma about this report</span>
        </button>
      </div>

      {/* Raw Doctor Notes Expandable Area */}
      {showRawText && (
        <div style={{
          background: 'var(--bg-card-subtle)',
          border: '2px solid var(--ink-border)',
          borderRadius: 'var(--wobble-card)',
          padding: '1.25rem',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.6',
          color: 'var(--ink-secondary)',
          maxHeight: '320px',
          overflowY: 'auto'
        }}>
          {currentDoc.fullRawText || 'No raw text available for this record.'}
        </div>
      )}
    </div>
  );
}
