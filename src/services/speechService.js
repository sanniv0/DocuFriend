// Senior-Friendly Web Speech Audio Narrator
class SpeechService {
  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    this.synth = this.isSupported ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.isPlaying = false;
    this.rate = 0.9; // 0.9x speed is calm and comfortable for elderly listeners
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(state) {
    this.isPlaying = state;
    this.listeners.forEach(fn => fn({ isPlaying: this.isPlaying }));
  }

  getBestVoice() {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    // Prefer clear natural english voices
    const preferred = voices.find(v => 
      v.lang.startsWith('en') && 
      (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David'))
    );
    return preferred || voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
  }

  speak(text, onFinished) {
    if (!this.isSupported) {
      console.warn('Speech synthesis not supported in this browser environment');
      return;
    }

    this.stop();

    if (!text || text.trim().length === 0) return;

    // Clean markdown symbols like asterisks, bullet points for smooth reading
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/[*#_`]/g, '')
      .replace(/•/g, ', ')
      .replace(/- /g, ', ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = this.rate;
    utterance.pitch = 1.0;
    
    const voice = this.getBestVoice();
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      this.notify(true);
    };

    utterance.onend = () => {
      this.notify(false);
      this.currentUtterance = null;
      if (onFinished) onFinished();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      this.notify(false);
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.notify(false);
      this.currentUtterance = null;
    }
  }

  toggle(text) {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.speak(text);
    }
  }

  setRate(rate) {
    this.rate = rate;
  }
}

export const speechService = new SpeechService();
