"""Tests for industries endpoint."""

from unittest.mock import MagicMock

from fastapi.testclient import TestClient


def test_get_industries(client: TestClient, mock_supabase_client: MagicMock) -> None:
    """Test getting all industries.

    Args:
        client: TestClient fixture with mocked dependencies.
        mock_supabase_client: Mock Supabase client fixture.
    """
    # Create mock data for industries
    mock_industries = [
        {
            "id": i,
            "name": f"Industry {i}",
            "created_at": "2024-01-01T00:00:00",
            "updated_at": "2024-01-01T00:00:00",
        }
        for i in range(1, 43)
    ]

    # Mock the table query chain
    mock_query = MagicMock()
    mock_query.select.return_value = mock_query
    mock_query.order.return_value = mock_query
    mock_query.execute.return_value = MagicMock(data=mock_industries)

    mock_supabase_client.table.return_value = mock_query

    # Make request
    response = client.get("/api/v1/industries")

    # Verify status code
    assert response.status_code == 200

    # Verify response structure
    data = response.json()
    assert "industries" in data
    assert "total" in data

    # Verify data
    assert len(data["industries"]) == 42
    assert data["total"] == 42

    # Verify each industry has required fields
    for industry in data["industries"]:
        assert "id" in industry
        assert "name" in industry


def test_get_industries_supabase_error(client: TestClient, mock_supabase_client: MagicMock) -> None:
    """Test error handling when Supabase raises an exception.

    Args:
        client: TestClient fixture with mocked dependencies.
        mock_supabase_client: Mock Supabase client fixture.
    """
    # Mock table to raise exception
    mock_supabase_client.table.side_effect = Exception("Supabase connection error")

    # Make request
    response = client.get("/api/v1/industries")

    # Verify status code is 500
    assert response.status_code == 500

    # Verify error message in response
    data = response.json()
    assert "detail" in data
    assert "Internal server error" in data["detail"]
