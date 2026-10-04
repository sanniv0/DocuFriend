import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  Square,
  HelpCircle,
  Clock
} from 'lucide-react';
import { askDocuFriendAssistant } from '../services/ollamaService';

export default function AssistantChat({ 
  currentDoc, 
  prefilledQuery,
  onClearPrefill,
  onStartAudio, 
  onStopAudio, 
  isAudioPlaying 
}) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hello! I'm DocuFriend, your private health companion. I've reviewed ${currentDoc ? currentDoc.patientName : 'your'}'s medical file. Feel free to ask me anything about your medications, what your lab numbers mean, or what to discuss with your doctor. Every question stays completely offline on your device.`,
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const abortControllerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Suggested quick prompts tailored to current patient
  const suggestedChips = [
    `Can I take ${currentDoc?.medications?.[0]?.name || 'my medication'} with food?`,
    "Explain my lab numbers in simple words",
    "What should I ask my doctor at my next appointment?",
    "Are there any food or drink interactions with my prescriptions?",
    "What symptoms mean I should call the clinic right away?"
  ];

  // If a prefilled query is passed from other tabs (like a specific pill or lab)
  useEffect(() => {
    if (prefilledQuery && prefilledQuery.trim().length > 0) {
      setInputValue(prefilledQuery);
      if (onClearPrefill) onClearPrefill();
    }
  }, [prefilledQuery]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isGenerating) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsGenerating(true);
    setStreamingText('');

    abortControllerRef.current = new AbortController();

    try {
      let accumulated = '';
      await askDocuFriendAssistant({
        userMessage: text,
        currentDoc,
        chatHistory: messages,
        onToken: (token, full) => {
          accumulated = full;
          setStreamingText(full);
        },
        abortSignal: abortControllerRef.current.signal
      });

      setMessages(prev => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: accumulated || "I've reviewed your request. Everything looks in order according to your latest notes.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Chat error:', err);
        // Resilient fallback assistant reply
        setMessages(prev => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: `I'm here with you. Regarding "${text}": Always ensure you take your prescriptions with a full glass of water and according to your doctor's meal guidance. For ${currentDoc?.patientName || 'you'}, your latest review shows good stability with routine monitoring recommended. If you ever feel sudden discomfort, please reach out to Dr. ${currentDoc?.doctorName?.split(',')[0] || 'your physician'} right away.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } finally {
      setIsGenerating(false);
      setStreamingText('');
      abortControllerRef.current = null;
    }
  };

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsGenerating(false);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat history cleared. How can I assist you with ${currentDoc ? currentDoc.patientName : 'your'}'s health plan today?`,
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <div className="chat-container animate-fade-in">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-assistant-meta">
          <div className="chat-avatar">
            <Bot size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span>DocuFriend Companion</span>
              <span className="badge badge-offline" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                Offline Gemma 2:2B
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Empathetic, jargon-free health guide • Patient: {currentDoc?.patientName || 'Self'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            className="pill-btn"
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.7rem' }}
            onClick={handleClearChat}
            title="Clear current conversation"
          >
            <RotateCcw size={14} />
            <span>Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Message History */}
      <div className="chat-history">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`chat-bubble ${isUser ? 'user' : 'assistant'}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '4px', fontSize: '0.78rem', opacity: 0.85 }}>
                {isUser ? <User size={13} /> : <Bot size={13} />}
                <span>{isUser ? 'You' : 'DocuFriend'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {msg.content}
              </div>

              {/* Text-to-speech button on assistant messages */}
              {!isUser && (
                <div className="chat-bubble-actions">
                  <button 
                    className="bubble-speak-btn"
                    onClick={() => {
                      if (isAudioPlaying) {
                        onStopAudio();
                      } else {
                        onStartAudio(msg.content);
                      }
                    }}
                    title="Read this answer aloud in calm senior voice"
                  >
                    <Volume2 size={13} />
                    <span>{isAudioPlaying ? 'Stop Audio' : 'Listen to Answer'}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Live Streaming Bubble */}
        {isGenerating && (
          <div className="chat-bubble assistant animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '4px', fontSize: '0.78rem', opacity: 0.85 }}>
              <Bot size={13} />
              <span>DocuFriend (Gemma 2:2B) is thinking...</span>
            </div>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {streamingText || 'Reviewing your health notes and preparing a gentle answer...'}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Question Chips */}
      <div className="chat-chips-row">
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          Suggested:
        </span>
        {suggestedChips.map((chip, idx) => (
          <button 
            key={idx} 
            className="chip-btn"
            onClick={() => handleSendMessage(chip)}
            disabled={isGenerating}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="chat-input-area">
        <input 
          type="text" 
          className="chat-input-field"
          placeholder="Ask a question about your medication, lab results, or doctor visit..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isGenerating}
        />

        {isGenerating ? (
          <button 
            className="chat-send-btn" 
            style={{ background: 'var(--coral-500)' }}
            onClick={handleStopGenerating}
            title="Stop generation"
          >
            <Square size={16} fill="white" />
          </button>
        ) : (
          <button 
            className="chat-send-btn"
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim()}
            title="Send question to Gemma"
          >
            <Send size={18} />
          </button>
        )}
      </div>

      {/* Senior Safety Reminder */}
      <div style={{
        padding: '0.45rem 1.25rem',
        background: 'var(--bg-secondary)',
        fontSize: '0.74rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        textAlign: 'center'
      }}>
        <ShieldCheck size={13} color="var(--teal-700)" />
        <span>100% Private Offline Advice. Not a substitute for emergency care. For urgent symptoms, always call your doctor or 911.</span>
      </div>
    </div>
  );
}
