# [PATTERN: Service] — Neural Text-to-Speech service using broadcast-grade voices
import re
import hashlib
import logging
from typing import AsyncGenerator
import edge_tts

logger = logging.getLogger("chancellor_ai.tts_service")

# Default Voice configuration (Warm, natural, cultured Indian voices)
FEMALE_EN_IN_VOICE = "en-IN-NeerjaNeural"
FEMALE_HI_IN_VOICE = "hi-IN-SwaraNeural"

# In-memory LRU cache for instant replay (<5ms)
_AUDIO_CACHE: dict[str, bytes] = {}
_MAX_CACHE_ITEMS = 120

def _is_hindi(text: str) -> bool:
    """Detects if string contains Devanagari script."""
    return bool(re.search(r"[\u0900-\u097F]", text))

def _clean_text_for_speech(text: str) -> str:
    """Cleans markdown symbols, URLs, and code brackets for natural speech."""
    cleaned = re.sub(r"https?://\S+|www\.\S+", "", text)
    cleaned = re.sub(r"[*_#`~\[\]()>]", "", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned

class TTSService:
    @staticmethod
    def get_cache_key(text: str, voice: str) -> str:
        return hashlib.sha256(f"{voice}:{text}".encode("utf-8")).hexdigest()

    @staticmethod
    async def get_audio_bytes(text: str, voice: str | None = None) -> bytes:
        clean_text = _clean_text_for_speech(text)
        if not clean_text:
            return b""

        # Select natural voice
        if not voice:
            voice = FEMALE_HI_IN_VOICE if _is_hindi(clean_text) else FEMALE_EN_IN_VOICE

        cache_key = TTSService.get_cache_key(clean_text, voice)
        if cache_key in _AUDIO_CACHE:
            return _AUDIO_CACHE[cache_key]

        try:
            communicate = edge_tts.Communicate(clean_text, voice, rate="+2%", pitch="+1Hz")
            chunks = []
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    chunks.append(chunk["data"])
            audio_data = b"".join(chunks)

            # Store in cache
            if len(_AUDIO_CACHE) >= _MAX_CACHE_ITEMS:
                _AUDIO_CACHE.pop(next(iter(_AUDIO_CACHE)))
            _AUDIO_CACHE[cache_key] = audio_data
            return audio_data
        except Exception as e:
            logger.error(f"TTS generation error: {e}")
            raise
