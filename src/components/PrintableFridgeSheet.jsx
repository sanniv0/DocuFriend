import React from 'react';
import { Printer, X, Heart, Phone, AlertTriangle } from 'lucide-react';

export default function PrintableFridgeSheet({ currentDoc, onClose }) {
  if (!currentDoc) return null;

  const timeSlots = [
    { name: 'Morning', label: '☀️ MORNING (With Breakfast)', color: '#F59E0B' },
    { name: 'Afternoon', label: '🌤️ MIDDAY / LUNCH (With Meal)', color: '#3B82F6' },
    { name: 'Evening', label: '🌅 EVENING (With Dinner)', color: '#F97316' },
    { name: 'Bedtime', label: '🌙 BEDTIME (Before Sleeping)', color: '#8B5CF6' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 120 }}>
      <div 
        className="fridge-sheet-paper animate-fade-in" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* 4 Corner Fridge Magnets */}
        <div className="fridge-magnet top-left">🧲</div>
        <div className="fridge-magnet top-right">🧲</div>
        <div className="fridge-magnet bottom-left">🧲</div>
        <div className="fridge-magnet bottom-right">🧲</div>

        {/* Screen Toolbar (hidden in print) */}
        <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px dashed var(--ink-border)', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="hand-note" style={{ fontSize: '1.4rem' }}>Fridge Magnet Guide</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Daily Care & Pill Sheet</h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--ink-secondary)' }}>
              Print and stick on the refrigerator with magnets for stress-free daily medication tracking
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="sketch-action-btn primary"
              onClick={() => window.print()}
            >
              <Printer size={16} />
              <span>Print Sheet</span>
            </button>
            <button onClick={onClose} style={{ padding: '6px', cursor: 'pointer', border: 'none', background: 'transparent' }}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Printable Refrigerator Sheet Content */}
        <div>
          {/* Header */}
          <div style={{ borderBottom: '3.5px double var(--ink-border)', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
                DAILY MEDICATION & CARE SHEET
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--sketch-teal)', marginTop: '2px' }}>
                Patient: {currentDoc.patientName} (Age: {currentDoc.patientAge})
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.86rem', color: 'var(--ink-secondary)' }}>
              <div><strong>Primary Doctor:</strong> {currentDoc.doctorName}</div>
              <div><strong>Updated Record:</strong> {currentDoc.date}</div>
            </div>
          </div>

          {/* Time Slots Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {timeSlots.map((slot) => {
              const meds = (currentDoc.medications || []).filter(m => 
                m.timeSlot?.toLowerCase() === slot.name.toLowerCase() ||
                m.frequency?.toLowerCase().includes(slot.name.toLowerCase())
              );

              return (
                <div key={slot.name} style={{ border: '2px solid var(--ink-border)', borderRadius: '12px', overflow: 'hidden', background: '#FFFFFF' }}>
                  <div style={{ background: 'var(--highlighter-yellow)', padding: '0.45rem 1rem', fontWeight: 900, fontSize: '0.95rem', color: 'var(--ink-primary)', borderBottom: '2px solid var(--ink-border)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{slot.label}</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>({meds.length} {meds.length === 1 ? 'pill' : 'pills'})</span>
                  </div>
                  <div style={{ padding: '0.85rem 1rem' }}>
                    {meds.length === 0 ? (
                      <div style={{ fontStyle: 'italic', color: 'var(--ink-muted)', fontSize: '0.86rem' }}>
                        No medications scheduled for this time.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {meds.map(med => (
                          <div key={med.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', borderBottom: '1.5px dashed var(--ink-border)', paddingBottom: '0.65rem' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--ink-primary)' }}>
                                [  ] {med.name} — <span style={{ color: 'var(--sketch-teal)' }}>{med.dosage}</span>
                              </div>
                              <div style={{ fontSize: '0.86rem', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                                <strong>Instructions:</strong> {med.instructions}
                              </div>
                              {med.foodWarning && (
                                <div style={{ fontSize: '0.82rem', color: '#B45309', fontWeight: 800, marginTop: '3px' }}>
                                  ⚠️ {med.foodWarning}
                                </div>
                              )}
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '0.82rem', color: 'var(--ink-muted)', minWidth: '130px' }}>
                              <div>{med.purpose}</div>
                              <div style={{ fontStyle: 'italic' }}>{med.pillShape}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Emergency / Doctor Contacts on the sheet */}
          <div style={{ marginTop: '1.5rem', border: '2.5px solid var(--ink-border)', borderRadius: '12px', padding: '0.85rem 1.25rem', background: 'var(--highlighter-rose)', display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: 700, flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <strong>Doctor Phone:</strong> (555) 234-8901
            </div>
            <div>
              <strong>Family / Caregiver:</strong> (555) 892-4412
            </div>
            <div>
              <strong>Pharmacy:</strong> (555) 431-7788
            </div>
            <div style={{ color: '#9F1239' }}>
              <strong>Emergency: Call 911</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
