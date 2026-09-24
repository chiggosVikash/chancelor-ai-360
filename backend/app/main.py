from dotenv import load_dotenv
load_dotenv()
# [SOLID: DIP] — FastAPI app wires dependencies into route handlers
# [SOLID: SRP] — Main entry point manages HTTP routing, CORS, and WebSocket protocol
import os
from typing import List, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.models import (
    StudentWish,
    Milestone,
    ChatQuery,
    ChatResponse,
    TributeGenerationRequest,
    BirthdayTributeResponse
)
from app.services.knowledge_service import KnowledgeService
from app.services.wish_manager import WishManager
from app.services.ai_service import AIService
from app.services.tts_service import TTSService
from fastapi.responses import Response

app = FastAPI(
    title="Chancellor AI 360 API",
    description="Interactive Digital Tribute Backend honoring Kunwar Shekhar Vijendra",
    version="1.0.0"
)

# Enable CORS for Next.js frontend and mobile devices on local/public networks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize core services
knowledge_service = KnowledgeService()
wish_manager = WishManager()
ai_service = AIService(knowledge_service=knowledge_service)

# Mount photos directory if it exists
photos_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "photos")
os.makedirs(photos_dir, exist_ok=True)
app.mount("/photos", StaticFiles(directory=photos_dir), name="photos")

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "Chancellor AI 360 API"}

@app.get("/api/overview")
async def get_overview():
    return knowledge_service.get_chancellor_overview()

@app.get("/api/milestones", response_model=List[Milestone])
async def get_milestones(
    query: str = Query("", description="Keyword or year search"),
    category: Optional[str] = Query(None, description="Category filter")
):
    return knowledge_service.find_milestones(query=query, category=category)

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_chancellor_ai(query: ChatQuery):
    return await ai_service.answer_question(
        question=query.question,
        include_citations=query.include_citations
    )

@app.get("/api/wishes", response_model=List[StudentWish])
async def list_wishes():
    return wish_manager.get_all_wishes()

@app.post("/api/wishes", response_model=StudentWish)
async def submit_wish(wish: StudentWish):
    return await wish_manager.add_wish(wish)

@app.post("/api/tribute/generate", response_model=BirthdayTributeResponse)
async def generate_tribute(req: TributeGenerationRequest):
    wishes = wish_manager.get_all_wishes()
    if req.filter_department:
        wishes = [w for w in wishes if req.filter_department.lower() in w.department.lower()]
    return await ai_service.generate_birthday_tribute(wishes=wishes, language=req.language)

@app.websocket("/ws/wishes")
async def websocket_wishes_endpoint(websocket: WebSocket):
    await wish_manager.connection_manager.connect(websocket)
    try:
        # Send initial seed wishes immediately on connection
        current_wishes = wish_manager.get_all_wishes()
        await websocket.send_json({
            "event": "INITIAL_STATE",
            "wishes": [w.model_dump() for w in current_wishes],
            "total_count": len(current_wishes)
        })
        while True:
            # Keep connection alive; incoming pings/messages
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        wish_manager.connection_manager.disconnect(websocket)
    except Exception:
        wish_manager.connection_manager.disconnect(websocket)

@app.get("/api/tts")
async def stream_tts_audio_get(text: str = Query(..., min_length=1), voice: Optional[str] = None):
    try:
        audio_bytes = await TTSService.get_audio_bytes(text, voice)
        return Response(content=audio_bytes, media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS error: {str(e)}")

@app.post("/api/tts")
async def stream_tts_audio_post(body: dict):
    text = body.get("text", "").strip()
    voice = body.get("voice")
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")
    try:
        audio_bytes = await TTSService.get_audio_bytes(text, voice)
        return Response(content=audio_bytes, media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS error: {str(e)}")
