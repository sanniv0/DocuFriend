import React from 'react';
import { FileText, PlusCircle } from 'lucide-react';

export default function DocSelectorRibbon({ 
  records, 
  activeDocId, 
  onSelectDoc, 
  onOpenUpload 
}) {
  return (
    <div className="sketch-tab-ribbon">
      {records.map((rec) => {
        const isActive = rec.id === activeDocId;
        return (
          <div
            key={rec.id}
            className={`sketch-patient-tab ${isActive ? 'active' : ''}`}
            onClick={() => onSelectDoc(rec.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectDoc(rec.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={17} color={isActive ? 'var(--sketch-teal)' : 'var(--ink-muted)'} />
                <span style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--ink-primary)' }}>
                  {rec.patientName}
                </span>
              </div>
              <span 
                className="sketch-badge" 
                style={{
                  background: rec.statusBadge?.includes('Action') ? 'var(--highlighter-yellow)' : 'var(--highlighter-green)',
                  fontSize: '0.72rem',
                  padding: '0.15rem 0.5rem'
                }}
              >
                {rec.statusBadge || 'Active'}
              </span>
            </div>

            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--ink-secondary)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {rec.title}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--sketch-teal)', fontWeight: 800 }}>
                {rec.doctorName?.split(',')[0]}
              </span>
              <span style={{ color: 'var(--ink-muted)' }}>
                {rec.date}
              </span>
            </div>
          </div>
        );
      })}

      {/* Quick Add Button */}
      <button 
        className="sketch-patient-tab"
        style={{
          borderStyle: 'dashed',
          background: 'transparent',
          minWidth: '180px',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          color: 'var(--sketch-teal)'
        }}
        onClick={onOpenUpload}
        title="Upload PDF or doctor note"
      >
        <PlusCircle size={24} />
        <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>+ Add Record</span>
      </button>
    </div>
  );
}
