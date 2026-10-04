# 🩺 DocuFriend — Offline Private Medical Record Summarizer & Assistant

> **A humanistic, hand-drawn offline health companion built for grandparents, elderly loved ones, and family caregivers.**  
> Powered 100% locally by **Gemma 2:2B** via Ollama • Zero Cloud Data Transmission • On-Device Privacy Guaranteed.

---

## 📖 The Narrative: Who is DocuFriend built for?

Managing health as an older adult is overwhelming. Grandparents and seniors often navigate:
- **Dense, intimidating clinical paperwork** filled with Latin terminology, acronyms, and cryptic lab values.
- **Complex polypharmacy schedules** (4–8 different daily prescriptions across morning, midday, evening, and bedtime, with strict meal and food interaction rules).
- **Legitimate privacy concerns**: Reluctance to upload private, sensitive health history and diagnostic reports to third-party cloud servers or proprietary commercial AI platforms.

**DocuFriend** was created to solve this with warmth, empathy, and absolute privacy. It provides a tactile, humanistic **sketchbook-inspired interface** that translates complex medical reports into plain, soothing English, organizes interactive daily pill schedules, checks drug-food interactions, and lets seniors listen aloud to answers without straining their eyes.

---

## ✨ Key Features & User Workflows

### 1. 🔒 100% On-Device Privacy & Offline Intelligence
- **Zero Cloud Transmission**: All uploaded PDFs, doctor visit notes, and medication lists remain strictly on your local computer.
- **Powered by Gemma 2:2B**: Connects to your local [Ollama](https://ollama.ai) instance (`gemma2:2b`) for private offline reasoning and medical report translation.
- **In-Browser PDF Parsing**: Employs `pdfjs-dist` directly within the browser, extracting text on-device with no external servers.

### 2. 🎨 Humanistic Hand-Drawn & Senior-Accessible Design
- **Tactile Sketchbook Theme**: Hand-drawn borders, washi tape accents, post-it notes, pushpins, highlighter markers, and warm craft paper textures.
- **Senior Accessibility Toolbar**:
  - **Font Size Scaler**: One-click toggle between Standard (`Aa`), Large (`Aa+`), and Extra-Large Comfort (`Aa++`).
  - **Voice Reader (Text-to-Speech)**: Integrated Web Speech narrator calibrated to a calm, senior-friendly speaking pace (`0.9x`) with animated soundwaves and pause controls.
  - **Sunlight & Night Care Themes**: Switch between Warm Sketchbook sunlight mode and Soft Night Care mode.

### 3. 📄 Plain-English Medical Summarizer
- **"What This Means in Everyday Words"**: Demystifies complex diagnoses (e.g. *dyslipidemia*, *LVEF*, *stage 2 CKD*) into conversational takeaways.
- **3-Pillar Clarity Triage**:
  - 🟢 **Good News & Stable Findings** (positive health milestones).
  - 🟡 **Things to Keep an Eye On** (lifestyle reminders, mild symptoms).
  - 🔴 **Doctor's Action Plan** (dosage adjustments, clinic follow-up dates).
- **Deep Dive with Gemma**: One-click trigger to generate a fresh clinical breakdown using local Gemma 2:2B.

### 4. 💊 Daily Prescription & Pill Schedule Organizer
- **Time-of-Day Timetable**: Categorizes medications into Morning ☀️, Afternoon 🌤️, Evening 🌅, and Bedtime 🌙.
- **Pill Cards**: Displays dosage, pill shape/color, prescribing purpose, instructions, and **crucial food/drug warnings** (e.g., *"Do not eat grapefruit"*, *"Take with food"*).
- **Interactive Daily Adherence**: Checkboxes with celebratory progress bar that saves your daily taken status in `localStorage`.
- **+ Add My Medication**: Fully customizable wizard to add your own real medications and vitamins.
- **Printable Refrigerator Whiteboard Guide**: Formatted with corner magnets and printable layout for seniors to pin to their fridge.

### 5. 🔬 Lab Results Demystifier & Benchmark Gauges
- **Visual Gauge Sliders**: Translates numeric lab tests (Cholesterol, LDL, HbA1c, eGFR, Blood Pressure) into color-coded benchmarks (Safe / Normal / Elevated).
- **Senior Explanations**: Tells the user *why the doctor tested it* and *what the number means in daily life*.
- **+ Add My Lab Test**: Log your own recent lab numbers and watch the visual meter adjust.

### 6. 🛠️ Interactive Health Tools
- **Doctor Note Jargon Translator**: Paste any messy sentence from clinic paperwork (e.g., *"Pt reports dyspnea on exertion, LVEF 55%, continue titration of ARB"*), and Gemma translates it into 5th-grade plain English.
- **Drug & Food Safety Cross-Checker**: Select 2 or more of your active prescriptions (or add an OTC item like Advil or Grapefruit) to check offline for dangerous timing conflicts.
- **Lab Goal What-If Simulator**: Interactive sliders for HbA1c and Blood Pressure that visualize how diet and walking improve health markers.

### 7. 🤖 Empathetic AI Assistant (Gemma 2:2B)
- Grounded in the active patient's medical records and prescriptions.
- Pre-populated senior question chips:
  - *"Can I take my blood pressure pill with breakfast?"*
  - *"Explain my lab numbers in simple words"*
  - *"What should I ask my doctor at my next visit?"*
  - *"Are there any food interactions with my medicines?"*
- Real-time streaming responses with a built-in "Listen to Answer" audio narrator.

### 8. 📋 Doctor Visit Preparation & Notes Pad
- **Personalized Questions Checklist**: Suggests questions to ask at the next clinic appointment based on recent lab flags.
- **Doctor's Advice Notes Pad**: Autosaved to `localStorage` so caregivers can document physician instructions.
- **Care Team & Emergency Card**: Quick access to clinic phone numbers, family contacts, and pharmacy info.

---

## 🏗️ Architecture & Technology Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend Core** | React 19 + Vite | Fast, responsive Single Page Application |
| **Styling** | Vanilla CSS Design Tokens | Hand-drawn organic styling, washi tape, post-its |
| **Typography** | Google Fonts | `Outfit`, `Plus Jakarta Sans`, `Caveat`, `Architects Daughter` |
| **Icons** | `lucide-react` | Accessible, humanistic icons |
| **Offline LLM Engine** | Ollama (`gemma2:2b`) | On-device reasoning, summarization, and chat |
| **PDF Extraction** | `pdfjs-dist` | 100% in-browser client-side PDF parsing |
| **Audio Narration** | Web Speech API | Senior-paced voice reading |
| **State & Storage** | React State + `localStorage` | Complete user data persistence |

---

## 🚀 Getting Started

### Prerequisites

1. **Node.js** (v18 or higher recommended)
2. **Ollama** installed on your machine:
   - Download from [ollama.ai](https://ollama.ai)
   - Pull the Gemma 2:2B model:
     ```bash
     ollama pull gemma2:2b
     ```
   - Verify Ollama is running:
     ```bash
     ollama list
     ```

---

### Installation & Local Run

1. **Clone or navigate into the repository**:
   ```bash
   cd Hacktoberfest_2026
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:5173](http://localhost:5173).

---

## 📑 How to Use DocuFriend

1. **Add Your Medical Record**:
   - Click **+ Add Record** in the top navigation or on the welcome screen.
   - Choose:
     - **Option 1**: Upload a PDF medical report (hospital discharge, cardiology follow-up, lab panel).
     - **Option 2**: Paste clinical notes or doctor visit text.
     - **Option 3**: Manual entry with patient name, medications, and labs.
   - Click **Save & Summarize** — Gemma 2:2B immediately translates your file into plain English!

2. **Review Your Daily Prescriptions**:
   - Switch to the **Medication Schedule** tab to see your morning, midday, evening, and bedtime timetable.
   - Check off pills as you take them today.
   - Click **Print Fridge Guide** to print a high-contrast whiteboard sheet with magnet styling for the refrigerator.

3. **Explore Your Lab Gauges**:
   - Switch to **Lab Results** to see visual benchmarks and plain-English explanations.

4. **Ask Questions Offline**:
   - Switch to the **DocuFriend AI** tab to ask any question about your medications, food rules, or doctor visits with Gemma 2:2B.
   - Click **Listen to Answer** to hear the response read aloud.

---

## 🔒 Privacy & Safety Notice

- **No Medical Data Leaves This Machine**: DocuFriend processes all files, PDFs, text, and chat queries strictly on localhost. No tracking, telemetry, or cloud AI services are utilized.
- **Clinical Guidance**: DocuFriend is designed as an educational and organizational aid for patients and caregivers. It does not replace professional medical judgment, diagnosis, or emergency healthcare services. In medical emergencies, always contact your doctor or local emergency services (911) immediately.

---

## 🤝 Contributing

Contributions, feedback, and accessibility enhancements are warmly welcomed! Please feel free to submit a pull request or open an issue.

*Built with ❤️ for Hacktoberfest 2026.*
