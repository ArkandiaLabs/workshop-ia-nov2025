"""Tests for health check endpoint."""

from fastapi.testclient import TestClient


def test_health_check(client: TestClient) -> None:
    """Test health check endpoint returns successful response.

    Args:
        client: TestClient fixture with mocked dependencies.
    """
    # Make request to health check endpoint
    response = client.get("/api/v1/health")

    # Verify status code is 200
    assert response.status_code == 200

    # Verify response body structure
    data = response.json()
    assert "status" in data
    assert "version" in data
    assert "environment" in data
    assert "timestamp" in data

    # Verify status is healthy
    assert data["status"] == "healthy"
