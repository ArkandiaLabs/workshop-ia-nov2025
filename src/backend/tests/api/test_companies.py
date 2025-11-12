"""Tests for companies endpoint."""

from unittest.mock import MagicMock

from fastapi.testclient import TestClient


def test_get_companies_without_filters(client: TestClient, mock_supabase_client: MagicMock) -> None:
    """Test getting all companies without filters.

    Args:
        client: TestClient fixture with mocked dependencies.
        mock_supabase_client: Mock Supabase client fixture.
    """
    # Create mock data for 100 companies
    mock_companies = [
        {
            "id": i,
            "name": f"Company {i}",
            "products": f"Product {i}",
            "founding_year": 2020 + (i % 5),
            "total_funding": 1000000 * (i + 1),
            "arr": 100000 * (i + 1),
            "valuation": 5000000 * (i + 1),
            "employees": 10 + (i * 2),
            "g2_rating": 4.5 + (i % 2) * 0.5,
            "industry": {"id": (i % 5) + 1, "name": f"Industry {(i % 5) + 1}"},
            "location": {"id": (i % 3) + 1, "city": f"City {(i % 3) + 1}", "country": "USA"},
        }
        for i in range(100)
    ]

    # Mock the table query chain
    mock_query = MagicMock()
    mock_query.select.return_value = mock_query
    mock_query.eq.return_value = mock_query
    mock_query.execute.return_value = MagicMock(data=mock_companies)

    mock_supabase_client.table.return_value = mock_query

    # Make request without filters
    response = client.get("/api/v1/companies")

    # Verify status code
    assert response.status_code == 200

    # Verify response structure
    data = response.json()
    assert "companies" in data
    assert "total" in data
    assert "filters_applied" in data

    # Verify data
    assert len(data["companies"]) == 100
    assert data["total"] == 100
    assert data["filters_applied"]["industry_id"] is None
    assert data["filters_applied"]["location_id"] is None


def test_get_companies_with_industry_filter(
    client: TestClient, mock_supabase_client: MagicMock
) -> None:
    """Test getting companies filtered by industry.

    Args:
        client: TestClient fixture with mocked dependencies.
        mock_supabase_client: Mock Supabase client fixture.
    """
    # Create mock data for 10 filtered companies
    mock_companies = [
        {
            "id": i,
            "name": f"Company {i}",
            "products": f"Product {i}",
            "founding_year": 2020,
            "total_funding": 1000000 * (i + 1),
            "arr": 100000 * (i + 1),
            "valuation": 5000000 * (i + 1),
            "employees": 10 + (i * 2),
            "g2_rating": 4.5,
            "industry": {"id": 1, "name": "Software"},
            "location": {"id": 1, "city": "San Francisco", "country": "USA"},
        }
        for i in range(10)
    ]

    # Mock the table query chain
    mock_query = MagicMock()
    mock_query.select.return_value = mock_query
    mock_query.eq.return_value = mock_query
    mock_query.execute.return_value = MagicMock(data=mock_companies)

    mock_supabase_client.table.return_value = mock_query

    # Make request with industry filter
    response = client.get("/api/v1/companies?industry_id=1")

    # Verify status code
    assert response.status_code == 200

    # Verify response
    data = response.json()
    assert len(data["companies"]) == 10
    assert data["total"] == 10
    assert data["filters_applied"]["industry_id"] == 1
    assert data["filters_applied"]["location_id"] is None

    # Verify eq was called with industry_id
    mock_query.eq.assert_called()


def test_get_companies_with_location_filter(
    client: TestClient, mock_supabase_client: MagicMock
) -> None:
    """Test getting companies filtered by location.

    Args:
        client: TestClient fixture with mocked dependencies.
        mock_supabase_client: Mock Supabase client fixture.
    """
    # Create mock data for 15 filtered companies
    mock_companies = [
        {
            "id": i,
            "name": f"Company {i}",
            "products": f"Product {i}",
            "founding_year": 2020,
            "total_funding": 1000000 * (i + 1),
            "arr": 100000 * (i + 1),
            "valuation": 5000000 * (i + 1),
            "employees": 10 + (i * 2),
            "g2_rating": 4.5,
            "industry": {"id": 1, "name": "Software"},
            "location": {"id": 2, "city": "New York", "country": "USA"},
        }
        for i in range(15)
    ]

    # Mock the table query chain
    mock_query = MagicMock()
    mock_query.select.return_value = mock_query
    mock_query.eq.return_value = mock_query
    mock_query.execute.return_value = MagicMock(data=mock_companies)

    mock_supabase_client.table.return_value = mock_query

    # Make request with location filter
    response = client.get("/api/v1/companies?location_id=2")

    # Verify status code
    assert response.status_code == 200

    # Verify response
    data = response.json()
    assert len(data["companies"]) == 15
    assert data["total"] == 15
    assert data["filters_applied"]["industry_id"] is None
    assert data["filters_applied"]["location_id"] == 2


def test_get_companies_with_both_filters(
    client: TestClient, mock_supabase_client: MagicMock
) -> None:
    """Test getting companies filtered by both industry and location.

    Args:
        client: TestClient fixture with mocked dependencies.
        mock_supabase_client: Mock Supabase client fixture.
    """
    # Create mock data for 3 filtered companies
    mock_companies = [
        {
            "id": i,
            "name": f"Company {i}",
            "products": f"Product {i}",
            "founding_year": 2020,
            "total_funding": 1000000 * (i + 1),
            "arr": 100000 * (i + 1),
            "valuation": 5000000 * (i + 1),
            "employees": 10 + (i * 2),
            "g2_rating": 4.5,
            "industry": {"id": 1, "name": "Software"},
            "location": {"id": 2, "city": "New York", "country": "USA"},
        }
        for i in range(3)
    ]

    # Mock the table query chain
    mock_query = MagicMock()
    mock_query.select.return_value = mock_query
    mock_query.eq.return_value = mock_query
    mock_query.execute.return_value = MagicMock(data=mock_companies)

    mock_supabase_client.table.return_value = mock_query

    # Make request with both filters
    response = client.get("/api/v1/companies?industry_id=1&location_id=2")

    # Verify status code
    assert response.status_code == 200

    # Verify response
    data = response.json()
    assert len(data["companies"]) == 3
    assert data["total"] == 3
    assert data["filters_applied"]["industry_id"] == 1
    assert data["filters_applied"]["location_id"] == 2


def test_get_companies_invalid_filter(
    client: TestClient, mock_supabase_client: MagicMock
) -> None:
    """Test getting companies with non-existent filter returns empty list.

    Args:
        client: TestClient fixture with mocked dependencies.
        mock_supabase_client: Mock Supabase client fixture.
    """
    # Mock empty result for non-existent filter
    mock_query = MagicMock()
    mock_query.select.return_value = mock_query
    mock_query.eq.return_value = mock_query
    mock_query.execute.return_value = MagicMock(data=[])

    mock_supabase_client.table.return_value = mock_query

    # Make request with non-existent filter
    response = client.get("/api/v1/companies?industry_id=9999")

    # Verify status code is 200 (not error, just empty)
    assert response.status_code == 200

    # Verify response
    data = response.json()
    assert len(data["companies"]) == 0
    assert data["total"] == 0
    assert data["filters_applied"]["industry_id"] == 9999


def test_get_companies_supabase_error(
    client: TestClient, mock_supabase_client: MagicMock
) -> None:
    """Test error handling when Supabase raises an exception.

    Args:
        client: TestClient fixture with mocked dependencies.
        mock_supabase_client: Mock Supabase client fixture.
    """
    # Mock table to raise exception
    mock_supabase_client.table.side_effect = Exception("Supabase connection error")

    # Make request
    response = client.get("/api/v1/companies")

    # Verify status code is 500
    assert response.status_code == 500

    # Verify error message in response
    data = response.json()
    assert "detail" in data
    assert "Internal server error" in data["detail"]
