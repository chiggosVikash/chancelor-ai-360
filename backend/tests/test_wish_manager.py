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


@pytest.mark.asyncio
async def test_should_persist_wishes_in_sqlite_across_instances(tmp_path):
    # Arrange: use a dedicated test db file
    db_file = str(tmp_path / "test_wishes.db")
    manager1 = WishManager(db_path=db_file)
    wish = StudentWish(
        id="persisted_1",
        student_name="Kavita Rao",
        department="School of Law",
        message="Respected Chancellor Sir, your guidance shapes our futures!",
        timestamp="04:00 PM"
    )
    await manager1.add_wish(wish)

    # Act: create a brand new manager instance pointing to the same db
    manager2 = WishManager(db_path=db_file)
    all_wishes = manager2.get_all_wishes()

    # Assert: wish was loaded from SQLite
    assert any(w.id == "persisted_1" for w in all_wishes)
    loaded = next(w for w in all_wishes if w.id == "persisted_1")
    assert loaded.student_name == "Kavita Rao"

@pytest.mark.asyncio
async def test_should_retrieve_wishes_in_window_and_supplement(tmp_path):
    import time
    db_file = str(tmp_path / "window_test.db")
    manager = WishManager(db_path=db_file)
    now = time.time()

    # Add a fresh wish inside window
    recent_wish = StudentWish(
        id="window_wish_1",
        student_name="Live Attendee",
        department="B.Tech AI",
        message="Live greetings during the 30s storm!",
        created_at=now
    )
    await manager.add_wish(recent_wish)

    # Act: query window from 10s ago
    window_wishes = manager.get_wishes_in_window(since_epoch=now - 10)

    # Assert: includes the live wish and supplements up to at least 5 wishes
    assert any(w.id == "window_wish_1" for w in window_wishes)
    assert len(window_wishes) >= 5
