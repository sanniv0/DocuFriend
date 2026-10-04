import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PrivacyBanner from './components/PrivacyBanner';
import DocSelectorRibbon from './components/DocSelectorRibbon';
import SummaryView from './components/SummaryView';
import MedicationSchedule from './components/MedicationSchedule';
import LabResultsView from './components/LabResultsView';
import AssistantChat from './components/AssistantChat';
import DoctorVisitPrep from './components/DoctorVisitPrep';
import UserHealthTools from './components/UserHealthTools';
import DocumentUploadModal from './components/DocumentUploadModal';
import PrintableFridgeSheet from './components/PrintableFridgeSheet';
import AddCustomMedModal from './components/AddCustomMedModal';
import AddCustomLabModal from './components/AddCustomLabModal';
import { checkOllamaStatus } from './services/ollamaService';
import { speechService } from './services/speechService';
import { 
  FileText, 
  Pill, 
  Activity, 
  Bot, 
  ClipboardCheck, 
  Lightbulb, 
  Sparkles,
  Sliders,
  PlusCircle,
  ShieldCheck,
  HeartHandshake,
  UploadCloud,
  Trash2
} from 'lucide-react';

export default function App() {
  // Load real user records from localStorage (empty array if first time, NO MOCK DATA)
  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('docufriend_user_records');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeDocId, setActiveDocId] = useState(() => {
    return records[0]?.id || null;
  });

  const [activeTab, setActiveTab] = useState('summary');
  const [fontScale, setFontScale] = useState(1);
  const [theme, setTheme] = useState('warm');
  const [ollamaStatus, setOllamaStatus] = useState({ online: true, models: ['gemma2:2b'], activeModel: 'gemma2:2b' });
  
  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isFridgeSheetOpen, setIsFridgeSheetOpen] = useState(false);
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [isAddLabOpen, setIsAddLabOpen] = useState(false);

  const [prefilledQuery, setPrefilledQuery] = useState('');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Sync user records to localStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem('docufriend_user_records', JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save records to localStorage:', e);
    }
    // Maintain activeDocId if current one was deleted or none selected
    if (records.length > 0 && (!activeDocId || !records.some(r => r.id === activeDocId))) {
      setActiveDocId(records[0].id);
    }
  }, [records, activeDocId]);

  // Handle font scale & theme
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale);
  }, [fontScale]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Audio and Ollama polling
  useEffect(() => {
    const unsubscribe = speechService.subscribe(({ isPlaying }) => {
      setIsAudioPlaying(isPlaying);
    });

    const pollOllama = async () => {
      const status = await checkOllamaStatus();
      setOllamaStatus(status);
    };

    pollOllama();
    const interval = setInterval(pollOllama, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
      speechService.stop();
    };
  }, []);

  const currentDoc = records.find(r => r.id === activeDocId) || records[0] || null;

  const handleStartAudio = (text) => {
    speechService.speak(text);
  };

  const handleStopAudio = () => {
    speechService.stop();
  };

  const handleOpenChatWithQuery = (query) => {
    setPrefilledQuery(query);
    setActiveTab('assistant');
  };

  const handleAddRecord = (newDoc) => {
    setRecords(prev => [newDoc, ...prev]);
    setActiveDocId(newDoc.id);
    setActiveTab('summary');
  };

  const handleDeleteRecord = (recordId) => {
    if (confirm("Are you sure you want to delete this medical record from your device?")) {
      setRecords(prev => prev.filter(r => r.id !== recordId));
      speechService.stop();
    }
  };

  // Add custom medication to current active record
  const handleAddCustomMed = (newMed) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id === activeDocId) {
        return {
          ...rec,
          medications: [...(rec.medications || []), newMed]
        };
      }
      return rec;
    }));
  };

  // Delete medication
  const handleDeleteMed = (medId) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id === activeDocId) {
        return {
          ...rec,
          medications: (rec.medications || []).filter(m => m.id !== medId)
        };
      }
      return rec;
    }));
  };

  // Add custom lab to current active record
  const handleAddCustomLab = (newLab) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id === activeDocId) {
        return {
          ...rec,
          labResults: [...(rec.labResults || []), newLab]
        };
      }
      return rec;
    }));
  };

  // Delete lab
  const handleDeleteLab = (testName) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id === activeDocId) {
        return {
          ...rec,
          labResults: (rec.labResults || []).filter(l => l.testName !== testName)
        };
      }
      return rec;
    }));
  };

  const navTabs = currentDoc ? [
    { id: 'summary', label: 'Plain Summary', icon: FileText },
    { id: 'medications', label: `Medication Schedule (${currentDoc?.medications?.length || 0})`, icon: Pill },
    { id: 'labs', label: `Lab Results (${currentDoc?.labResults?.length || 0})`, icon: Activity },
    { id: 'tools', label: 'Interactive Health Tools', icon: Sliders, isNew: true },
    { id: 'assistant', label: 'DocuFriend AI (Gemma 2:2B)', icon: Bot, isAi: true },
    { id: 'visitPrep', label: 'Doctor Visit Prep', icon: ClipboardCheck }
  ] : [];

  return (
    <div className="app-container">
      {/* Top Header */}
      <Navbar 
        ollamaStatus={ollamaStatus}
        fontScale={fontScale}
        setFontScale={setFontScale}
        theme={theme}
        setTheme={setTheme}
        onOpenUpload={() => setIsUploadOpen(true)}
        isAudioPlaying={isAudioPlaying}
        onStopAudio={handleStopAudio}
      />

      <main className="main-content">
        {/* If no records exist, show the welcoming hand-drawn empty state */}
        {records.length === 0 ? (
          <div className="sketch-card animate-fade-in" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', maxWidth: '820px', margin: '1rem auto' }}>
            <div className="washi-tape" />
            <div className="washi-tape pink" />

            <div className="brand-icon-wrap" style={{ width: '64px', height: '64px', margin: '0 auto 1.25rem' }}>
              <HeartHandshake size={36} />
            </div>

            <div style={{ display: 'inline-block' }}>
              <span className="hand-note" style={{ fontSize: '1.8rem' }}>Welcome to DocuFriend</span>
            </div>

            <h2 style={{ fontSize: '1.9rem', fontWeight: 900, marginTop: '0.25rem', marginBottom: '0.75rem' }}>
              Your Private Offline Health Assistant
            </h2>

            <p style={{ fontSize: '1.05rem', color: 'var(--ink-secondary)', maxWidth: '580px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
              Built for grandparents, elderly friends, and family caregivers. Upload complex PDF reports, track daily medication timetables, and understand lab results without uploading private health files to any cloud.
            </p>

            {/* Hand-Drawn Post-It Pillars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem', textAlign: 'left' }}>
              <div className="postit-note green">
                <div className="pushpin" style={{ background: '#16A34A' }} />
                <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#14532D' }}>
                  🔒 100% Offline Privacy
                </div>
                <div style={{ fontSize: '0.84rem', color: '#166534' }}>
                  Your documents, pill charts, and lab numbers never leave this machine.
                </div>
              </div>

              <div className="postit-note">
                <div className="pushpin" style={{ background: '#CA8A04' }} />
                <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#854D0E' }}>
                  📄 PDF & Note Reader
                </div>
                <div style={{ fontSize: '0.84rem', color: '#713F12' }}>
                  Drop hospital summaries, discharge notes, or lab sheets for instant translation.
                </div>
              </div>

              <div className="postit-note blue">
                <div className="pushpin" style={{ background: '#2563EB' }} />
                <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#1E40AF' }}>
                  🤖 Gemma 2:2B Inside
                </div>
                <div style={{ fontSize: '0.84rem', color: '#1E3A8A' }}>
                  Empathetic, jargon-free health companion powered by local Gemma 2:2B.
                </div>
              </div>
            </div>

            {/* Big Action Button */}
            <button 
              className="sketch-action-btn primary"
              style={{ fontSize: '1.1rem', padding: '0.85rem 2rem' }}
              onClick={() => setIsUploadOpen(true)}
            >
              <PlusCircle size={22} />
              <span>+ Add Your First Medical Record or Prescription</span>
            </button>
          </div>
        ) : (
          /* User has records */
          <>
            {/* On-device Privacy Banner */}
            <PrivacyBanner currentDoc={currentDoc} />

            {/* Patient / Document Selector Ribbon */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <DocSelectorRibbon 
                  records={records}
                  activeDocId={activeDocId}
                  onSelectDoc={(id) => {
                    setActiveDocId(id);
                    speechService.stop();
                  }}
                  onOpenUpload={() => setIsUploadOpen(true)}
                />
              </div>

              {currentDoc && (
                <button
                  onClick={() => handleDeleteRecord(currentDoc.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--sketch-coral)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.6rem'
                  }}
                  title="Remove this medical record"
                >
                  <Trash2 size={14} />
                  <span>Delete Record</span>
                </button>
              )}
            </div>

            {/* Hand-Drawn Navigation Tabs */}
            <div className="sketch-nav-tabs">
              {navTabs.map(tab => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    className={`sketch-nav-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(tab.id);
                      speechService.stop();
                    }}
                  >
                    <TabIcon size={17} />
                    <span>{tab.label}</span>
                    {tab.isAi && (
                      <span 
                        className="sketch-badge" 
                        style={{ 
                          fontSize: '0.65rem', 
                          padding: '0.1rem 0.4rem', 
                          background: isActive ? '#FEF08A' : undefined, 
                          color: isActive ? '#1E293B' : undefined 
                        }}
                      >
                        Offline
                      </span>
                    )}
                    {tab.isNew && (
                      <span 
                        className="sketch-badge" 
                        style={{ 
                          fontSize: '0.65rem', 
                          padding: '0.1rem 0.4rem', 
                          background: '#BBF7D0', 
                          color: '#14532D' 
                        }}
                      >
                        Interactive
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Tab View */}
            <div className="tab-view-content">
              {activeTab === 'summary' && (
                <SummaryView 
                  currentDoc={currentDoc}
                  isAudioPlaying={isAudioPlaying}
                  onStartAudio={handleStartAudio}
                  onStopAudio={handleStopAudio}
                  onOpenChatWithQuery={handleOpenChatWithQuery}
                />
              )}

              {activeTab === 'medications' && (
                <MedicationSchedule 
                  medications={currentDoc?.medications || []}
                  patientName={currentDoc?.patientName || 'Patient'}
                  onPrintFridgeSheet={() => setIsFridgeSheetOpen(true)}
                  onOpenAddMed={() => setIsAddMedOpen(true)}
                  onDeleteMed={handleDeleteMed}
                  onOpenChatWithQuery={handleOpenChatWithQuery}
                />
              )}

              {activeTab === 'labs' && (
                <LabResultsView 
                  labResults={currentDoc?.labResults || []}
                  patientName={currentDoc?.patientName || 'Patient'}
                  onOpenAddLab={() => setIsAddLabOpen(true)}
                  onDeleteLab={handleDeleteLab}
                  onOpenChatWithQuery={handleOpenChatWithQuery}
                />
              )}

              {activeTab === 'tools' && (
                <UserHealthTools 
                  currentDoc={currentDoc}
                  onAddMedication={() => setIsAddMedOpen(true)}
                  onAddLabResult={() => setIsAddLabOpen(true)}
                />
              )}

              {activeTab === 'assistant' && (
                <AssistantChat 
                  currentDoc={currentDoc}
                  prefilledQuery={prefilledQuery}
                  onClearPrefill={() => setPrefilledQuery('')}
                  onStartAudio={handleStartAudio}
                  onStopAudio={handleStopAudio}
                  isAudioPlaying={isAudioPlaying}
                />
              )}

              {activeTab === 'visitPrep' && (
                <DoctorVisitPrep 
                  currentDoc={currentDoc}
                  onOpenChatWithQuery={handleOpenChatWithQuery}
                />
              )}
            </div>
          </>
        )}
      </main>

      {/* Upload Document Modal */}
      <DocumentUploadModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddRecord={handleAddRecord}
      />

      {/* Add Custom Medication Modal */}
      <AddCustomMedModal 
        isOpen={isAddMedOpen}
        onClose={() => setIsAddMedOpen(false)}
        onAddMed={handleAddCustomMed}
      />

      {/* Add Custom Lab Test Modal */}
      <AddCustomLabModal 
        isOpen={isAddLabOpen}
        onClose={() => setIsAddLabOpen(false)}
        onAddLab={handleAddCustomLab}
      />

      {/* Printable Refrigerator Care Sheet Modal */}
      {isFridgeSheetOpen && currentDoc && (
        <PrintableFridgeSheet 
          currentDoc={currentDoc}
          onClose={() => setIsFridgeSheetOpen(false)}
        />
      )}
    </div>
  );
}
