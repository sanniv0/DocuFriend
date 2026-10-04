import React, { useState } from 'react';
import { 
  Pill, 
  Sun, 
  CloudSun, 
  Sunset, 
  Moon, 
  Check, 
  AlertTriangle, 
  Printer, 
  Plus, 
  Trash2,
  CalendarCheck,
  Sparkles,
  Heart
} from 'lucide-react';

export default function MedicationSchedule({ 
  medications = [], 
  patientName = 'Arthur',
  onPrintFridgeSheet,
  onOpenAddMed,
  onDeleteMed,
  onOpenChatWithQuery
}) {
  const [takenMeds, setTakenMeds] = useState(() => {
    try {
      const saved = localStorage.getItem(`taken_meds_${patientName}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleTaken = (medId) => {
    setTakenMeds(prev => {
      const updated = { ...prev, [medId]: !prev[medId] };
      try {
        localStorage.setItem(`taken_meds_${patientName}`, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const timeSlots = [
    { name: 'Morning', icon: Sun, color: '#F59E0B', label: '☀️ Morning (With Breakfast)' },
    { name: 'Afternoon', icon: CloudSun, color: '#3B82F6', label: '🌤️ Midday / Lunch' },
    { name: 'Evening', icon: Sunset, color: '#F97316', label: '🌅 Evening (With Dinner)' },
    { name: 'Bedtime', icon: Moon, color: '#8B5CF6', label: '🌙 Bedtime (Before Sleep)' }
  ];

  const totalCount = medications.length;
  const takenCount = Object.values(takenMeds).filter(Boolean).length;
  const progressPercent = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  return (
    <div className="sketch-card animate-fade-in">
      <div className="washi-tape" />

      {/* Header */}
      <div className="sketch-card-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="hand-note" style={{ fontSize: '1.4rem' }}>Daily Routine</span>
            <h2 className="sketch-card-title">Prescription & Pill Schedule</h2>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--ink-secondary)' }}>
            Personalized timing rules, food interactions, and daily checkboxes for <strong>{patientName}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* User Add Custom Med Button */}
          <button 
            className="sketch-action-btn primary"
            onClick={onOpenAddMed}
            title="Add your own medication or vitamin"
          >
            <Plus size={16} />
            <span>Add My Medication</span>
          </button>

          {/* Print Fridge Sheet Button */}
          <button 
            className="sketch-action-btn yellow"
            onClick={onPrintFridgeSheet}
            title="Open printable refrigerator whiteboard sheet"
          >
            <Printer size={16} />
            <span>Print Fridge Guide</span>
          </button>
        </div>
      </div>

      {/* Hand-Drawn Daily Pill Tracker */}
      <div className="postit-note green" style={{ transform: 'rotate(-0.5deg)', margin: '0.25rem 0' }}>
        <div className="pushpin" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.05rem', color: '#14532D' }}>
            <CalendarCheck size={20} />
            <span>Today's Pill Checklist: {takenCount} of {totalCount} Taken</span>
          </div>
          <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1.15rem', color: '#166534', fontWeight: 800 }}>
            {progressPercent}% Complete
          </span>
        </div>

        <div style={{
          width: '100%',
          height: '14px',
          background: 'rgba(0,0,0,0.12)',
          border: '2px solid var(--ink-border)',
          borderRadius: 'var(--wobble-pill)',
          overflow: 'hidden',
          padding: '1px'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: progressPercent === 100 ? '#16A34A' : 'linear-gradient(90deg, #F59E0B, #10B981)',
            borderRadius: 'var(--wobble-pill)',
            transition: 'width 0.4s ease'
          }} />
        </div>

        {progressPercent === 100 && (
          <div style={{
            fontFamily: 'var(--font-hand)',
            fontSize: '1.3rem',
            color: '#14532D',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '2px'
          }}>
            <Sparkles size={18} />
            <span>Great job! All pills taken for today. Have a peaceful rest!</span>
          </div>
        )}
      </div>

      {/* Time Slots Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '0.5rem' }}>
        {timeSlots.map((slot) => {
          const slotMeds = medications.filter(m => 
            m.timeSlot?.toLowerCase() === slot.name.toLowerCase() ||
            m.frequency?.toLowerCase().includes(slot.name.toLowerCase())
          );

          if (slotMeds.length === 0) return null;

          const SlotIcon = slot.icon;

          return (
            <div key={slot.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span className="marker-label" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink-primary)' }}>
                  {slot.label}
                </span>
                <span className="sketch-badge" style={{ background: 'var(--bg-secondary)', fontSize: '0.75rem' }}>
                  {slotMeds.length} {slotMeds.length === 1 ? 'Pill' : 'Pills'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                {slotMeds.map((med) => {
                  const isTaken = !!takenMeds[med.id];

                  return (
                    <div 
                      key={med.id} 
                      className={`sketch-pill-card ${isTaken ? 'taken' : ''}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                        <div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--ink-primary)' }}>
                            {med.name}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
                            {med.brand} • {med.pillShape || 'Tablet'}
                          </div>
                        </div>

                        <div className="sketch-badge" style={{ background: 'var(--highlighter-yellow)', fontWeight: 800 }}>
                          {med.dosage}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.9rem', color: 'var(--ink-secondary)' }}>
                        <strong>🎯 Purpose:</strong> {med.purpose}
                      </div>

                      <div style={{
                        background: 'var(--bg-primary)',
                        border: '1.5px dashed var(--ink-border)',
                        borderRadius: 'var(--wobble-btn)',
                        padding: '0.65rem 0.85rem',
                        fontSize: '0.86rem',
                        lineHeight: 1.45
                      }}>
                        <strong>How to take:</strong> {med.instructions}
                      </div>

                      {med.foodWarning && (
                        <div style={{
                          background: 'var(--highlighter-orange)',
                          border: '2px solid #C2410C',
                          borderRadius: 'var(--wobble-tag)',
                          padding: '0.45rem 0.75rem',
                          fontSize: '0.84rem',
                          fontWeight: 800,
                          color: '#7C2D12',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}>
                          <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                          <span>{med.foodWarning}</span>
                        </div>
                      )}

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '0.5rem',
                        borderTop: '2px dashed var(--ink-border)',
                        marginTop: 'auto'
                      }}>
                        {/* Custom Hand-Drawn Checkbox */}
                        <div 
                          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
                          onClick={() => toggleTaken(med.id)}
                        >
                          <div className={`sketch-checkbox ${isTaken ? 'checked' : ''}`}>
                            {isTaken && <Check size={18} strokeWidth={3} />}
                          </div>
                          <span style={{ fontWeight: 800, fontSize: '0.88rem' }}>
                            {isTaken ? 'Taken Today ✓' : 'Mark as Taken'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <button
                            className="sketch-pill"
                            style={{ fontSize: '0.76rem', padding: '0.2rem 0.6rem' }}
                            onClick={() => onOpenChatWithQuery(`Tell me in simple words about ${med.name} (${med.dosage}): what should I remember when taking it?`)}
                            title="Ask Gemma about this pill"
                          >
                            Ask Gemma
                          </button>

                          {onDeleteMed && med.id.startsWith('custom') && (
                            <button
                              onClick={() => onDeleteMed(med.id)}
                              style={{ color: 'var(--sketch-coral)', padding: '2px', cursor: 'pointer' }}
                              title="Delete this custom pill"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
