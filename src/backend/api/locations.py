"""API router for Location endpoints.

This module defines REST API endpoints for location-related operations.
"""

import logging

from fastapi import APIRouter, Depends, HTTPException
from supabase import Client

from backend.core.database import get_db
from backend.schemas.location import LocationListResponse
from backend.services.location_service import LocationService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/locations", tags=["locations"])


@router.get("/", response_model=LocationListResponse, status_code=200)
def list_locations(client: Client = Depends(get_db)) -> LocationListResponse:
    """List all locations.

    Args:
        client: Supabase client (injected dependency).

    Returns:
        LocationListResponse containing list of locations with display_name and total count.

    Raises:
        HTTPException: 500 if there's an error fetching data.
    """
    try:
        # Log incoming request
        logger.info("GET /api/v1/locations")

        # Create service instance and fetch data
        service = LocationService(client)
        result = service.list_locations()

        # Log successful response
        logger.info(f"Successfully returned {result.total} locations")

        return result

    except Exception as e:
        # Log error with full details
        logger.error(f"Error fetching locations: {e}", exc_info=True)

        # Return generic error to client
        raise HTTPException(
            status_code=500, detail="Internal server error while fetching locations"
        ) from e
