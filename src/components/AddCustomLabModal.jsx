import React, { useState } from 'react';
import { X, Activity, Plus } from 'lucide-react';

export default function AddCustomLabModal({ isOpen, onClose, onAddLab }) {
  const [testName, setTestName] = useState('');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('mg/dL');
  const [referenceRange, setReferenceRange] = useState('< 100');
  const [status, setStatus] = useState('Normal');
  const [seniorMeaning, setSeniorMeaning] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!testName.trim() || !value.trim()) return;

    let statusColor = 'green';
    if (status === 'High' || status === 'Elevated') statusColor = 'amber';
    if (status === 'Critical' || status === 'Low') statusColor = 'red';

    const newLab = {
      testName: testName.trim(),
      value: value.trim(),
      unit: unit.trim(),
      referenceRange: referenceRange.trim(),
      status,
      statusColor,
      seniorMeaning: seniorMeaning.trim() || 'Custom test added to monitor personal health wellness.',
      whyTested: 'Patient custom tracking'
    };

    onAddLab(newLab);
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
        <div className="washi-tape green" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px dashed var(--ink-border)', paddingBottom: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="hand-note" style={{ fontSize: '1.3rem' }}>My Tests</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Add Personal Lab Test</h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--ink-secondary)' }}>
              Log a recent blood draw, clinic test, or home meter reading
            </p>
          </div>
          <button onClick={onClose} style={{ cursor: 'pointer', color: 'var(--ink-muted)' }}>
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                Test Name *
              </label>
              <input 
                type="text" 
                className="jargon-input" 
                placeholder="e.g. Vitamin D (25-OH) or Thyroid TSH"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                Your Value *
              </label>
              <input 
                type="text" 
                className="jargon-input" 
                placeholder="e.g. 32"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                Unit
              </label>
              <input 
                type="text" 
                className="jargon-input" 
                placeholder="e.g. ng/mL or mg/dL"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                Target / Ref Range
              </label>
              <input 
                type="text" 
                className="jargon-input" 
                placeholder="e.g. 30 - 100"
                value={referenceRange}
                onChange={(e) => setReferenceRange(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                Status
              </label>
              <select 
                className="jargon-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ background: 'var(--bg-primary)' }}
              >
                <option value="Normal">Normal 🟢</option>
                <option value="Optimal">Optimal 🟢</option>
                <option value="Elevated">Elevated 🟡</option>
                <option value="High">High 🟡</option>
                <option value="Low">Low 🔴</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
              Plain English Meaning / Notes
            </label>
            <textarea 
              className="jargon-input" 
              rows={2}
              placeholder="e.g. Essential for strong bones and natural immunity."
              value={seniorMeaning}
              onChange={(e) => setSeniorMeaning(e.target.value)}
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
              disabled={!testName.trim() || !value.trim()}
            >
              <Plus size={16} />
              <span>Add to Lab Results</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
