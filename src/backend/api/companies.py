"""API router for Company endpoints.

This module defines REST API endpoints for company-related operations.
"""

import logging

from fastapi import APIRouter, Depends, HTTPException
from supabase import Client

from backend.core.database import get_db
from backend.schemas.company import CompanyListResponse
from backend.services.company_service import CompanyService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/companies", tags=["companies"])


@router.get("/", response_model=CompanyListResponse, status_code=200)
def list_companies(
    industry_id: int | None = None,
    location_id: int | None = None,
    client: Client = Depends(get_db),
) -> CompanyListResponse:
    """List all companies with optional filters.

    Args:
        industry_id: Optional industry ID to filter by.
        location_id: Optional location ID to filter by.
        client: Supabase client (injected dependency).

    Returns:
        CompanyListResponse containing list of companies, total count, and applied filters.

    Raises:
        HTTPException: 500 if there's an error fetching data.
    """
    try:
        # Log incoming request
        logger.info(
            f"GET /api/v1/companies - Filters: industry_id={industry_id}, location_id={location_id}"
        )

        # Create service instance and fetch data
        service = CompanyService(client)
        result = service.list_companies(industry_id=industry_id, location_id=location_id)

        # Log successful response
        logger.info(
            f"Successfully returned {result.total} companies with filters: {result.filters_applied}"
        )

        return result

    except Exception as e:
        # Log error with full details
        logger.error(
            f"Error fetching companies with filters "
            f"industry_id={industry_id}, location_id={location_id}: {e}",
            exc_info=True,
        )

        # Return generic error to client
        raise HTTPException(
            status_code=500, detail="Internal server error while fetching companies"
        ) from e
