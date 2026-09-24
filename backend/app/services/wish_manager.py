# [PATTERN: Observer / Hub] — ConnectionManager broadcasts incoming wishes to subscribed clients
# [SOLID: SRP] — WishManager manages wish lifecycle, sanitization, and real-time distribution
import re
from typing import List, Set, Dict, Any, Optional
from fastapi import WebSocket
from app.models import StudentWish

PROFANITY_WORDS = {"stupid", "idiot", "hate", "ugly", "fake", "bad", "kill", "abuse", "damn"}

class ConnectionManager:
    """Manages active WebSocket connections for live stage display updates."""
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)

    async def broadcast_json(self, message: Dict[str, Any]):
        disconnected: Set[WebSocket] = set()
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.add(connection)
        for dead_conn in disconnected:
            self.active_connections.discard(dead_conn)

class WishManager:
    def __init__(self):
        self.connection_manager = ConnectionManager()
        self._wishes: List[StudentWish] = self._generate_default_wishes()

    def _generate_default_wishes(self) -> List[StudentWish]:
        return [
            StudentWish(
                id="w_seed_1",
                student_name="Aarav Sharma",
                department="B.Tech Computer Science (3rd Year)",
                message="Happy Birthday Hon'ble Chancellor Sir! Your vision of blending AI with rural development inspires us every day.",
                timestamp="2026-09-24T10:15:00Z",
                avatar_color="#F59E0B"
            ),
            StudentWish(
                id="w_seed_2",
                student_name="Dr. Priya Chaudhary",
                department="Ayurvedic Medical College & Hospital",
                message="Wishing our respected Chancellor a glorious birthday! Thank you for reviving Indian traditional medicine with such honor and modern research facilities.",
                timestamp="2026-09-24T11:00:00Z",
                avatar_color="#10B981"
            ),
            StudentWish(
                id="w_seed_3",
                student_name="Mohammed Zaid",
                department="Biotechnology & Bioinformatics",
                message="Warmest birthday greetings, Sir! The incubation centers and research culture you created have opened global doors for students like me.",
                timestamp="2026-09-24T12:30:00Z",
                avatar_color="#3B82F6"
            ),
            StudentWish(
                id="w_seed_4",
                student_name="Ananya Mishra",
                department="School of Law & Constitutional Studies",
                message="Happy Birthday Sir! Your leadership and dedication to nation-building through education are a constant guiding light.",
                timestamp="2026-09-24T13:45:00Z",
                avatar_color="#8B5CF6"
            ),
            StudentWish(
                id="w_seed_5",
                student_name="Rohan Singh",
                department="Agriculture & Agri-Informatics",
                message="Happy Birthday Chancellor Sir! Thank you for making world-class agricultural education accessible to rural farmers' children.",
                timestamp="2026-09-24T14:10:00Z",
                avatar_color="#EC4899"
            )
        ]

    def sanitize_message(self, text: str) -> str:
        words = text.split()
        sanitized = []
        for word in words:
            clean_word = re.sub(r'[^a-zA-Z0-9]', '', word).lower()
            if clean_word in PROFANITY_WORDS:
                sanitized.append("***")
            else:
                sanitized.append(word)
        return " ".join(sanitized)

    def get_all_wishes(self) -> List[StudentWish]:
        return list(self._wishes)

    async def add_wish(self, wish: StudentWish) -> StudentWish:
        # Sanitize message before saving
        sanitized_msg = self.sanitize_message(wish.message)
        clean_wish = StudentWish(
            id=wish.id,
            student_name=wish.student_name.strip(),
            department=wish.department.strip(),
            message=sanitized_msg,
            timestamp=wish.timestamp,
            avatar_color=wish.avatar_color or "#F59E0B"
        )
        self._wishes.insert(0, clean_wish)

        # Broadcast event to connected display screens
        await self.connection_manager.broadcast_json({
            "event": "NEW_WISH",
            "wish": clean_wish.model_dump(),
            "total_count": len(self._wishes)
        })

        return clean_wish
