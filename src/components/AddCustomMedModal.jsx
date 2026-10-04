import React, { useState } from 'react';
import { X, Pill, Plus, Sparkles, AlertTriangle } from 'lucide-react';

export default function AddCustomMedModal({ isOpen, onClose, onAddMed }) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timeSlot, setTimeSlot] = useState('Morning');
  const [purpose, setPurpose] = useState('');
  const [instructions, setInstructions] = useState('');
  const [foodWarning, setFoodWarning] = useState('');
  const [pillShape, setPillShape] = useState('Round white tablet');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMed = {
      id: `custom-med-${Date.now()}`,
      name: name.trim(),
      brand: 'My Prescription / Supplement',
      dosage: dosage.trim() || 'As directed',
      frequency: `Once daily in the ${timeSlot.toLowerCase()}`,
      timeSlot,
      purpose: purpose.trim() || 'Health management',
      instructions: instructions.trim() || 'Take with a glass of water as advised by doctor.',
      foodWarning: foodWarning.trim() || '',
      remainingPills: 30,
      color: timeSlot === 'Morning' ? '#3B82F6' : timeSlot === 'Bedtime' ? '#8B5CF6' : '#10B981',
      pillShape
    };

    onAddMed(newMed);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 110 }}>
      <div 
        className="modal-content animate-fade-in" 
        onClick={(e) => e.stopPropagation()}
        style={{
          border: '3px solid var(--ink-border)',
          borderRadius: 'var(--wobble-card)',
          boxShadow: 'var(--shadow-sketch-lg)',
          position: 'relative'
        }}
      >
        <div className="washi-tape blue" />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px dashed var(--ink-border)', paddingBottom: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="hand-note" style={{ fontSize: '1.3rem' }}>Personalize</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Add My Own Prescription</h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--ink-secondary)' }}>
              Add a real pill, vitamin, or supplement to your personal schedule
            </p>
          </div>
          <button onClick={onClose} style={{ cursor: 'pointer', color: 'var(--ink-muted)' }}>
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                Medication Name *
              </label>
              <input 
                type="text" 
                className="jargon-input" 
                placeholder="e.g. Amlodipine or Vitamin D3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                Dosage
              </label>
              <input 
                type="text" 
                className="jargon-input" 
                placeholder="e.g. 5 mg"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                Time of Day
              </label>
              <select 
                className="jargon-input" 
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                style={{ background: 'var(--bg-primary)' }}
              >
                <option value="Morning">☀️ Morning (With Breakfast)</option>
                <option value="Afternoon">🌤️ Midday / Afternoon (With Lunch)</option>
                <option value="Evening">🌅 Evening (With Dinner)</option>
                <option value="Bedtime">🌙 Bedtime (Before Sleep)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                Pill Shape / Appearance
              </label>
              <input 
                type="text" 
                className="jargon-input" 
                placeholder="e.g. Small yellow round tablet"
                value={pillShape}
                onChange={(e) => setPillShape(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
              What is this for? (Purpose)
            </label>
            <input 
              type="text" 
              className="jargon-input" 
              placeholder="e.g. Relaxes blood vessels and keeps blood pressure steady"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
              Special Senior Instructions
            </label>
            <textarea 
              className="jargon-input" 
              rows={2}
              placeholder="e.g. Take right after morning oatmeal with a tall glass of water."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: 'var(--sketch-coral)' }}>
              Food or Interaction Warnings (Optional)
            </label>
            <input 
              type="text" 
              className="jargon-input" 
              placeholder="e.g. Do not eat grapefruit; avoid alcohol"
              value={foodWarning}
              onChange={(e) => setFoodWarning(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button 
              type="button" 
              className="sketch-action-btn secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="sketch-action-btn primary"
              disabled={!name.trim()}
            >
              <Plus size={16} />
              <span>Add to Schedule</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
