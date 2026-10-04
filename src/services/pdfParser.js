import * as pdfjsLib from 'pdfjs-dist';

// Set up pdf.js worker URL safely
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
} catch (e) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

/**
 * Extract plain text from an uploaded PDF file (100% in-browser, offline)
 */
export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    const pageCount = pdf.numPages;

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items.map(item => item.str);
      fullText += `--- Page ${pageNum} ---\n` + pageStrings.join(' ') + '\n\n';
    }

    return {
      success: true,
      text: fullText.trim(),
      pageCount,
      filename: file.name
    };
  } catch (error) {
    console.error('PDF parsing error:', error);
    return {
      success: false,
      error: error.message || 'Failed to extract text from PDF',
      filename: file.name
    };
  }
}

/**
 * Heuristically extracts medication entries and lab figures from raw medical text
 * to immediately populate the UI while Gemma generates plain English summaries
 */
export function heuristicMedicalExtractor(rawText, filename = 'Uploaded Document') {
  const text = rawText || '';

  // Common medication patterns: Name + dosage (e.g. Lisinopril 10mg, Metformin 500 mg)
  const medMatches = [];
  const knownMeds = [
    { name: 'Lisinopril', purpose: 'Blood pressure control', slot: 'Morning', food: 'Drink full glass of water' },
    { name: 'Amlodipine', purpose: 'Blood pressure and chest comfort', slot: 'Morning', food: 'Can take with or without food' },
    { name: 'Metformin', purpose: 'Blood sugar regulation', slot: 'Evening', food: 'Take with evening meal to protect stomach' },
    { name: 'Atorvastatin', purpose: 'Cholesterol & heart protection', slot: 'Bedtime', food: 'Avoid grapefruit products' },
    { name: 'Simvastatin', purpose: 'Cholesterol reduction', slot: 'Bedtime', food: 'Avoid grapefruit' },
    { name: 'Omeprazole', purpose: 'Acid reflux and stomach protection', slot: 'Morning', food: 'Take 30 mins before first meal' },
    { name: 'Levothyroxine', purpose: 'Thyroid hormone replacement', slot: 'Morning', food: 'Take on empty stomach 60 mins before food' },
    { name: 'Aspirin', purpose: 'Blood clot prevention', slot: 'Morning', food: 'Always take with food' },
    { name: 'Gabapentin', purpose: 'Nerve comfort & sleep support', slot: 'Bedtime', food: 'May cause drowsiness' },
    { name: 'Hydrochlorothiazide', purpose: 'Water pill for fluid & pressure', slot: 'Morning', food: 'Take in morning so sleep is not disrupted' },
    { name: 'Furosemide', purpose: 'Diuretic for water retention', slot: 'Morning', food: 'Eat potassium-rich foods like bananas' },
    { name: 'Losartan', purpose: 'Blood pressure and kidney support', slot: 'Morning', food: 'Take at the same time each day' }
  ];

  let idCounter = 100;
  knownMeds.forEach(km => {
    const regex = new RegExp(`\\b${km.name}\\b(?:\\s+(\\d+(?:\\.\\d+)?\\s*(?:mg|mcg|g|ml)))?`, 'i');
    const match = text.match(regex);
    if (match) {
      medMatches.push({
        id: `extracted-${idCounter++}`,
        name: km.name,
        brand: 'Prescription',
        dosage: match[1] || 'As Prescribed',
        frequency: km.slot === 'Morning' ? 'Once daily in morning' : km.slot === 'Bedtime' ? 'Once daily at bedtime' : 'Once daily with meals',
        timeSlot: km.slot,
        purpose: km.purpose,
        instructions: `Take regularly as directed by your physician. ${km.food}`,
        foodWarning: km.food,
        remainingPills: 30,
        color: '#3B82F6',
        pillShape: 'Tablet / Capsule'
      });
    }
  });

  // Common lab tests
  const labMatches = [];
  const knownLabs = [
    { name: 'Blood Pressure', pattern: /(?:BP|Blood Pressure)[:\s]+(\d{2,3}\/\d{2,3})/i, unit: 'mmHg', ref: '< 130/80', meaning: 'Heart pump & artery health.' },
    { name: 'Total Cholesterol', pattern: /(?:Total Cholesterol|Cholesterol, Total)[:\s]+(\d{2,3})/i, unit: 'mg/dL', ref: '< 200', meaning: 'Overall circulating fat level in bloodstream.' },
    { name: 'LDL Cholesterol', pattern: /(?:LDL|LDL-C)[:\s]+(\d{2,3})/i, unit: 'mg/dL', ref: '< 100', meaning: 'Bad cholesterol; lower is safer for heart health.' },
    { name: 'HDL Cholesterol', pattern: /(?:HDL|HDL-C)[:\s]+(\d{2,3})/i, unit: 'mg/dL', ref: '> 40', meaning: 'Good protective cholesterol.' },
    { name: 'HbA1c', pattern: /(?:HbA1c|A1C|Hemoglobin A1c)[:\s]+(\d+(?:\.\d+)?)/i, unit: '%', ref: '< 6.5%', meaning: '90-day average blood sugar control.' },
    { name: 'Fasting Glucose', pattern: /(?:Glucose|Fasting Blood Sugar)[:\s]+(\d{2,3})/i, unit: 'mg/dL', ref: '70 - 99', meaning: 'Immediate morning sugar reading.' },
    { name: 'eGFR', pattern: /(?:eGFR|GFR)[:\s]+(\d{2,3})/i, unit: 'mL/min', ref: '> 60', meaning: 'Kidney filtration speed.' },
    { name: 'Creatinine', pattern: /(?:Creatinine)[:\s]+(\d+(?:\.\d+)?)/i, unit: 'mg/dL', ref: '0.6 - 1.2', meaning: 'Kidney waste filtration efficiency.' },
    { name: 'Potassium', pattern: /(?:Potassium|K\+)[:\s]+(\d+(?:\.\d+)?)/i, unit: 'mEq/L', ref: '3.5 - 5.0', meaning: 'Electrolyte balance vital for heart beats.' }
  ];

  knownLabs.forEach(kl => {
    const match = text.match(kl.pattern);
    if (match) {
      const val = parseFloat(match[1]);
      let status = 'Normal';
      let statusColor = 'green';

      if (kl.name === 'Total Cholesterol' && val > 200) { status = 'High'; statusColor = 'amber'; }
      if (kl.name === 'LDL Cholesterol' && val > 100) { status = 'Elevated'; statusColor = 'amber'; }
      if (kl.name === 'HbA1c' && val > 6.4) { status = 'Borderline'; statusColor = 'amber'; }
      if (kl.name === 'Fasting Glucose' && val > 125) { status = 'Elevated'; statusColor = 'amber'; }
      if (kl.name === 'eGFR' && val < 60) { status = 'Low'; statusColor = 'amber'; }

      labMatches.push({
        testName: kl.name,
        value: match[1],
        unit: kl.unit,
        referenceRange: kl.ref,
        status,
        statusColor,
        seniorMeaning: kl.meaning,
        whyTested: 'Monitored as part of routine comprehensive senior health checks.'
      });
    }
  });

  return {
    medications: medMatches.length > 0 ? medMatches : null,
    labResults: labMatches.length > 0 ? labMatches : null
  };
}
