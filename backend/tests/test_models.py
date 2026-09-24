# [TDD: RED] — this test should fail before implementation
# [AAA] — Arrange / Act / Assert structure applied
import pytest
from app.models import StudentWish, Milestone, ChatQuery, ChatResponse, TributeGenerationRequest

def test_should_create_valid_student_wish_when_valid_data_provided():
    # Arrange
    wish_data = {
        "id": "wish_1",
        "student_name": "Aarav Sharma",
        "department": "B.Tech Computer Science",
        "message": "Happy Birthday Chancellor Sir! Thank you for inspiring us.",
        "timestamp": "2026-09-24T15:00:00Z"
    }

    # Act
    wish = StudentWish(**wish_data)

    # Assert
    assert wish.id == "wish_1"
    assert wish.student_name == "Aarav Sharma"
    assert wish.avatar_color is not None

def test_should_create_valid_milestone_when_valid_data_provided():
    # Arrange
    milestone_data = {
        "id": "m_1989",
        "year": "1989",
        "title": "Founding of NICE Society",
        "category": "Education",
        "summary": "Establishment of NICE Society, laying the foundation for Shobhit University.",
        "narrative": "In 1989, Kunwar Shekhar Vijendra pioneered a new era of vocational and technical education...",
        "photos": ["/photos/1989_founding.jpg"],
        "citations": ["Shobhit University Foundation Charter, 1989"]
    }

    # Act
    milestone = Milestone(**milestone_data)

    # Assert
    assert milestone.year == "1989"
    assert len(milestone.citations) == 1

def test_should_create_chat_query_with_default_citations():
    # Arrange & Act
    query = ChatQuery(question="What was Chancellor Sir's vision in 1989?")

    # Assert
    assert query.include_citations is True
    assert query.question == "What was Chancellor Sir's vision in 1989?"
