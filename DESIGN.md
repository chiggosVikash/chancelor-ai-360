# Chancellor AI 360 — Architecture & System Design Document
**An Intelligent, Interactive Digital Tribute to Kunwar Shekhar Vijendra**
*(Co-Founder & Hon'ble Chancellor, Shobhit University)*

---

## 1. Project Overview & Understanding Summary

* **Project Name:** Chancellor AI 360
* **Occasion:** Commemorative Birthday Tribute & Live Interactive Demonstration.
* **Honoree:** Kunwar Shekhar Vijendra (Co-Founder & Chancellor, Shobhit University).
* **Core Purpose:** To deliver an engaging, elegant, and technologically cutting-edge live tribute that celebrates the Chancellor's life, educational philosophy, and social initiatives while engaging students and guests in real-time.
* **Demonstration Date:** Tomorrow (Sept 25, 2026).

### The Three Signature Demonstration Features

1. **Talk to Chancellor AI:**
   * Voice-enabled, dignified conversational tribute guide.
   * Answers questions about his life, documented milestones, and educational vision.
   * Provides verified source references and citations.
   * Equipped with live voice recognition (mic input), browser speech narration, on-screen subtitles, and quick-prompt suggestion chips for stage confidence.

2. **Explore His Journey:**
   * Interactive milestone explorer and visual timeline.
   * Connects natural language queries or timeline clicks to verified historical milestones (1989 NICE Society inception, university charters, Ayurveda & biotechnology ventures, international summits, rural empowerment).
   * Retrieves corresponding photographs, archival records, and delivers a compelling micro-narrative.
   * Includes a custom drop-in photo directory (`/backend/data/photos/`) for personal and event photographs.

3. **A Special Birthday Surprise:**
   * Real-time student mobile wish submission portal via on-screen QR code (`/wish`).
   * Main stage screen features an animated, glowing **Wish Constellation & Wall** that updates in real time (<10ms via WebSockets).
   * Generates a grand celebratory AI Birthday Poem / Tribute Anthem synthesized from all incoming student messages, complete with festive confetti animations, celebratory chimes, and voice recitation.

---

## 2. System Architecture & Tech Stack

```
   ┌────────────────────────────────────────────────────────┐
   │            Audience Mobile Devices (4G/5G)             │
   │      Scan QR Code -> Open /wish Mobile Web Portal      │
   └───────────────────────────┬────────────────────────────┘
                               │ HTTP POST /api/wishes
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │           FastAPI Backend Server (Python 3.10+)        │
   │  • /ws/wishes            -> Real-time WebSocket Hub    │
   │  • /api/chat             -> Gemini Q&A + Knowledge RAG │
   │  • /api/journey          -> Milestone & Photo Engine   │
   │  • /api/tribute/generate -> Poetic Synthesis Engine    │
   │  • In-Memory Wish Store  -> Instant Stage Sync         │
   └─────────────┬────────────────────────────▲─────────────┘
                 │ WebSocket Push (<10ms)     │ REST / SSE
                 ▼                            │
   ┌──────────────────────────────────────────┴─────────────┐
   │         Next.js + Tailwind CSS Stage Application       │
   │  • /                     -> Cinematic Stage Showcase   │
   │  • /wish                 -> Responsive Mobile Portal   │
   │  • Web Speech API        -> Speech-to-Text & TTS Voice │
   │  • Canvas Confetti       -> Celebratory Visual FX      │
   └────────────────────────────────────────────────────────┘
```

### Technology Selections
* **Frontend:** Next.js (App Router, React 18+), Tailwind CSS, Lucide React icons, Canvas Confetti.
* **Backend:** Python 3.10+, FastAPI, Uvicorn, Pydantic v2, WebSockets.
* **AI Engine:** Google Gemini API (`gemini-2.5-flash` / `gemini-1.5-flash`) via `google-genai` SDK.
* **Speech & Audio:** Web Speech API (`webkitSpeechRecognition` + `SpeechSynthesis`).
* **Stage Reliability:** In-memory cached responses & deterministic fallback milestone store for 100% fail-safe stage presentation.

---

## 3. Data Models & Schemas

### A. Student Wish Schema
```python
class StudentWish(BaseModel):
    id: str
    student_name: str
    department: str
    message: str
    timestamp: str
    avatar_color: Optional[str] = "#F59E0B"
```

### B. Milestone Schema
```python
class Milestone(BaseModel):
    id: str
    year: str
    title: str
    category: str  # "Education", "Healthcare & Ayurveda", "Global", "Social Impact"
    summary: str
    narrative: str
    photos: List[str]
    citations: List[str]
```

### C. Chat Request & Response
```python
class ChatQuery(BaseModel):
    question: str
    include_citations: bool = True

class ChatResponse(BaseModel):
    answer: str
    citations: List[str]
    suggested_followups: List[str]
```

---

## 4. Decision Log

| Decision | Chosen Option | Alternatives Considered | Rationale |
| :--- | :--- | :--- | :--- |
| **Workspace** | `/Users/vikashroy/Developer/chancellor-ai-360` (mirrored in scratch) | IDE scratch directory only | Explicitly requested by user in primary development folder. |
| **Frontend Framework** | Next.js + Tailwind CSS | Vite SPA; Plain HTML/JS | Production-grade routing (`/` and `/wish`), instant SSR, rich styling capabilities. |
| **Backend Framework** | Python + FastAPI | Node.js Express; Django | Native Python AI ecosystem, high-speed asynchronous WebSocket handling, clean Pydantic contracts. |
| **AI Intelligence** | Google Gemini API (`gemini-2.5-flash`) | OpenAI GPT-4o; Local Ollama | Fast latency (<1s), rich poetic and bilingual (English/Hindi) capability, verified context window. |
| **Voice Interaction** | Browser Web Speech API + SpeechSynthesis | Cloud ElevenLabs/Whisper | Zero network latency on stage, runs natively in-browser without expensive per-minute API dependencies. |
| **Stage Safety** | Deterministic Local Fallback | Pure cloud dependency | Guarantees stage demo runs without hitch even if auditorium Wi-Fi lags. |

---

## 5. Non-Functional Requirements & Guardrails

* **Performance:** Sub-second wish synchronization via WebSockets; <1.5s AI responses; 60fps animations.
* **Audience Scale:** Accommodates 50 to 500+ simultaneous wish submissions during the event.
* **Stage Safety:** Profanity and spam filtering on incoming student wishes prior to stage wall display.
* **Connectivity:** Works across local networks or public tunnels (`ngrok` / `localtunnel` / cloud deployment) for easy mobile data access.
