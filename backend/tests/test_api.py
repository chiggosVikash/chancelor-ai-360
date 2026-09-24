# [TDD: RED] — Test FastAPI REST and WebSocket endpoints
# [AAA] — Arrange / Act / Assert
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_get_chancellor_overview_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/overview")
    assert response.status_code == 200
    data = response.json()
    assert "Kunwar Shekhar Vijendra" in data["name"]

@pytest.mark.asyncio
async def test_post_chat_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/chat", json={"question": "Tell me about NICE 1989"})
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert len(data["citations"]) >= 1

@pytest.mark.asyncio
async def test_submit_wish_and_retrieve():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        post_resp = await ac.post("/api/wishes", json={
            "id": "w_api_test",
            "student_name": "Kavita",
            "department": "Law",
            "message": "Happy Birthday Sir! Respect and gratitude.",
            "timestamp": "2026-09-24T15:00:00Z"
        })
        assert post_resp.status_code == 200

        get_resp = await ac.get("/api/wishes")
        assert get_resp.status_code == 200
        wishes = get_resp.json()
        assert any(w["id"] == "w_api_test" for w in wishes)
