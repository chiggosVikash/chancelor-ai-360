# [TDD: RED] — Test AI service Q&A and Birthday Tribute generation
# [AAA] — Arrange / Act / Assert
import pytest
from app.services.ai_service import AIService
from app.models import StudentWish

@pytest.mark.asyncio
async def test_should_return_verified_answer_for_founding_question():
    # Arrange
    service = AIService()

    # Act
    response = await service.answer_question("Tell me about the founding of NICE Society in 1989")

    # Assert
    assert response.answer is not None
    assert len(response.answer) > 20
    assert len(response.citations) >= 1
    assert any("NICE" in c or "1989" in c or "Charter" in c for c in response.citations)

@pytest.mark.asyncio
async def test_should_generate_birthday_tribute_poem():
    # Arrange
    service = AIService()
    wishes = [
        StudentWish(
            id="w_1",
            student_name="Rahul",
            department="Computer Science",
            message="Happy Birthday Sir! Thank you for the research labs.",
            timestamp="now"
        )
    ]

    # Act
    tribute = await service.generate_birthday_tribute(wishes)

    # Assert
    assert tribute.title is not None
    assert len(tribute.poem_stanzas) >= 3
    assert len(tribute.recitation_text) > 50
    assert tribute.total_wishes_synthesized >= 1
