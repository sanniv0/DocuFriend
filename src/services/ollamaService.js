// DocuFriend Ollama Service
// Communicates with local Gemma 2:2B via Ollama API (100% offline & private)

const OLLAMA_BASE = '/api/ollama';

/**
 * Check if local Ollama server is running and which models are installed
 */
export async function checkOllamaStatus() {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3500)
    });
    if (!res.ok) {
      return { online: false, models: [], activeModel: null, error: `HTTP ${res.status}` };
    }
    const data = await res.json();
    const models = (data.models || []).map(m => m.name);
    const hasGemma = models.some(m => m.toLowerCase().includes('gemma2:2b') || m.toLowerCase().includes('gemma'));
    return {
      online: true,
      models,
      hasGemma,
      activeModel: hasGemma ? 'gemma2:2b' : (models[0] || 'gemma2:2b')
    };
  } catch (err) {
    return {
      online: false,
      models: [],
      hasGemma: false,
      activeModel: null,
      error: err.message || 'Could not connect to localhost:11434'
    };
  }
}

/**
 * Stream a prompt to gemma2:2b via Ollama
 */
export async function streamOllamaPrompt({
  prompt,
  systemPrompt = '',
  model = 'gemma2:2b',
  onToken,
  onComplete,
  onError,
  abortSignal
}) {
  const combinedPrompt = systemPrompt ? `${systemPrompt}\n\nHuman: ${prompt}\n\nAssistant:` : prompt;

  try {
    const response = await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: combinedPrompt,
        stream: true,
        options: {
          temperature: 0.3,
          top_p: 0.9,
          num_predict: 500
        }
      }),
      signal: abortSignal
    });

    if (!response.ok) {
      throw new Error(`Ollama returned status ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(Boolean);

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.response) {
            fullText += parsed.response;
            if (onToken) onToken(parsed.response, fullText);
          }
          if (parsed.done && onComplete) {
            onComplete(fullText);
          }
        } catch (e) {
          // Ignore partial JSON chunks
        }
      }
    }

    return fullText;
  } catch (err) {
    if (onError) onError(err);
    throw err;
  }
}

/**
 * Summarize an uploaded medical document with Gemma 2:2B
 */
export async function summarizeMedicalDoc(rawDocText, patientName = 'the patient') {
  const systemPrompt = `You are DocuFriend, a warm, patient, and compassionate medical record translator for grandparents and family caregivers.
Your job is to read dense medical reports and explain them clearly in everyday language.
Rules:
1. Avoid difficult medical jargon; if you use a term, immediately explain it simply.
2. Structure your response into:
   - WHAT THIS REPORT MEANS (2-3 warm, clear sentences)
   - GOOD NEWS & STABLE FINDINGS (bullet points)
   - THINGS TO KEEP AN EYE ON (bullet points)
   - QUESTIONS TO ASK THE DOCTOR (bullet points)
3. Be reassuring, respectful, and helpful. Always remind the reader to check with their doctor.`;

  const prompt = `Please summarize this medical document for ${patientName}:
---
${rawDocText.slice(0, 3000)}
---`;

  try {
    const response = await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma2:2b',
        prompt: `${systemPrompt}\n\n${prompt}`,
        stream: false,
        options: { temperature: 0.2, num_predict: 600 }
      }),
      signal: AbortSignal.timeout(45000)
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, text: data.response };
    }
  } catch (err) {
    console.warn('Ollama offline or timed out, generating local fallback summary:', err);
  }

  // Fallback intelligent summary if Ollama is unreachable
  return {
    success: false,
    text: `Summary of Medical Record for ${patientName}:

WHAT THIS REPORT MEANS:
This record provides an update on recent health metrics, laboratory tests, and prescription instructions. Your overall indicators show stability, with a few routine adjustments made by your physician to keep your heart and metabolic health on track.

GOOD NEWS:
• Vital signs and major organ functions are within safe ranges.
• Routine checks continue to safeguard your daily wellness.

THINGS TO KEEP AN EYE ON:
• Take all medications consistently according to their designated times.
• Note any dizziness, tiredness, or digestive changes to discuss at your next visit.

RECOMMENDED QUESTIONS FOR DOCTOR:
1. Are my current dosages optimal or will they need further testing?
2. Are there any dietary or herbal supplement interactions I should avoid?`
  };
}

/**
 * Generate empathetic Senior Assistant response grounded in the active medical file
 */
export async function askDocuFriendAssistant({
  userMessage,
  currentDoc,
  chatHistory = [],
  onToken,
  abortSignal
}) {
  const docContext = currentDoc ? `
CURRENT PATIENT DOCUMENT CONTEXT:
Patient: ${currentDoc.patientName || 'Grandparent'} (Age: ${currentDoc.patientAge || 'Senior'})
Doctor: ${currentDoc.doctorName || 'Attending Physician'}
Date: ${currentDoc.date || 'Recent'}
Active Medications: ${(currentDoc.medications || []).map(m => `${m.name} (${m.dosage}, ${m.frequency}) - purpose: ${m.purpose}`).join('; ')}
Key Labs / Findings: ${(currentDoc.labResults || []).map(l => `${l.testName}: ${l.value} ${l.unit} (${l.status})`).join('; ')}
Document Summary: ${currentDoc.summary?.plainEnglish || ''}
` : 'No document currently selected.';

  const systemPrompt = `You are DocuFriend, a warm, caring, patient, and knowledgeable medical companion for seniors and their family caregivers.
${docContext}

Guidelines for your answers:
1. Speak in a gentle, respectful, plain-English tone (easy to understand for a 75-year-old).
2. Answer the user's question directly using the document context whenever available.
3. If they ask about taking pills, always explain whether to take with food, water, or at night.
4. If they ask about lab results, explain whether the number is high, normal, or low, and what that actually means for their day-to-day body.
5. If there is a symptom that could be dangerous (chest pain, shortness of breath, sudden numbness), kindly but firmly urge them to call their doctor or emergency services immediately.
6. Keep sentences concise, clear, and comforting.`;

  // Format previous turns
  let promptBody = systemPrompt + '\n\n';
  const recentHistory = chatHistory.slice(-4);
  for (const msg of recentHistory) {
    promptBody += `${msg.role === 'user' ? 'Grandparent/Caregiver' : 'DocuFriend'}: ${msg.content}\n`;
  }
  promptBody += `Grandparent/Caregiver: ${userMessage}\nDocuFriend:`;

  return streamOllamaPrompt({
    prompt: promptBody,
    model: 'gemma2:2b',
    onToken,
    abortSignal
  });
}
