import React from 'react';
import { 
  Activity, 
  HelpCircle, 
  Plus, 
  ArrowUpRight, 
  MessageSquareQuote, 
  Trash2,
  Sliders,
  Sparkles
} from 'lucide-react';

export default function LabResultsView({ 
  labResults = [], 
  patientName = 'Arthur',
  onOpenAddLab,
  onDeleteLab,
  onOpenChatWithQuery 
}) {
  const getMeterPercent = (test) => {
    const val = parseFloat(test.value);
    if (isNaN(val)) return 50;

    if (test.testName.includes('Cholesterol') || test.testName.includes('LDL')) {
      return Math.min(100, Math.max(15, (val / 250) * 100));
    }
    if (test.testName.includes('HbA1c')) {
      return Math.min(100, Math.max(15, (val / 10) * 100));
    }
    if (test.testName.includes('eGFR')) {
      return Math.min(100, Math.max(15, (val / 120) * 100));
    }
    return 65;
  };

  return (
    <div className="sketch-card animate-fade-in">
      <div className="washi-tape blue" />

      {/* Header */}
      <div className="sketch-card-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="hand-note" style={{ fontSize: '1.4rem' }}>Lab Gauges</span>
            <h2 className="sketch-card-title">Laboratory Results & Markers</h2>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--ink-secondary)' }}>
            Plain-English benchmark gauges for <strong>{patientName}</strong>'s blood panels and tests
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button 
            className="sketch-action-btn primary"
            onClick={onOpenAddLab}
            title="Log a new test from your recent clinic paperwork"
          >
            <Plus size={16} />
            <span>Add My Lab Test</span>
          </button>

          <button 
            className="sketch-action-btn secondary"
            onClick={() => onOpenChatWithQuery(`Can you explain what my lab numbers say about my overall health?`)}
          >
            <MessageSquareQuote size={16} />
            <span>Ask Gemma</span>
          </button>
        </div>
      </div>

      {/* Grid of Lab Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {labResults.map((lab, index) => {
          const statusClass = lab.statusColor || (lab.status === 'Normal' || lab.status === 'Optimal' ? 'green' : 'amber');
          const meterWidth = getMeterPercent(lab);

          return (
            <div key={index} className="sketch-pill-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink-primary)' }}>
                    {lab.testName}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', marginTop: '2px' }}>
                    Target: <strong>{lab.referenceRange}</strong>
                  </div>
                </div>

                <div 
                  className="sketch-badge" 
                  style={{
                    background: statusClass === 'green' ? 'var(--highlighter-green)' : statusClass === 'amber' ? 'var(--highlighter-yellow)' : 'var(--highlighter-rose)',
                    color: statusClass === 'green' ? '#14532D' : statusClass === 'amber' ? '#78350F' : '#881337',
                    fontWeight: 900
                  }}
                >
                  {lab.status}
                </div>
              </div>

              {/* Big Value Display */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', margin: '0.35rem 0' }}>
                <span style={{ fontSize: '2.1rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--ink-primary)' }}>
                  {lab.value}
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink-muted)' }}>
                  {lab.unit}
                </span>
              </div>

              {/* Visual Benchmark Meter */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink-muted)', marginBottom: '4px' }}>
                  <span>Safe / Target</span>
                  <span>Elevated</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '10px',
                  background: 'rgba(0,0,0,0.08)',
                  border: '1.5px solid var(--ink-border)',
                  borderRadius: 'var(--wobble-pill)',
                  overflow: 'hidden'
                }}>
                  <div 
                    style={{
                      height: '100%',
                      width: `${meterWidth}%`,
                      background: statusClass === 'green' ? '#16A34A' : statusClass === 'amber' ? '#D97706' : '#E11D48',
                      transition: 'width 0.6s ease'
                    }}
                  />
                </div>
              </div>

              {/* Senior-Friendly Explanation */}
              <div style={{
                background: 'var(--bg-primary)',
                border: '1.5px dashed var(--ink-border)',
                borderRadius: 'var(--wobble-btn)',
                padding: '0.75rem',
                fontSize: '0.86rem',
                lineHeight: 1.5
              }}>
                <div style={{ fontWeight: 800, color: 'var(--ink-primary)', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <HelpCircle size={14} color="var(--sketch-teal)" />
                  <span>What this means for you:</span>
                </div>
                <p>{lab.seniorMeaning}</p>
              </div>

              {/* Quick Inquiry & Delete Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem' }}>
                <button
                  className="sketch-pill"
                  style={{
                    background: 'var(--highlighter-yellow)',
                    fontSize: '0.78rem',
                    padding: '0.3rem 0.75rem'
                  }}
                  onClick={() => onOpenChatWithQuery(`My ${lab.testName} is ${lab.value} ${lab.unit} (${lab.status}). Is this something I need to worry about, and what should I do?`)}
                >
                  <span>Ask Gemma about this</span>
                  <ArrowUpRight size={13} style={{ display: 'inline', marginLeft: '3px' }} />
                </button>

                {onDeleteLab && lab.testName && (
                  <button
                    onClick={() => onDeleteLab(lab.testName)}
                    style={{ color: 'var(--ink-muted)', cursor: 'pointer', padding: '2px' }}
                    title="Remove this test"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
