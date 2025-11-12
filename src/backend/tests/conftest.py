"""Pytest configuration and shared fixtures for backend tests."""

from collections.abc import Generator
from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient

from backend.core.database import get_db
from backend.main import app


@pytest.fixture
def mock_supabase_client() -> MagicMock:
    """Create a mock Supabase client for testing.

    Returns:
        MagicMock: A mock object simulating Supabase Client behavior.
    """
    return MagicMock()


@pytest.fixture
def client(mock_supabase_client: MagicMock) -> Generator[TestClient, None, None]:
    """Create a TestClient with mocked database dependency.

    Args:
        mock_supabase_client: Mock Supabase client fixture.

    Yields:
        TestClient: FastAPI test client with dependency overrides.
    """
    # Override the get_db dependency with mock client
    app.dependency_overrides[get_db] = lambda: mock_supabase_client

    test_client = TestClient(app)

    yield test_client

    # Clean up dependency overrides after test
    app.dependency_overrides.clear()
