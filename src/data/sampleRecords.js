// Rich realistic sample medical documents for grandparents / elderly patients
export const sampleMedicalRecords = [
  {
    id: "rec-arthur-cardio",
    title: "Cardiology Follow-up & Comprehensive Metabolic Panel",
    patientName: "Arthur Miller",
    patientAge: 76,
    doctorName: "Dr. Sarah Chen, MD (Cardiologist)",
    clinicName: "Metro Heart & Vascular Center",
    date: "October 1, 2026",
    docType: "Lab & Clinic Summary",
    statusBadge: "Action Needed",
    summary: {
      plainEnglish: "Arthur's heart rhythm is steady and blood pressure is improved compared to last spring. However, his LDL (bad cholesterol) is slightly above the target range, and blood sugar (HbA1c) indicates mild borderline diabetes. Dr. Chen adjusted the evening cholesterol tablet and reminded Arthur to keep up with his daily 20-minute morning walks.",
      goodNews: [
        "Resting heart rate is steady at 68 bpm with normal sinus rhythm.",
        "Blood pressure is down to 128/82 mmHg (down from 144/90 in March).",
        "Kidney filtration (eGFR: 68 mL/min) remains stable for his age group."
      ],
      watchOuts: [
        "LDL cholesterol is 135 mg/dL (goal is under 100 mg/dL for cardiac history).",
        "HbA1c is 6.8% (slightly elevated; indicates pre-diabetes / mild diabetes).",
        "Mild ankle swelling noted when standing for long periods in hot weather."
      ],
      doctorActions: [
        "Increase Atorvastatin from 20mg to 40mg taken at bedtime.",
        "Schedule a follow-up lipid panel in 90 days (January 2027).",
        "Check home blood pressure twice weekly before breakfast and note in logbook."
      ]
    },
    medications: [
      {
        id: "med-1",
        name: "Lisinopril",
        brand: "Prinivil / Zestril",
        dosage: "10 mg",
        frequency: "Once daily in the morning",
        timeSlot: "Morning",
        purpose: "Controls blood pressure and protects kidneys",
        instructions: "Take with a glass of water right after breakfast. If you feel dizzy when getting up from bed, sit on the edge of the bed for 1 minute before standing.",
        foodWarning: "Avoid potassium salt substitutes (like NoSalt) without asking doctor.",
        remainingPills: 24,
        color: "#3B82F6",
        pillShape: "Round white tablet"
      },
      {
        id: "med-2",
        name: "Atorvastatin",
        brand: "Lipitor",
        dosage: "40 mg (Newly adjusted)",
        frequency: "Once daily at bedtime",
        timeSlot: "Bedtime",
        purpose: "Lowers LDL cholesterol and protects blood vessels",
        instructions: "Take every night before sleeping. Call clinic if you experience unusual persistent muscle aches.",
        foodWarning: "Do not drink grapefruit juice or eat fresh grapefruit.",
        remainingPills: 30,
        color: "#8B5CF6",
        pillShape: "Oval white scored tablet"
      },
      {
        id: "med-3",
        name: "Metformin ER",
        brand: "Glucophage XR",
        dosage: "500 mg",
        frequency: "Once daily with dinner",
        timeSlot: "Evening",
        purpose: "Helps regulate blood sugar levels",
        instructions: "Take right in the middle of dinner. Swallowing with food prevents stomach upset.",
        foodWarning: "Limit alcohol; stay well hydrated throughout the day.",
        remainingPills: 18,
        color: "#10B981",
        pillShape: "Large white oblong tablet"
      },
      {
        id: "med-4",
        name: "Baby Aspirin",
        brand: "Bayer Chewable / Low Dose",
        dosage: "81 mg",
        frequency: "Once daily in the morning",
        timeSlot: "Morning",
        purpose: "Keeps blood flowing smoothly through heart vessels",
        instructions: "Take with breakfast. Do not take on an empty stomach.",
        foodWarning: "Inform surgeon or dentist before any procedures.",
        remainingPills: 45,
        color: "#F59E0B",
        pillShape: "Small yellow round tablet"
      }
    ],
    labResults: [
      {
        testName: "Total Cholesterol",
        value: 218,
        unit: "mg/dL",
        referenceRange: "< 200",
        status: "High",
        statusColor: "amber",
        seniorMeaning: "Overall cholesterol in the blood. A little higher than desired, but controllable with your adjusted evening statin.",
        whyTested: "Monitors heart attack and stroke prevention."
      },
      {
        testName: "LDL Cholesterol ('Bad')",
        value: 135,
        unit: "mg/dL",
        referenceRange: "< 100",
        status: "Elevated",
        statusColor: "amber",
        seniorMeaning: "The cholesterol particles that can cause buildup in blood vessels. Your doctor wants this below 100.",
        whyTested: "Primary target for cholesterol medicine adjustment."
      },
      {
        testName: "HDL Cholesterol ('Good')",
        value: 52,
        unit: "mg/dL",
        referenceRange: "> 40",
        status: "Normal",
        statusColor: "green",
        seniorMeaning: "Helpful cholesterol that sweeps away bad fat from your arteries. Your number is in a good protective range.",
        whyTested: "Shows natural cardiovascular protection."
      },
      {
        testName: "Blood Sugar (HbA1c)",
        value: 6.8,
        unit: "%",
        referenceRange: "< 5.7% (Goal < 7.0% for seniors)",
        status: "Borderline",
        statusColor: "amber",
        seniorMeaning: "Your average blood sugar over the past 3 months. For someone your age, keeping it around 6.8% - 7.0% is a safe, gentle goal.",
        whyTested: "Screens for diabetes control without causing dangerous low-sugar episodes."
      },
      {
        testName: "Kidney Function (eGFR)",
        value: 68,
        unit: "mL/min",
        referenceRange: "> 60",
        status: "Normal",
        statusColor: "green",
        seniorMeaning: "How well your kidneys are filtering fluids. A number over 60 is completely normal and healthy for 76 years old.",
        whyTested: "Ensures medicines like Lisinopril and Metformin are safe to continue."
      },
      {
        testName: "Potassium",
        value: 4.4,
        unit: "mEq/L",
        referenceRange: "3.5 - 5.0",
        status: "Optimal",
        statusColor: "green",
        seniorMeaning: "An essential mineral for heart rhythm. It is perfectly in balance.",
        whyTested: "Monitored because blood pressure pills can change potassium levels."
      }
    ],
    fullRawText: `METRO HEART & VASCULAR CENTER
PATIENT VISIT SUMMARY & DIAGNOSTIC LABS
Patient: Arthur Miller | DOB: 1950-04-12 (Age 76)
Provider: Dr. Sarah Chen, MD, FACC (Cardiology)
Date of Service: October 1, 2026
Encounter Type: Routine Follow-up & Comprehensive Metabolic Review

VITAL SIGNS:
- Blood Pressure: 128/82 mmHg (Sitting, Right Arm)
- Heart Rate: 68 bpm, regular
- SpO2: 98% room air
- Weight: 178 lbs (down 2 lbs from prior visit)

CHIEF COMPLAINT / HISTORY OF PRESENT ILLNESS:
Arthur reports overall good exercise tolerance, walking 20 minutes around the neighborhood 4-5 mornings per week. Denies chest pain, orthopnea, or palpitations. Occasional bilateral dependent lower extremity edema in the late afternoon, easily managed by elevating legs while watching television.

ASSESSMENT & CLINICAL IMPRESSION:
1. Essential Hypertension (I10) - Well-controlled on current ACE inhibitor therapy.
2. Mixed Hyperlipidemia (E78.2) - Suboptimally controlled. LDL remains at 135 mg/dL; target for this patient's ASCVD profile is < 100 mg/dL.
3. Type 2 Diabetes Mellitus without complications (E11.9) - Fair glycemic control; HbA1c 6.8%.
4. Chronic Kidney Disease Stage 2 (N18.2) - Stable; eGFR 68 mL/min/1.73m2.

PLAN & MEDICATION ADJUSTMENTS:
1. Increase Atorvastatin to 40 mg PO QHS (once daily at bedtime).
2. Continue Lisinopril 10 mg PO QAM (once daily in morning).
3. Continue Metformin XR 500 mg PO with evening meal.
4. Continue Aspirin 81 mg PO daily with breakfast.
5. Patient instructed on low sodium intake (< 2000 mg/day) and avoiding grapefruit.
6. Return to clinic in 3 months with repeat lipid panel.`
  },
  {
    id: "rec-evelyn-ortho",
    title: "Dr. Vance Visit Summary — Knee Recovery & Pain Management",
    patientName: "Evelyn Vance",
    patientAge: 72,
    doctorName: "Dr. Marcus Vance, MD (Orthopedic Surgeon)",
    clinicName: "Cascade Orthopedic & Joint Institute",
    date: "September 24, 2026",
    docType: "Post-Op Clinical Visit",
    statusBadge: "Recovering Well",
    summary: {
      plainEnglish: "Evelyn is 6 weeks post-surgery for her right knee replacement and doing wonderfully! The incision is completely closed and dry. Her knee bend (flexion) has reached 112 degrees, which is ahead of schedule. She is stepping down off stronger pain medications onto gentle Tylenol as needed.",
      goodNews: [
        "Knee bend (range of motion) is at 112 degrees (goal was 100).",
        "Surgical incision is clean, dry, and healing without redness or drainage.",
        "Walking independently with a cane; transitioning off walker."
      ],
      watchOuts: [
        "Do not double up on pain medications containing Acetaminophen (max 3,000 mg/day).",
        "Remember to wear compression stockings on long car rides.",
        "Ice knee for 15 minutes after physical therapy exercises to keep swelling down."
      ],
      doctorActions: [
        "Continue physical therapy twice a week for 4 more weeks.",
        "Stop taking Celecoxib (anti-inflammatory) at the end of this week.",
        "Final post-op X-ray scheduled for November 12, 2026."
      ]
    },
    medications: [
      {
        id: "med-5",
        name: "Acetaminophen Extended Release",
        brand: "Tylenol 8HR Muscle & Joint",
        dosage: "650 mg",
        frequency: "1 tablet every 8 hours as needed for joint soreness",
        timeSlot: "Afternoon",
        purpose: "Relieves joint pain and stiffness gently without upsetting stomach",
        instructions: "Take with water. Do not exceed 4 tablets in 24 hours.",
        foodWarning: "Avoid alcoholic beverages while taking pain relief.",
        remainingPills: 40,
        color: "#EC4899",
        pillShape: "Red & white caplet"
      },
      {
        id: "med-6",
        name: "Calcium with Vitamin D3",
        brand: "Citracal + D3",
        dosage: "600 mg / 1000 IU",
        frequency: "Twice daily with meals",
        timeSlot: "Morning",
        purpose: "Strengthens bones and supports surgical joint bone-growth",
        instructions: "Take one with breakfast and one with dinner.",
        foodWarning: "Separate from thyroid medications by at least 4 hours.",
        remainingPills: 50,
        color: "#F97316",
        pillShape: "Large smooth white oval"
      }
    ],
    labResults: [
      {
        testName: "Hemoglobin",
        value: 12.8,
        unit: "g/dL",
        referenceRange: "12.0 - 15.5",
        status: "Normal",
        statusColor: "green",
        seniorMeaning: "Red blood cell level. Shows full recovery from surgical blood loss; no anemia.",
        whyTested: "Monitors recovery after joint replacement surgery."
      },
      {
        testName: "WBC (White Blood Count)",
        value: 6.2,
        unit: "x10^3/uL",
        referenceRange: "4.5 - 11.0",
        status: "Normal",
        statusColor: "green",
        seniorMeaning: "Your body's immune cells. A normal count confirms there is no joint or incision infection.",
        whyTested: "Screens for post-operative joint infection."
      },
      {
        testName: "Platelets",
        value: 235,
        unit: "x10^3/uL",
        referenceRange: "150 - 450",
        status: "Optimal",
        statusColor: "green",
        seniorMeaning: "Cells that help blood clot properly. Well within safe zone.",
        whyTested: "Verified before stepping down post-surgery blood thinners."
      }
    ],
    fullRawText: `CASCADE ORTHOPEDIC & JOINT INSTITUTE
POST-OPERATIVE FOLLOW-UP REPORT (6 WEEKS)
Patient: Evelyn Vance | DOB: 1954-08-19 (Age 72)
Surgeon: Dr. Marcus Vance, MD, FAAOS
Procedure: Right Total Knee Arthroplasty (TKA)
Date of Evaluation: September 24, 2026

SUBJECTIVE:
Patient arrives walking with single-point cane. States pain has decreased significantly, rating it 2/10 at rest and 4/10 after physical therapy. Denies calf pain, shortness of breath, fever, or chills. Sleeping comfortably with pillow support under lower leg.

PHYSICAL EXAMINATION:
- Right Knee Incision: Well-healed, staples removed at week 2. No erythema, warmth, or exudate.
- Range of Motion: Active extension 0 degrees (full), active flexion 112 degrees. Excellent quadriceps lag recovery.
- Neurovascular: Distal pulses 2+ DP/PT, sensation intact to light touch throughout L4-S1 dermatomes.
- Calves: Soft, non-tender, negative Homan's sign bilaterally.

RECOMMENDATIONS:
1. Transition off prescription Celecoxib; manage residual stiffness with OTC Acetaminophen ER 650mg PRN.
2. Advance physical therapy to closed-kinetic chain balance and quad strengthening exercises.
3. May resume gentle driving since surgical leg has brisk brake reaction time.
4. Follow-up clinic appointment with orthogonal radiographs in 6 weeks.`
  }
];

export const seniorCareTips = [
  {
    title: "Always Keep Water by the Bedside",
    description: "Staying hydrated helps blood pressure medicines work evenly and prevents sudden morning dizziness."
  },
  {
    title: "Never Split Pills Unless Scored",
    description: "Extended-release tablets (labeled ER or XR) must be swallowed whole to avoid releasing medicine all at once."
  },
  {
    title: "Bring Your Pill Bottles to Appointments",
    description: "Even with digital charts, doctors love seeing your actual pill bottles to verify dosages and refill numbers."
  }
];
