# VillageHealth AI (கிராம சுகாதாரம் AI)

> **Bilingual (English & தமிழ்) Offline-First AI Health Triage, Real-Time Blood Bank Portal, and Rural Emergency Assistant**

![License](https://img.shields.io/badge/License-MIT-emerald.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)
![Firebase](https://img.shields.io/badge/Firebase-RTDB-amber.svg)
![Gemini](https://img.shields.io/badge/Gemini-3.6%20Flash-green.svg)

---

## ✨ Features

### 1. 🩸 Real-Time Blood Bank & Donor Portal
- **Live Stock Search**: Query real-time availability across all 8 blood groups (`A+`, `A-`, `B+`, `B-`, `O+`, `O-`, `AB+`, `AB-`) by district.
- **Urgent Request Broadcaster**: Broadcast emergency blood requests to nearby blood banks and registered voluntary donors.
- **Donor Registry**: Allows citizens to register as donors with availability status.
- **Hospital Dashboard**: Portal for duty officers to update stock levels on the fly.
- **Powered by Firebase Realtime Database**: WebSockets `onValue` listeners auto-sync updates without page refresh.

### 2. 🤖 Bilingual AI Health Triage Chat
- Powered by **Google Gemini 3.6 Flash** with medical web grounding references.
- 2-Stage Fallback Architecture to handle API rate limits gracefully.
- Automatic detection of critical symptoms with single-click Telemedicine escalation.

### 3. 🎙️ Hands-Free Live Voice Assistant
- **Speech-to-Text (STT)** dictation supporting Tamil (`ta-IN`) and English (`en-IN`).
- **Text-to-Speech (TTS)** voice output with explicit Chrome audio context unblocking (`speechSynthesis.resume()`).
- Replay audio response button & bilingual sample prompts.

### 4. 📍 GPS Clinic & Specialist Locator
- Detects user W3C Geolocation coordinates.
- Filters nearby centers by medical need: **Pediatrics**, **Cardiology**, **Emergency**, **General Medicine**, **Maternity**, and **Pharmacies**.
- Direct Google Maps routing & single-tap phone dialer (`tel:112`/`tel:108`).

### 5. 💊 Pill & Medication Guide
- Plain-language guidelines for common community medicines (Paracetamol, ORS, Amoxicillin, Cetirizine, Metformin).
- Gemini-powered deep search for dosage, food interactions, precautions, and generic alternatives.

### 6. 🩺 Interactive Symptom Risk Calculator
- Multi-step region & symptom selector with red-flag screening.
- Calculates clinical risk level (Low, Moderate, High Emergency) and recommends immediate actions.

### 7. 🏥 Offline First-Aid & Emergency Cards
- Offline emergency cards with visual DOs & DON'Ts:
  - 🐍 **Snakebite & Scorpion**: Immobilization, panic reduction, zero tourniquets.
  - ☀️ **Heatstroke & WHO ORS**: Official WHO home ORS formula (1L water + 6 tsp sugar + ½ tsp salt).
  - 🐕 **Dog & Animal Bite**: 15-minute soap water wash + Anti-Rabies Vaccine schedule.
  - 🔥 **Burns & Scalds**: Cool water treatment, sterile dressing.
  - 🫀 **CPR Protocol**: Hands-only compression (100–120 BPM).

### 8. 👶 Child Immunization Tracker
- Complete vaccine schedule from **Birth to 24 Months** based on India's National Immunization Schedule (NIS).
- Dynamic progress tracker visualization.

### 9. 🏛️ Government Health Schemes & Aids Portal
- Bilingual guide for state & central healthcare welfare benefits:
  - **CMCHIS (TN)** — Chief Minister's Insurance up to ₹5 Lakhs.
  - **PM-JAY (Ayushman Bharat)** — Central cashless secondary & tertiary hospitalization.
  - **Makkalai Thedi Maruthuvam (TN)** — Doorstep medicine delivery.
  - **Dr. Muthulakshmi Reddy & PMMVY** — ₹18,000 maternal financial aid.
  - **Jan Aushadhi** — 50–90% discounted generic drugs.

### 10. 🛰️ Satellite SOS Emergency Beacon
- Simulates emergency signaling over the `406.025 MHz COSPAS-SARSAT` frequency.
- Encodes lat/lng/altitude telemetry with single-tap dispatch to `112` / `108`.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Build System**: Vite v6
- **Real-Time Database**: Firebase Realtime Database v10
- **AI Engine**: Google Gemini 3.6 Flash (`@google/genai`)
- **Speech**: Web Speech Synthesis & Recognition API

---

## 🚀 Local Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- Free [Gemini API Key](https://aistudio.google.com)
- Free [Firebase Project](https://console.firebase.google.com) with Realtime Database enabled

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/deiwick/Villagehealth_A.I.git
   cd villagehealth-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and add your keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_APP_ID=1:your_app_id:web:your_web_id
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000/`.

---

## 🌐 Deploying to GitHub & Vercel

### Step 1: Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit: VillageHealth AI with Realtime Blood Bank & Gemini Triage"
git branch -M main
git remote add origin https://github.com/deiwick/Villagehealth_A.I.git
git push -u origin main
```

### Step 2: Deploy to Vercel (Recommended)
1. Go to [Vercel](https://vercel.com) and click **Add New Project**.
2. Import your `Villagehealth_A.I` GitHub repository.
3. In **Environment Variables**, add:
   - `GEMINI_API_KEY`
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_DATABASE_URL`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_APP_ID`
4. Click **Deploy**!

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
