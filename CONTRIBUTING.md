# Contributing to Chancellor AI 360 🏛️

Thank you for your interest in contributing to **Chancellor AI 360** — an intelligent, interactive digital tribute honoring **Kunwar Shekhar Vijendra** (Co-Founder & Hon'ble Chancellor, Shobhit University).

We welcome contributions from students, faculty, developers, and researchers. Whether you're fixing a bug, adding an archival milestone, improving voice synthesis, or optimizing stage animations, your help is appreciated.

---

## 📋 Code of Conduct

As an initiative celebrating education, ethics, and Gandhian values, we expect all contributors to:
* **Exercise Respect & Inclusivity:** Treat all community members with courtesy and kindness.
* **Preserve Archival Integrity:** Ensure all biographical data, milestones, and quotes attributed to the Chancellor are factual, verified, and backed by citations.
* **Practice Clean Engineering:** Adhere to clean code, SOLID principles, and thorough testing.

---

## 🏗️ Repository Architecture

The project is structured as a full-stack monorepo:

```
chancellor-ai-360/
├── backend/                  # Python 3.10+ FastAPI Application
│   ├── app/
│   │   ├── data/            # Curated archival JSON & deep research records
│   │   ├── services/        # KnowledgeService, AIService (OpenRouter), TTSService, WishManager
│   │   ├── models.py        # Pydantic v2 schemas
│   │   └── main.py          # REST & WebSocket route handlers
│   ├── tests/               # Pytest unit and integration test suite
│   └── requirements.txt     # Python dependencies
├── frontend/                 # Next.js 16 (App Router) + Tailwind CSS + Framer Motion
│   ├── src/
│   │   ├── app/             # Main Stage View (`/`) and Mobile Portal (`/wish`)
│   │   ├── components/      # UI components (Navbar, HeroSection, WisdomPortal, etc.)
│   │   ├── hooks/           # Web Speech Recognition & Neural Audio synthesis
│   │   └── lib/             # API gateways and client helpers
│   └── public/              # Photos, emblems, and static assets
└── start_demo.sh            # One-click master presentation launcher
```

---

## 🚀 Setting Up Local Development

### 1. Prerequisites
Ensure you have the following installed:
* **Node.js**: v18.18 or higher (v20+ recommended)
* **Python**: v3.10, v3.11, or v3.12+
* **npm** or **pnpm**
* **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/chiggosVikash/chancelor-ai-360.git
cd chancellor-ai-360
```

### 3. Backend Setup (FastAPI)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Create your local environment configuration
cp .env.example .env 2>/dev/null || cat << 'ENVEOF' > .env
OPENROUTER_API_KEY=your_openrouter_key_here
OPENROUTER_MODEL=google/gemini-2.5-flash-lite
GEMINI_API_KEY=
ENVIRONMENT=development
ENVEOF

# Run the backend dev server
export PYTHONPATH=.
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The API documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

### 4. Frontend Setup (Next.js)
In a new terminal window:
```bash
cd frontend
npm install

# Create frontend environment config
cat << 'ENVEOF' > .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws/wishes
ENVEOF

# Run the frontend dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Testing Guidelines

Before opening a pull request, always verify that all tests and builds pass:

### Backend Testing (Pytest)
```bash
cd backend
source .venv/bin/activate
PYTHONPATH=. pytest tests/ -v
```
*All 15 automated test cases must pass.*

### Frontend Verification (Next.js Build)
```bash
cd frontend
npm run build
```
*Must compile cleanly with zero TypeScript or Turbopack errors.*

---

## 🌿 Contribution Workflow

1. **Fork the Repository:** Create your own fork on GitHub.
2. **Create a Feature Branch:**
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```
3. **Commit Your Changes:** Use clear, conventional commit messages:
   * `feat: add new archival timeline milestone`
   * `fix: improve audio playback state in WisdomPortal`
   * `perf: optimize WebSocket reconnection backoff`
   * `docs: update setup instructions`
4. **Push to Your Fork:**
   ```bash
   git push origin feat/your-feature-name
   ```
5. **Open a Pull Request:** Submit a PR targeting the `master` branch with:
   - A clear description of the problem solved or feature added.
   - Screenshots or video recordings for UI changes.
   - Confirmation that automated tests pass.

---

## 🎨 Design & Coding Standards

* **Aesthetics:** Follow the warm light mode design system (`#FAF8F4` cream canvas, `#1E2D5A` Shobhit Navy, `#B8862C` Gold accents, Cormorant Garamond display font).
* **Framer Motion:** Use spring physics presets (`stiffness: 300-500`, `damping: 25-30`) instead of linear CSS easing.
* **Stage Reliability:** Never introduce changes that can throw uncaught exceptions on stage. Cloud AI calls must always have graceful deterministic fallbacks.
* **Audio & Accessibility:** Always respect `isSpeaking` states and provide visible text alternatives for audio narration.

---

## 📄 License & Attribution

By contributing, you agree that your contributions will be licensed under the project's repository license. All historical records, speeches, and likeness of **Kunwar Shekhar Vijendra** remain intellectual assets of Shobhit University and the Chancellor's Office.
