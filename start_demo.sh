#!/bin/bash
# Chancellor AI 360 — Live Stage Launcher Script

echo "================================================================="
echo "  🏛️ CHANCELLOR AI 360 — BIRTHDAY TRIBUTE PRESENTATION LAUNCHER"
echo "  Honoring Kunwar Shekhar Vijendra (Hon'ble Chancellor, Shobhit Univ)"
echo "================================================================="

# Trap exit signals to cleanly kill child background processes
cleanup() {
  echo ""
  echo "Stopping Chancellor AI 360 services..."
  kill $(jobs -p) 2>/dev/null
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 1. Start Python FastAPI Backend on Port 8000
echo "🚀 [1/2] Starting FastAPI Backend on http://localhost:8000 ..."
cd "$(dirname "$0")/backend"
source .venv/bin/activate
export PYTHONPATH=.
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Give backend a moment to spin up
sleep 2

# 2. Start Next.js Frontend on Port 3000
echo "✨ [2/2] Starting Next.js Presentation Frontend on http://localhost:3000 ..."
cd "$(dirname "$0")/frontend"
npm run dev -- -p 3000 &
FRONTEND_PID=$!

echo ""
echo "================================================================="
echo "  ✅ CHANCELLOR AI 360 IS RUNNING LIVE!"
echo "  • Main Stage Presentation Display: http://localhost:3000"
echo "  • Mobile Student Wish Portal:     http://localhost:3000/wish"
echo "  • Backend API & WebSocket Hub:    http://localhost:8000"
echo ""
echo "  💡 TIP FOR AUDITORIUM MOBILE ACCESS (4G/5G):"
echo "     To let students submit wishes from their own phone data without"
echo "     campus Wi-Fi restrictions, run in a separate terminal:"
echo "     npx localtunnel --port 3000"
echo "================================================================="
echo "Press Ctrl+C to stop all services."

wait
