# [TDD: E2E Integration] — End-to-End verification of Chancellor AI 360 live stage flow
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_full_stage_demonstration_workflow():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Step 1: Stage Screen boots and loads Chancellor Overview
        overview_resp = await ac.get("/api/overview")
        assert overview_resp.status_code == 200
        overview = overview_resp.json()
        assert "Kunwar Shekhar Vijendra" in overview["name"]

        # Step 2: Presenter clicks 'Explore His Journey' and filters for '1989'
        milestone_resp = await ac.get("/api/milestones?query=1989")
        assert milestone_resp.status_code == 200
        milestones = milestone_resp.json()
        assert len(milestones) >= 1
        assert milestones[0]["year"] == "1989"

        # Step 3: Presenter asks Chancellor AI a voice question
        chat_resp = await ac.post("/api/chat", json={
            "question": "What was Chancellor Sir's vision when founding NICE in 1989?",
            "include_citations": True
        })
        assert chat_resp.status_code == 200
        chat_data = chat_resp.json()
        assert len(chat_data["answer"]) > 50
        assert len(chat_data["citations"]) >= 1

        # Step 4: A student in the audience scans the QR code and submits a birthday wish
        wish_payload = {
            "id": "e2e_student_wish_001",
            "student_name": "Divya Prakash",
            "department": "Biotechnology (Final Year)",
            "message": "Wishing a very Happy Birthday to our beloved Chancellor Sir! Your mentorship is priceless.",
            "timestamp": "2026-09-24T15:10:00Z",
            "avatar_color": "#10B981"
        }
        submit_resp = await ac.post("/api/wishes", json=wish_payload)
        assert submit_resp.status_code == 200
        saved_wish = submit_resp.json()
        assert saved_wish["student_name"] == "Divya Prakash"

        # Step 5: Verify stage wish wall has the new wish
        wishes_resp = await ac.get("/api/wishes")
        assert wishes_resp.status_code == 200
        wishes_list = wishes_resp.json()
        assert any(w["id"] == "e2e_student_wish_001" for w in wishes_list)

        # Step 6: Presenter triggers the Grand Birthday Surprise Tribute Anthem
        tribute_resp = await ac.post("/api/tribute/generate", json={"language": "bilingual"})
        assert tribute_resp.status_code == 200
        tribute = tribute_resp.json()
        assert "Birthday Tribute Anthem" in tribute["title"] or len(tribute["poem_stanzas"]) >= 3
        assert tribute["total_wishes_synthesized"] >= 1
