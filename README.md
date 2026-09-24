# 🏛️ Chancellor AI 360
### An Intelligent, Interactive Digital Birthday Tribute to Kunwar Shekhar Vijendra
*(Co-Founder & Hon'ble Chancellor, Shobhit University)*

**Chancellor AI 360** is a full-stack, voice-enabled commemorative application engineered for live stage presentation during the birthday celebrations of Hon'ble Chancellor Kunwar Shekhar Vijendra.

---

## 🌟 The Three Demonstration Features

1. **Talk to Chancellor AI (`/`)**
   * Voice-enabled conversational AI embodying a dignified **AI Digital Archivist & Tribute Guide**.
   * Answers questions regarding his life journey, 1989 NICE founding, Ayurveda medical college, research vision, and educational leadership.
   * Provides official source citations, interactive waveform feedback, and speech synthesis voice narration.

2. **Explore His Journey (`/`)**
   * Chronological and categorical milestone explorer.
   * Covers 1989 Inception of NICE Society, 2000 SIET Meerut, 2006 Deemed University Charter, 2012 Shobhit University Gangoh, 2014 Ayurvedic Medical College & Hospital, 2018 ASSOCHAM National Leadership, and 2022 AI/Biotech Centers.
   * Expandable micro-narratives with verified historical citations.

3. **A Special Birthday Surprise (`/` & `/wish`)**
   * **Audience Mobile Portal (`/wish`):** Students and faculty scan the on-screen QR code from their phones to submit real-time birthday wishes and select badge colors.
   * **Live Stage Constellation:** Incoming wishes stream to the presentation screen in real time (<10ms via WebSockets).
   * **Grand Reveal Anthem:** Synthesizes collective student messages into an inspiring celebratory birthday poem and anthem with celebratory confetti explosions and audio recitation.

---

## 📸 How to Add Custom Photographs of Chancellor Sir

To display your personal high-resolution photographs of Chancellor Sir:
1. Copy your photos into:
   ```bash
   frontend/public/photos/
   ```
   *(e.g., `frontend/public/photos/chancellor_portrait.jpg`, `frontend/public/photos/event_1989.jpg`)*
2. In `backend/app/data/chancellor_profile.json`, update the `"photos"` array for any milestone to point to `/photos/your_file_name.jpg`.

---

## 🚀 How to Launch Tomorrow's Demonstration

### Quick Launch (Single Command):
```bash
./start_demo.sh
```

### Or Manual Start:

#### Terminal 1 — Backend (FastAPI):
```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Terminal 2 — Frontend (Next.js):
```bash
cd frontend
npm run dev -- -p 3000
```

### URLs:
* **Main Stage Screen:** [http://localhost:3000](http://localhost:3000)
* **Mobile Wish Submission Portal:** [http://localhost:3000/wish](http://localhost:3000/wish)
* **Backend API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🌐 Public Access for Student Mobile Phones (4G/5G)

During the auditorium presentation, students can scan the QR code from their mobile data without connecting to campus Wi-Fi by running a tunnel:
```bash
npx localtunnel --port 3000
```
Then paste the tunnel URL into `NEXT_PUBLIC_API_URL` or open the tunnel URL directly on the presentation screen.

---

## 🔑 (Optional) Gemini API Key Configuration

The platform includes a **100% stage-safe deterministic local cache** that works completely offline with zero risk. To enable dynamic live Gemini AI generation:
```bash
export GEMINI_API_KEY="your_api_key_here"
```

---

## 🧪 Testing & Verification
To run all 15 automated backend tests:
```bash
source backend/.venv/bin/activate
PYTHONPATH=backend pytest backend/tests/
```
