"""Tests for locations endpoint."""

from unittest.mock import MagicMock

from fastapi.testclient import TestClient


def test_get_locations(client: TestClient, mock_supabase_client: MagicMock) -> None:
    """Test getting all locations.

    Args:
        client: TestClient fixture with mocked dependencies.
        mock_supabase_client: Mock Supabase client fixture.
    """
    # Create mock data for locations
    mock_locations = [
        {
            "id": 1,
            "city": "San Francisco",
            "state": "CA",
            "country": "USA",
            "created_at": "2024-01-01T00:00:00",
            "updated_at": "2024-01-01T00:00:00",
        },
        {
            "id": 2,
            "city": "New York",
            "state": "NY",
            "country": "USA",
            "created_at": "2024-01-01T00:00:00",
            "updated_at": "2024-01-01T00:00:00",
        },
        {
            "id": 3,
            "city": "London",
            "state": None,
            "country": "UK",
            "created_at": "2024-01-01T00:00:00",
            "updated_at": "2024-01-01T00:00:00",
        },
    ]

    # Mock the table query chain
    mock_query = MagicMock()
    mock_query.select.return_value = mock_query
    mock_query.order.return_value = mock_query
    mock_query.execute.return_value = MagicMock(data=mock_locations)

    mock_supabase_client.table.return_value = mock_query

    # Make request
    response = client.get("/api/v1/locations")

    # Verify status code
    assert response.status_code == 200

    # Verify response structure
    data = response.json()
    assert "locations" in data
    assert "total" in data

    # Verify data
    assert len(data["locations"]) == 3
    assert data["total"] == 3

    # Verify each location has required fields and display_name format
    for location in data["locations"]:
        assert "id" in location
        assert "city" in location
        assert "country" in location
        assert "display_name" in location
        # Verify display_name format: "City, Country"
        assert ", " in location["display_name"]
        assert location["country"] in location["display_name"]


def test_get_locations_display_name_format(
    client: TestClient, mock_supabase_client: MagicMock
) -> None:
    """Test that display_name has correct format 'City, Country'.

    Args:
        client: TestClient fixture with mocked dependencies.
        mock_supabase_client: Mock Supabase client fixture.
    """
    # Create mock data
    mock_locations = [
        {
            "id": 1,
            "city": "San Francisco",
            "state": "CA",
            "country": "USA",
            "created_at": "2024-01-01T00:00:00",
            "updated_at": "2024-01-01T00:00:00",
        },
    ]

    # Mock the table query chain
    mock_query = MagicMock()
    mock_query.select.return_value = mock_query
    mock_query.order.return_value = mock_query
    mock_query.execute.return_value = MagicMock(data=mock_locations)

    mock_supabase_client.table.return_value = mock_query

    # Make request
    response = client.get("/api/v1/locations")

    # Verify display_name format
    data = response.json()
    location = data["locations"][0]
    assert location["display_name"] == "San Francisco, USA"


def test_get_locations_supabase_error(client: TestClient, mock_supabase_client: MagicMock) -> None:
    """Test error handling when Supabase raises an exception.

    Args:
        client: TestClient fixture with mocked dependencies.
        mock_supabase_client: Mock Supabase client fixture.
    """
    # Mock table to raise exception
    mock_supabase_client.table.side_effect = Exception("Supabase connection error")

    # Make request
    response = client.get("/api/v1/locations")

    # Verify status code is 500
    assert response.status_code == 500

    # Verify error message in response
    data = response.json()
    assert "detail" in data
    assert "Internal server error" in data["detail"]
