import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  HelpCircle, 
  PhoneCall, 
  User, 
  Plus, 
  Trash2, 
  Save, 
  CheckSquare, 
  Square,
  Building2,
  FileEdit,
  Printer
} from 'lucide-react';

export default function DoctorVisitPrep({ currentDoc, onOpenChatWithQuery }) {
  const [questions, setQuestions] = useState([
    { id: 'q1', text: `Since my ${currentDoc?.labResults?.[0]?.testName || 'cholesterol'} was adjusted, how soon should we repeat the lab test?`, asked: false },
    { id: 'q2', text: `Are there any new food, supplement, or herbal interactions with my current pill schedule?`, asked: false },
    { id: 'q3', text: `If I experience any mild dizziness or fatigue, what is the best time of day to reach your clinic nurse?`, asked: false },
    { id: 'q4', text: `Can we review my refill numbers to make sure I don't run out during holidays or travel?`, asked: false }
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');

  // Doctor visit notes saved locally in localStorage
  const storageKey = `docufriend_notes_${currentDoc?.id || 'default'}`;
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem(storageKey) || `Visit with ${currentDoc?.doctorName || 'Doctor'}:\n- Discussed morning blood pressure logs\n- Doctor emphasized daily walking and hydration\n- Next follow-up in 3 months`;
  });
  const [savedNotification, setSavedNotification] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setNotes(saved);
    }
  }, [currentDoc?.id]);

  const handleSaveNotes = () => {
    localStorage.setItem(storageKey, notes);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const toggleQuestion = (id) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, asked: !q.asked } : q));
  };

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;
    setQuestions(prev => [
      ...prev,
      { id: `q-${Date.now()}`, text: newQuestionText.trim(), asked: false }
    ]);
    setNewQuestionText('');
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  return (
    <div className="care-card animate-fade-in">
      <div className="card-header">
        <div className="card-title-wrap">
          <div className="card-icon" style={{ background: 'var(--amber-50)', color: 'var(--amber-600)' }}>
            <ClipboardCheck size={22} />
          </div>
          <div>
            <h2 className="card-title">Doctor Visit Prep & Questions</h2>
            <p className="card-subtitle">
              Take the stress out of appointments for {currentDoc?.patientName || 'you'}
            </p>
          </div>
        </div>

        <button 
          className="action-btn secondary"
          onClick={() => window.print()}
          title="Print checklist to bring to your appointment"
        >
          <Printer size={16} />
          <span>Print Checklist</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Left Column: Questions Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--teal-800)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <HelpCircle size={18} />
            <span>Questions to Ask Your Doctor</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {questions.map((q) => (
              <div 
                key={q.id}
                style={{
                  background: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  opacity: q.asked ? 0.6 : 1
                }}
              >
                <div 
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer', flex: 1 }}
                  onClick={() => toggleQuestion(q.id)}
                >
                  <div style={{ marginTop: '2px', color: q.asked ? 'var(--sage-600)' : 'var(--text-muted)' }}>
                    {q.asked ? <CheckSquare size={18} /> : <Square size={18} />}
                  </div>
                  <span style={{ fontSize: '0.92rem', textDecoration: q.asked ? 'line-through' : 'none' }}>
                    {q.text}
                  </span>
                </div>

                <button 
                  onClick={() => handleDeleteQuestion(q.id)}
                  style={{ color: 'var(--text-muted)', padding: '2px' }}
                  title="Remove question"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Question Input */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input 
              type="text" 
              className="chat-input-field" 
              placeholder="Add your own question..."
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddQuestion()}
            />
            <button 
              className="action-btn primary"
              style={{ padding: '0.5rem 1rem' }}
              onClick={handleAddQuestion}
              title="Add question"
            >
              <Plus size={16} />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Right Column: Visit Notes Pad & Contacts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Notes Pad */}
          <div style={{
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileEdit size={16} color="var(--teal-700)" />
                <span>Doctor's Visit Notes (Saves on this Device)</span>
              </div>
              <button 
                className="action-btn primary"
                style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                onClick={handleSaveNotes}
              >
                <Save size={13} />
                <span>{savedNotification ? 'Saved ✓' : 'Save Notes'}</span>
              </button>
            </div>

            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-strong)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                lineHeight: 1.5,
                fontSize: '0.9rem',
                resize: 'vertical'
              }}
              placeholder="Jot down what the doctor told you, new changes, or next appointments..."
            />
          </div>

          {/* Emergency & Care Team Contacts */}
          <div style={{
            background: 'var(--coral-50)',
            border: '1px solid var(--coral-100)',
            borderRadius: 'var(--radius-md)',
            padding: '1.1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--coral-600)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <PhoneCall size={16} />
              <span>Care Team & Emergency Contacts</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.86rem' }}>
              <div><strong>Physician:</strong> {currentDoc?.doctorName || 'Dr. Sarah Chen'} — (555) 234-8901</div>
              <div><strong>Clinic:</strong> {currentDoc?.clinicName || 'Metro Heart & Vascular'} (Mon-Fri 8am-5pm)</div>
              <div><strong>Primary Caregiver / Family:</strong> Sarah Miller (Daughter) — (555) 892-4412</div>
              <div><strong>Preferred Pharmacy:</strong> Corner Rx Pharmacy — (555) 431-7788</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
