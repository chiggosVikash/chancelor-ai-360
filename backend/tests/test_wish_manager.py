# [TDD: RED] — Test wish manager and realtime broadcast
# [AAA] — Arrange / Act / Assert
import pytest
from app.services.wish_manager import WishManager
from app.models import StudentWish

@pytest.mark.asyncio
async def test_should_initialize_with_default_sample_wishes():
    # Arrange & Act
    manager = WishManager()
    wishes = manager.get_all_wishes()

    # Assert
    assert len(wishes) >= 3
    assert any("Aarav" in w.student_name for w in wishes)

@pytest.mark.asyncio
async def test_should_add_new_student_wish_successfully():
    # Arrange
    manager = WishManager()
    new_wish = StudentWish(
        id="test_wish_99",
        student_name="Pooja Verma",
        department="Biotechnology",
        message="Happy Birthday Chancellor Sir! Thank you for the wonderful research labs.",
        timestamp="2026-09-24T15:30:00Z"
    )

    # Act
    saved_wish = await manager.add_wish(new_wish)
    all_wishes = manager.get_all_wishes()

    # Assert
    assert saved_wish.id == "test_wish_99"
    assert any(w.id == "test_wish_99" for w in all_wishes)

@pytest.mark.asyncio
async def test_should_filter_profanity_in_wish():
    # Arrange
    manager = WishManager()
    profane_wish = StudentWish(
        id="test_bad",
        student_name="Spam User",
        department="Test",
        message="You are stupid bad message Happy Birthday",
        timestamp="2026-09-24T15:30:00Z"
    )

    # Act
    saved = await manager.add_wish(profane_wish)

    # Assert
    assert "stupid" not in saved.message.lower()
    assert "***" in saved.message
