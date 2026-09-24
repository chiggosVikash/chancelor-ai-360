# [TDD: RED] — Test knowledge service loading and search
# [AAA] — Arrange / Act / Assert
import pytest
from app.services.knowledge_service import KnowledgeService

def test_should_load_chancellor_overview_correctly():
    # Arrange & Act
    service = KnowledgeService()
    profile = service.get_chancellor_overview()

    # Assert
    assert "Kunwar Shekhar Vijendra" in profile["name"]
    assert "Shobhit University" in profile["title"]
    assert len(profile["core_pillars"]) >= 3

def test_should_return_all_milestones():
    # Arrange & Act
    service = KnowledgeService()
    milestones = service.get_all_milestones()

    # Assert
    assert len(milestones) >= 5
    assert any(m.year == "1989" for m in milestones)

def test_should_find_milestones_by_query_or_category():
    # Arrange
    service = KnowledgeService()

    # Act
    results_ayurveda = service.find_milestones(query="Ayurveda")
    results_1989 = service.find_milestones(query="1989")

    # Assert
    assert len(results_ayurveda) >= 1
    assert any("Ayurved" in m.title or "Ayurved" in m.summary for m in results_ayurveda)
    assert len(results_1989) >= 1
    assert results_1989[0].year == "1989"
