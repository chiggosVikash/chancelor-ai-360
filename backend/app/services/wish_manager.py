# [PATTERN: Observer / Hub] — ConnectionManager broadcasts incoming wishes to subscribed clients
# [SOLID: SRP] — WishManager manages wish lifecycle, SQLite persistence, sanitization, and real-time distribution
import os
import re
import sqlite3
import aiosqlite
from typing import List, Set, Dict, Any, Optional
from datetime import datetime
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
    def __init__(self, db_path: Optional[str] = None):
        self.connection_manager = ConnectionManager()
        if db_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            self.db_path = os.path.join(base_dir, "data", "wishes.db")
        else:
            self.db_path = db_path

        # Ensure directory exists if using file DB
        if self.db_path != ":memory:":
            os.makedirs(os.path.dirname(self.db_path), exist_ok=True)

        self._wishes: List[StudentWish] = []
        self._init_sqlite_db()

    def _generate_default_wishes(self) -> List[StudentWish]:
        base_time = datetime.now().timestamp()
        return [
            StudentWish(
                id="w_seed_1",
                student_name="Aarav Sharma",
                department="B.Tech Computer Science (3rd Year)",
                message="Happy Birthday Hon'ble Chancellor Sir! Your vision of blending AI with rural development inspires us every day.",
                timestamp="10:15 AM",
                avatar_color="#F59E0B",
                created_at=base_time - 3600
            ),
            StudentWish(
                id="w_seed_2",
                student_name="Dr. Priya Chaudhary",
                department="Ayurvedic Medical College & Hospital",
                message="Wishing our respected Chancellor a glorious birthday! Thank you for reviving Indian traditional medicine with such honor and modern research facilities.",
                timestamp="11:00 AM",
                avatar_color="#10B981",
                created_at=base_time - 3000
            ),
            StudentWish(
                id="w_seed_3",
                student_name="Mohammed Zaid",
                department="Biotechnology & Bioinformatics",
                message="Warmest birthday greetings, Sir! The incubation centers and research culture you created have opened global doors for students like me.",
                timestamp="12:30 PM",
                avatar_color="#3B82F6",
                created_at=base_time - 2400
            ),
            StudentWish(
                id="w_seed_4",
                student_name="Ananya Mishra",
                department="School of Law & Constitutional Studies",
                message="Happy Birthday Sir! Your leadership and dedication to nation-building through education are a constant guiding light.",
                timestamp="01:45 PM",
                avatar_color="#8B5CF6",
                created_at=base_time - 1800
            ),
            StudentWish(
                id="w_seed_5",
                student_name="Rohan Singh",
                department="Agriculture & Agri-Informatics",
                message="Happy Birthday Chancellor Sir! Thank you for making world-class agricultural education accessible to rural farmers' children.",
                timestamp="02:10 PM",
                avatar_color="#EC4899",
                created_at=base_time - 1200
            )
        ]

    def _init_sqlite_db(self):
        """Synchronous setup on startup to guarantee DB exists and cache is populated."""
        with sqlite3.connect(self.db_path) as conn:
            if self.db_path != ":memory:":
                conn.execute("PRAGMA journal_mode=WAL;")
            conn.execute("""
                CREATE TABLE IF NOT EXISTS wishes (
                    id TEXT PRIMARY KEY,
                    student_name TEXT NOT NULL,
                    department TEXT NOT NULL,
                    message TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    avatar_color TEXT NOT NULL,
                    created_at REAL NOT NULL
                );
            """)
            conn.commit()

            # Check if wishes table is empty
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM wishes")
            count = cursor.fetchone()[0]

            if count == 0:
                defaults = self._generate_default_wishes()
                for w in defaults:
                    cursor.execute(
                        "INSERT INTO wishes (id, student_name, department, message, timestamp, avatar_color, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        (w.id, w.student_name, w.department, w.message, w.timestamp, w.avatar_color, w.created_at)
                    )
                conn.commit()

            # Load all wishes into cache ordered by created_at DESC
            cursor.execute("SELECT id, student_name, department, message, timestamp, avatar_color, created_at FROM wishes ORDER BY created_at DESC")
            rows = cursor.fetchall()
            self._wishes = [
                StudentWish(
                    id=row[0],
                    student_name=row[1],
                    department=row[2],
                    message=row[3],
                    timestamp=row[4],
                    avatar_color=row[5],
                    created_at=row[6]
                )
                for row in rows
            ]

    def sanitize_message(self, text: str) -> str:
        words = text.split()
        sanitized = []
        for word in words:
            clean_word = re.sub(r"[^a-zA-Z0-9]", "", word).lower()
            if clean_word in PROFANITY_WORDS:
                sanitized.append("***")
            else:
                sanitized.append(word)
        return " ".join(sanitized)

    def get_all_wishes(self) -> List[StudentWish]:
        return list(self._wishes)

    def get_wishes_in_window(
        self,
        since_epoch: Optional[float] = None,
        filter_department: Optional[str] = None
    ) -> List[StudentWish]:
        """Get wishes in a specific time window, supplemented with recent wishes if count < 5."""
        all_items = list(self._wishes)

        # Department filter if specified
        if filter_department:
            all_items = [w for w in all_items if filter_department.lower() in w.department.lower()]

        if since_epoch is not None:
            window_wishes = [w for w in all_items if (w.created_at or 0.0) >= since_epoch]
            # If window wishes are few, supplement with recent wishes to maintain rich tribute ode
            if len(window_wishes) < 5:
                seen_ids = {w.id for w in window_wishes}
                for w in all_items:
                    if w.id not in seen_ids:
                        window_wishes.append(w)
                    if len(window_wishes) >= 10:
                        break
            return window_wishes

        return all_items[:15]

    async def add_wish(self, wish: StudentWish) -> StudentWish:
        # Sanitize message before saving
        sanitized_msg = self.sanitize_message(wish.message)
        created_at_val = wish.created_at or datetime.now().timestamp()
        clean_wish = StudentWish(
            id=wish.id,
            student_name=wish.student_name.strip(),
            department=wish.department.strip(),
            message=sanitized_msg,
            timestamp=wish.timestamp or datetime.now().strftime("%I:%M %p"),
            avatar_color=wish.avatar_color or "#F59E0B",
            created_at=created_at_val
        )

        # Persist to SQLite asynchronously
        try:
            async with aiosqlite.connect(self.db_path) as db:
                await db.execute(
                    """
                    INSERT OR REPLACE INTO wishes (id, student_name, department, message, timestamp, avatar_color, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        clean_wish.id,
                        clean_wish.student_name,
                        clean_wish.department,
                        clean_wish.message,
                        clean_wish.timestamp,
                        clean_wish.avatar_color,
                        clean_wish.created_at
                    )
                )
                await db.commit()
        except Exception as e:
            # Non-blocking log to ensure memory cache always succeeds
            print(f"[WishManager Warning] SQLite write error: {e}")

        # Update in-memory cache at top
        self._wishes.insert(0, clean_wish)

        # Broadcast event to connected display screens
        await self.connection_manager.broadcast_json({
            "event": "NEW_WISH",
            "wish": clean_wish.model_dump(),
            "total_count": len(self._wishes)
        })

        return clean_wish
