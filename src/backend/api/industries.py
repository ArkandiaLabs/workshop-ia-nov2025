"""API router for Industry endpoints.

This module defines REST API endpoints for industry-related operations.
"""

import logging

from fastapi import APIRouter, Depends, HTTPException
from supabase import Client

from backend.core.database import get_db
from backend.schemas.industry import IndustryListResponse
from backend.services.industry_service import IndustryService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/industries", tags=["industries"])


@router.get("/", response_model=IndustryListResponse, status_code=200)
def list_industries(client: Client = Depends(get_db)) -> IndustryListResponse:
    """List all industries.

    Args:
        client: Supabase client (injected dependency).

    Returns:
        IndustryListResponse containing list of industries and total count.

    Raises:
        HTTPException: 500 if there's an error fetching data.
    """
    try:
        # Log incoming request
        logger.info("GET /api/v1/industries")

        # Create service instance and fetch data
        service = IndustryService(client)
        result = service.list_industries()

        # Log successful response
        logger.info(f"Successfully returned {result.total} industries")

        return result

    except Exception as e:
        # Log error with full details
        logger.error(f"Error fetching industries: {e}", exc_info=True)

        # Return generic error to client
        raise HTTPException(
            status_code=500, detail="Internal server error while fetching industries"
        ) from e
