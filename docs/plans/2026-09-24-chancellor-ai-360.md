# Chancellor AI 360 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build "Chancellor AI 360", a celebratory, interactive digital tribute web platform for Kunwar Shekhar Vijendra (Hon'ble Chancellor, Shobhit University) featuring a voice-enabled AI biographical assistant, an interactive milestone photo journey, and a real-time mobile QR-powered student birthday wish constellation and tribute anthem generator.

**Architecture:** Python FastAPI backend with native WebSockets for sub-10ms stage synchronization and Google Gemini AI for contextual Q&A and poetic synthesis, paired with a Next.js (App Router) + Tailwind CSS frontend supporting a dual-view stage display (`/`) and mobile submission portal (`/wish`).

**Tech Stack:** Next.js (React 18/19), Tailwind CSS, Lucide React, Canvas Confetti, Web Speech API, Python 3.10+, FastAPI, Uvicorn, Pydantic v2, WebSockets, `google-genai`, pytest.

---

### Task 1: Backend Foundation & Core Pydantic Schemas

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/app/models.py`
- Test: `backend/tests/test_models.py`

**Step 1: Write the failing test**
```python
# backend/tests/test_models.py
import pytest
from backend.app.models import StudentWish, Milestone, ChatQuery, ChatResponse

def test_student_wish_validation():
    wish = StudentWish(
        id="wish_1",
        student_name="Aarav Sharma",
        department="B.Tech Computer Science",
        message="Happy Birthday Chancellor Sir! Thank you for inspiring us.",
        timestamp="2026-09-24T15:00:00Z"
    )
    assert wish.student_name == "Aarav Sharma"
    assert wish.avatar_color is not None

def test_milestone_schema():
    m = Milestone(
        id="m_1989",
        year="1989",
        title="Founding of NICE Society",
        category="Education",
        summary="Establishment of NICE Society, laying the foundation for Shobhit University.",
        narrative="In 1989, Kunwar Shekhar Vijendra pioneered...",
        photos=["/photos/1989_founding.jpg"],
        citations=["Shobhit University Foundation Charter, 1989"]
    )
    assert m.year == "1989"
```

**Step 2: Run test to verify it fails**
Run: `pytest backend/tests/test_models.py`
Expected: FAIL with `ModuleNotFoundError: No module named 'backend.app.models'`

**Step 3: Write minimal implementation**
Create `backend/app/models.py`:
```python
from pydantic import BaseModel, Field
from typing import List, Optional

class StudentWish(BaseModel):
    id: str
    student_name: str
    department: str
    message: str
    timestamp: str
    avatar_color: Optional[str] = "#F59E0B"

class Milestone(BaseModel):
    id: str
    year: str
    title: str
    category: str
    summary: str
    narrative: str
    photos: List[str] = []
    citations: List[str] = []

class ChatQuery(BaseModel):
    question: str
    include_citations: bool = True

class ChatResponse(BaseModel):
    answer: str
    citations: List[str] = []
    suggested_followups: List[str] = []

class TributeGenerationRequest(BaseModel):
    filter_department: Optional[str] = None
    language: str = "bilingual"  # english, hindi, or bilingual
```

**Step 4: Run test to verify it passes**
Run: `pytest backend/tests/test_models.py`
Expected: PASS

---

### Task 2: Curated Knowledge Base & Milestone Service

**Files:**
- Create: `backend/app/data/chancellor_profile.json`
- Create: `backend/app/services/knowledge_service.py`
- Test: `backend/tests/test_knowledge_service.py`

**Step 1: Write the failing test**
```python
# backend/tests/test_knowledge_service.py
from backend.app.services.knowledge_service import KnowledgeService

def test_load_chancellor_profile():
    service = KnowledgeService()
    profile = service.get_chancellor_overview()
    assert "Kunwar Shekhar Vijendra" in profile["name"]
    assert len(profile["core_pillars"]) > 0

def test_search_milestones():
    service = KnowledgeService()
    results = service.find_milestones(query="1989")
    assert len(results) >= 1
    assert results[0].year == "1989"
```

**Step 2: Run test to verify it fails**
Run: `pytest backend/tests/test_knowledge_service.py`
Expected: FAIL with `No module named 'backend.app.services.knowledge_service'`

**Step 3: Write minimal implementation**
- Populate `backend/app/data/chancellor_profile.json` with official documented initiatives:
  - 1989: Founding of NICE (National Institute of Computer Education) Society.
  - 2000: Establishment of Shobhit Institute of Engineering & Technology, Meerut.
  - 2006: Granted Deemed-to-be-University status under section 3 of UGC Act.
  - 2012: Establishment of Shobhit University, Gangoh, Saharanpur under UP State Act.
  - Healthcare & Ayurveda: Shobhit Ayurvedic Medical College & Research Centre, Naturopathy, Yogic Sciences.
  - Global Engagements: Representation at UN/UNESCO youth dialogues, ASSOCHAM National Council on Education leadership.
  - Core Philosophies: "Empowering Nation Through Education", rural youth upliftment, ethical leadership.
- Implement `KnowledgeService` in `backend/app/services/knowledge_service.py`.

**Step 4: Run test to verify it passes**
Run: `pytest backend/tests/test_knowledge_service.py`
Expected: PASS

---

### Task 3: Real-Time Wish Manager & WebSockets

**Files:**
- Create: `backend/app/services/wish_manager.py`
- Modify: `backend/app/main.py`
- Test: `backend/tests/test_wish_manager.py`

**Step 1: Write the failing test**
```python
# backend/tests/test_wish_manager.py
import pytest
from backend.app.services.wish_manager import WishManager
from backend.app.models import StudentWish

@pytest.mark.asyncio
async def test_add_and_retrieve_wish():
    manager = WishManager()
    wish = StudentWish(
        id="w1",
        student_name="Pooja Verma",
        department="Biotechnology",
        message="Happy Birthday Sir! You are our constant motivation.",
        timestamp="2026-09-24T15:00:00Z"
    )
    await manager.add_wish(wish)
    wishes = manager.get_all_wishes()
    assert len(wishes) == 1
    assert wishes[0].student_name == "Pooja Verma"
```

**Step 2: Run test to verify it fails**
Run: `pytest backend/tests/test_wish_manager.py`
Expected: FAIL

**Step 3: Write minimal implementation**
- Implement `WishManager` with in-memory list, sample starter wishes, and `ConnectionManager` for WebSockets.
- Connect endpoints in `main.py`:
  - `POST /api/wishes` (accepts wish, broadcasts to active WS connections)
  - `GET /api/wishes` (returns recent wishes)
  - `WebSocket /ws/wishes` (streams new wishes to stage screen)

**Step 4: Run test to verify it passes**
Run: `pytest backend/tests/test_wish_manager.py`
Expected: PASS

---

### Task 4: AI Service (Gemini Q&A + Birthday Tribute Synthesis + Fail-Safe Cache)

**Files:**
- Create: `backend/app/services/ai_service.py`
- Test: `backend/tests/test_ai_service.py`

**Step 1: Write the failing test**
```python
# backend/tests/test_ai_service.py
import pytest
from backend.app.services.ai_service import AIService
from backend.app.models import StudentWish

@pytest.mark.asyncio
async def test_fallback_chat_query():
    service = AIService()
    response = await service.answer_question("Tell me about the founding of Shobhit University in 1989")
    assert response.answer is not None
    assert len(response.citations) > 0

@pytest.mark.asyncio
async def test_poem_synthesis_fallback():
    service = AIService()
    wishes = [
        StudentWish(id="1", student_name="Rahul", department="AI & DS", message="Happy Birthday Sir!", timestamp="now")
    ]
    tribute = await service.generate_birthday_tribute(wishes)
    assert len(tribute["poem_stanzas"]) > 0
```

**Step 2: Run test to verify it fails**
Run: `pytest backend/tests/test_ai_service.py`
Expected: FAIL

**Step 3: Write minimal implementation**
- Implement `AIService`:
  - Uses `google-genai` when `GEMINI_API_KEY` is present.
  - System prompt enforces the **Respectful AI Digital Archivist & Tribute Guide** persona.
  - Fallback cache with verified Q&A responses so that if offline or API key is absent, stage demo operates flawlessly.
  - Poetic synthesis endpoint: summarizes student feelings and creates an inspiring birthday anthem with English and Hindi celebratory couplets (Shayari).

**Step 4: Run test to verify it passes**
Run: `pytest backend/tests/test_ai_service.py`
Expected: PASS

---

### Task 5: Next.js Frontend Scaffolding & Theme Design Tokens

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/tailwind.config.js`
- Create: `frontend/src/app/globals.css`
- Create: `frontend/src/app/layout.tsx`

**Step 1: Setup Next.js with Tailwind and Lucide**
Run non-interactive initialization or standard package configuration with Tailwind CSS, Lucide React, and Canvas Confetti.

**Step 2: Implement Regal Tribute Color Tokens**
- Background: Deep Royal Academic Navy (`#0A1128`, `#001F54`)
- Accents: Celebratory Gold & Amber (`#D4AF37`, `#F59E0B`)
- Glassmorphism: `backdrop-blur-md bg-white/5 border border-white/10`
- Typography: Elegant serif headers + clean modern sans-serif body.

**Step 3: Verify build**
Run: `npm run build` in `frontend/`
Expected: PASS

---

### Task 6: Feature 1 — "Talk to Chancellor AI" Component

**Files:**
- Create: `frontend/src/components/TalkToChancellor.tsx`
- Create: `frontend/src/hooks/useSpeechRecognition.ts`
- Create: `frontend/src/hooks/useSpeechSynthesis.ts`

**Step 1: Implement Voice Recognition & Audio Narration Hooks**
- Hook uses `window.webkitSpeechRecognition` or `window.SpeechRecognition` with graceful fallback to typed text.
- Speech synthesis with voice selection and toggle mute/unmute.

**Step 2: Build Interactive Assistant UI**
- Interactive glowing microphone button with sound wave animation.
- Instant suggested stage questions (e.g., *"What is your vision for rural education?"*, *"Tell us about the founding of NICE in 1989"*, *"What are your thoughts on Ayurveda and modern medicine?"*).
- Citation badges linking to official university documents.

---

### Task 7: Feature 2 — "Explore His Journey" Component

**Files:**
- Create: `frontend/src/components/MilestoneExplorer.tsx`
- Create: `frontend/src/components/MilestoneCard.tsx`

**Step 1: Implement Timeline Navigation & Search**
- Category filter tabs: All, Education & Vision, Healthcare & Ayurveda, Global Leadership, Youth Empowerment.
- Search input: Type any year or topic (e.g., "Gangoh campus", "Ayurveda hospital", "1989").

**Step 2: Render Archival Cards & Narratives**
- Display photographic cards with zoom modal.
- Micro-narrative drawer explaining the historical significance and impact of each milestone.

---

### Task 8: Feature 3 — "A Special Birthday Surprise" Stage Wall

**Files:**
- Create: `frontend/src/components/WishConstellation.tsx`
- Create: `frontend/src/components/BirthdaySurpriseModal.tsx`

**Step 1: Real-time WebSocket Wish Stream**
- Connects to `/ws/wishes`.
- Displays dynamic floating wish cards and constellation heart counters that update immediately when students post.
- QR Code component on screen directing audience to `${window.location.origin}/wish`.

**Step 2: Grand Reveal Trigger**
- "Generate Chancellor's Birthday Tribute" button.
- Triggers confetti explosion (`canvas-confetti`).
- Displays synthesized tribute poem stanza-by-stanza with audio narration and celebratory chimes.

---

### Task 9: Student Mobile Wish Submission Portal (`/wish`)

**Files:**
- Create: `frontend/src/app/wish/page.tsx`
- Create: `frontend/src/components/MobileWishForm.tsx`

**Step 1: Lightweight Mobile Form**
- Student Name, Department/Course dropdown (e.g., Computer Science, Ayurveda, Law, Agriculture, Biotech), and Heartfelt Birthday Wish text area.
- Instant feedback and celebratory particle animation on submit.
- Pre-filled sample wishes for fast one-tap submission.

---

### Task 10: End-to-End Stage Verification & Rehearsal Test

**Files:**
- Create: `backend/tests/test_e2e_flow.py`

**Step 1: Run comprehensive integration tests**
- Verify WebSocket connection broadcasting.
- Verify fallback behavior when offline.
- Verify QR code URL generation.

**Step 2: Stage Rehearsal Checklist**
1. Start FastAPI backend (`uvicorn app.main:app --port 8000 --reload`).
2. Start Next.js frontend (`npm run dev`).
3. Open `http://localhost:3000` (Main Stage View).
4. Open `http://localhost:3000/wish` on mobile / second tab and submit a test wish.
5. Verify wish appears on stage screen in real time.
6. Test voice mic query in "Talk to Chancellor AI".
7. Click "Explore His Journey" milestone cards.
8. Click "Generate Birthday Tribute" and witness the grand reveal!
