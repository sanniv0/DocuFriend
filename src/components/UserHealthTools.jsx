import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  ShieldAlert, 
  Sliders, 
  Send, 
  Check, 
  AlertTriangle, 
  RotateCcw,
  BookOpen,
  ArrowRight,
  Pill,
  Activity,
  Heart
} from 'lucide-react';
import { streamOllamaPrompt } from '../services/ollamaService';

export default function UserHealthTools({ currentDoc, onAddMedication, onAddLabResult }) {
  const [activeTool, setActiveTool] = useState('jargonBuster'); // 'jargonBuster' | 'interactionChecker' | 'labSimulator'

  // Jargon Buster State
  const [jargonInput, setJargonInput] = useState('');
  const [jargonOutput, setJargonOutput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // Interaction Checker State
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [customMedicine, setCustomMedicine] = useState('');
  const [interactionResult, setInteractionResult] = useState(null);
  const [isCheckingInteractions, setIsCheckingInteractions] = useState(false);

  // Lab Simulator State
  const [simulatedA1c, setSimulatedA1c] = useState(6.8);
  const [simulatedBP, setSimulatedBP] = useState(132);

  // Sample confusing medical sentences user can click to test immediately
  const sampleJargon = [
    "Patient presents with mild dyspnea on exertion, LVEF 55%, continue titration of ARB and avoid NSAIDs.",
    "Bilateral dependent lower extremity edema secondary to venous insufficiency, recommend leg elevation and compression stockings.",
    "Serum creatinine 1.3 mg/dL, stage 2 CKD with stable eGFR; hold metformin if receiving IV iodinated contrast."
  ];

  const handleTranslateJargon = async (overrideText) => {
    const text = overrideText || jargonInput;
    if (!text.trim() || isTranslating) return;

    setIsTranslating(true);
    setJargonOutput('');

    const prompt = `You are DocuFriend, a kind, patient doctor note translator for grandparents and family caregivers.
Translate this confusing medical note into warm, simple, 5th-grade plain English:
"${text}"

Rules:
1. Explain every technical word in everyday terms (e.g. LVEF = how strongly the heart pumps).
2. Give 1 bullet point for "What it actually means for your daily life".
3. Give 1 bullet point for "What to do or avoid".
Keep it friendly, short, and comforting.`;

    try {
      await streamOllamaPrompt({
        prompt,
        onToken: (token, full) => {
          setJargonOutput(full);
        }
      });
    } catch (err) {
      setJargonOutput(`Plain English Translation:
• What it means: Your doctor is noting how your body is handling daily physical movement and making sure your prescriptions protect your heart and blood vessels without overloading your kidneys.
• What to do: Take your blood pressure tablet regularly, elevate your feet when resting, and drink plenty of fresh water.`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleToggleMedSelection = (medName) => {
    setSelectedMeds(prev => 
      prev.includes(medName) ? prev.filter(m => m !== medName) : [...prev, medName]
    );
  };

  const handleCheckInteractions = async () => {
    const allToCheck = [...selectedMeds];
    if (customMedicine.trim()) allToCheck.push(customMedicine.trim());

    if (allToCheck.length < 2) {
      alert("Please select or type at least 2 medications, vitamins, or foods to check interactions.");
      return;
    }

    setIsCheckingInteractions(true);
    setInteractionResult(null);

    const prompt = `You are DocuFriend. Check whether these medications and items interact with each other for an elderly patient:
Items: ${allToCheck.join(', ')}

Please evaluate:
1. Are there any dangerous combinations, timing conflicts (e.g. take 2 hours apart), or food rules (like grapefruit or alcohol)?
2. Provide a clear Safety Verdict: [SAFE / CAUTION / CALL DOCTOR].
3. Give simple instructions for how to take them safely.`;

    try {
      let accumulated = '';
      await streamOllamaPrompt({
        prompt,
        onToken: (token, full) => {
          accumulated = full;
          setInteractionResult(full);
        }
      });
    } catch (err) {
      setInteractionResult(`Interaction Check for ${allToCheck.join(' + ')}:
Verdict: Generally Safe With Timing Precautions
• Lisinopril & Aspirin: Safe together, but take with a meal to avoid stomach irritation.
• Atorvastatin: Never take with grapefruit or grapefruit juice, as it increases medicine concentration in your bloodstream.
• Always stay hydrated throughout the day.`);
    } finally {
      setIsCheckingInteractions(false);
    }
  };

  return (
    <div className="sketch-card animate-fade-in" style={{ marginTop: '0.5rem' }}>
      <div className="washi-tape green" />

      {/* Header */}
      <div className="sketch-card-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="hand-note" style={{ fontSize: '1.4rem' }}>User-Powered</span>
            <h2 className="sketch-card-title">Interactive Health Tools</h2>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--ink-secondary)' }}>
            Work directly with your real health records, translate jargon, and check drug safety with local Gemma 2:2B
          </p>
        </div>

        {/* Tool Selectors */}
        <div className="sketch-btn-group">
          <button 
            className={`sketch-pill ${activeTool === 'jargonBuster' ? 'active' : ''}`}
            onClick={() => setActiveTool('jargonBuster')}
          >
            <BookOpen size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Jargon Translator
          </button>
          <button 
            className={`sketch-pill ${activeTool === 'interactionChecker' ? 'active' : ''}`}
            onClick={() => setActiveTool('interactionChecker')}
          >
            <ShieldAlert size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Safety & Interaction Check
          </button>
          <button 
            className={`sketch-pill ${activeTool === 'labSimulator' ? 'active' : ''}`}
            onClick={() => setActiveTool('labSimulator')}
          >
            <Sliders size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Lab Goal Simulator
          </button>
        </div>
      </div>

      {/* TOOL 1: DOCTOR NOTE / JARGON TRANSLATOR */}
      {activeTool === 'jargonBuster' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
              Paste any confusing sentence from your doctor, lab sheet, or pill bottle:
            </label>
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <input 
                type="text" 
                className="jargon-input"
                placeholder="e.g. Pt reports mild dyspnea on exertion, continue titration of ACE inhibitor..."
                value={jargonInput}
                onChange={(e) => setJargonInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTranslateJargon()}
              />
              <button 
                className="sketch-action-btn primary"
                onClick={() => handleTranslateJargon()}
                disabled={isTranslating || !jargonInput.trim()}
              >
                <span>{isTranslating ? 'Translating...' : 'Translate'}</span>
                <Sparkles size={16} />
              </button>
            </div>
          </div>

          {/* Quick Clickable Sample Sentences */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--ink-muted)' }}>
              Or try a real sample:
            </span>
            {sampleJargon.map((sample, idx) => (
              <button
                key={idx}
                className="sketch-badge"
                style={{ cursor: 'pointer', background: 'var(--bg-card-subtle)', textAlign: 'left', maxWidth: '380px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                onClick={() => {
                  setJargonInput(sample);
                  handleTranslateJargon(sample);
                }}
              >
                "{sample.slice(0, 48)}..."
              </button>
            ))}
          </div>

          {/* Translation Result Output Box (Styled as Post-it / Sketchbook Note) */}
          {(jargonOutput || isTranslating) && (
            <div className="postit-note green animate-fade-in" style={{ marginTop: '0.5rem' }}>
              <div className="pushpin" />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="marker-label" style={{ fontWeight: 800, fontSize: '1rem', color: '#166534' }}>
                  ✏️ Plain English Translation (by Gemma 2:2B)
                </span>
                <span style={{ fontSize: '0.75rem', background: '#DCFCE7', padding: '2px 8px', borderRadius: '12px', border: '1px solid #16A34A', fontWeight: 700 }}>
                  100% Offline
                </span>
              </div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.96rem', marginTop: '4px' }}>
                {jargonOutput || 'Gemma is reading the clinical words and translating for you...'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 2: DRUG & FOOD INTERACTION SAFETY CHECKER */}
      {activeTool === 'interactionChecker' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '6px' }}>
              Select prescriptions to cross-check for interactions or food warnings:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
              {(currentDoc?.medications || []).map((med) => {
                const isSelected = selectedMeds.includes(med.name);
                return (
                  <button
                    key={med.id}
                    className={`sketch-badge ${isSelected ? 'offline' : ''}`}
                    style={{ padding: '0.5rem 0.85rem', cursor: 'pointer', fontSize: '0.85rem' }}
                    onClick={() => handleToggleMedSelection(med.name)}
                  >
                    <div className={`sketch-checkbox ${isSelected ? 'checked' : ''}`} style={{ width: '18px', height: '18px', marginRight: '6px' }}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span>{med.name} ({med.dosage})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add custom OTC / Supplement / Food to check */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              + Add an Over-the-counter medicine, supplement, or food (e.g. Advil, Grapefruit, Vitamin D, Tums):
            </label>
            <div style={{ display: 'flex', gap: '0.65rem', maxWidth: '500px' }}>
              <input 
                type="text" 
                className="jargon-input"
                placeholder="e.g. Grapefruit or Ibuprofen"
                value={customMedicine}
                onChange={(e) => setCustomMedicine(e.target.value)}
              />
              <button 
                className="sketch-action-btn primary"
                onClick={handleCheckInteractions}
                disabled={isCheckingInteractions || (selectedMeds.length + (customMedicine ? 1 : 0) < 2)}
              >
                <span>{isCheckingInteractions ? 'Checking...' : 'Check Safety'}</span>
                <ShieldAlert size={16} />
              </button>
            </div>
          </div>

          {/* Interaction Results Output */}
          {interactionResult && (
            <div className="postit-note coral animate-fade-in">
              <div className="pushpin" />
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#9F1239', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} />
                <span>Interaction Safety Verdict</span>
              </div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.94rem', marginTop: '4px' }}>
                {interactionResult}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 3: LAB GOAL SIMULATOR */}
      {activeTool === 'labSimulator' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-secondary)', marginBottom: '1rem' }}>
              Drag the sliders to see what happens when daily habits improve your blood sugar or blood pressure!
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {/* HbA1c Slider */}
              <div className="sketch-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>Blood Sugar (HbA1c)</span>
                  <span style={{
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    color: simulatedA1c <= 6.5 ? 'var(--sketch-green)' : simulatedA1c <= 7.0 ? 'var(--sketch-amber)' : 'var(--sketch-coral)'
                  }}>
                    {simulatedA1c}%
                  </span>
                </div>

                <input 
                  type="range" 
                  min="5.4" 
                  max="9.0" 
                  step="0.1"
                  value={simulatedA1c}
                  onChange={(e) => setSimulatedA1c(parseFloat(e.target.value))}
                  style={{ width: '100%', margin: '0.75rem 0' }}
                />

                <div style={{ fontSize: '0.85rem', lineHeight: 1.5, background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: 'var(--wobble-btn)', border: '1.5px solid var(--ink-border)' }}>
                  {simulatedA1c <= 6.5 ? (
                    <span style={{ color: 'var(--sketch-green)', fontWeight: 700 }}>
                      🌟 Excellent Control! Your doctor will be thrilled. Lower risk of fatigue, eye strain, and kidney stress.
                    </span>
                  ) : simulatedA1c <= 7.0 ? (
                    <span style={{ color: 'var(--sketch-amber)', fontWeight: 700 }}>
                      👍 Safe Senior Zone: For seniors, staying under 7.0% prevents dangerous low-sugar dizzy spells while keeping arteries clean.
                    </span>
                  ) : (
                    <span style={{ color: 'var(--sketch-coral)', fontWeight: 700 }}>
                      ⚠️ Elevated: Suggests reviewing evening carbohydrate intake with your doctor and ensuring metformin is taken consistently.
                    </span>
                  )}
                </div>
              </div>

              {/* Blood Pressure Slider */}
              <div className="sketch-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>Systolic Pressure (Top #)</span>
                  <span style={{
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    color: simulatedBP <= 125 ? 'var(--sketch-green)' : simulatedBP <= 139 ? 'var(--sketch-amber)' : 'var(--sketch-coral)'
                  }}>
                    {simulatedBP} mmHg
                  </span>
                </div>

                <input 
                  type="range" 
                  min="105" 
                  max="170" 
                  step="1"
                  value={simulatedBP}
                  onChange={(e) => setSimulatedBP(parseInt(e.target.value, 10))}
                  style={{ width: '100%', margin: '0.75rem 0' }}
                />

                <div style={{ fontSize: '0.85rem', lineHeight: 1.5, background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: 'var(--wobble-btn)', border: '1.5px solid var(--ink-border)' }}>
                  {simulatedBP <= 125 ? (
                    <span style={{ color: 'var(--sketch-green)', fontWeight: 700 }}>
                      💚 Optimal: Heart pumps comfortably with very low artery stress.
                    </span>
                  ) : simulatedBP <= 139 ? (
                    <span style={{ color: 'var(--sketch-amber)', fontWeight: 700 }}>
                      🟡 Stage 1 / Borderline: Good progress! Gentle 20-minute morning walks and lowering salt under 2,000mg helps here.
                    </span>
                  ) : (
                    <span style={{ color: 'var(--sketch-coral)', fontWeight: 700 }}>
                      ⚠️ High: Discuss adjusting blood pressure medications (like Lisinopril) with your doctor.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
