"""Service layer for Company business logic.

This module implements the business logic layer for companies,
transforming repository data into response schemas.
"""

import logging
from typing import Any

from supabase import Client

from backend.repositories.company_repository import CompanyRepository
from backend.schemas.company import (
    CompanyListResponse,
    CompanyRead,
    IndustryNested,
    LocationNested,
)

logger = logging.getLogger(__name__)


class CompanyService:
    """Service for managing company business logic.

    Attributes:
        client: Supabase client for database access.
    """

    def __init__(self, client: Client) -> None:
        """Initialize CompanyService.

        Args:
            client: Supabase client instance.
        """
        self.client = client

    def list_companies(
        self, industry_id: int | None = None, location_id: int | None = None
    ) -> CompanyListResponse:
        """List companies with optional filters.

        Args:
            industry_id: Optional industry ID to filter by.
            location_id: Optional location ID to filter by.

        Returns:
            CompanyListResponse with companies list, total count, and filters metadata.

        Raises:
            Exception: If there's an error fetching or transforming data.
        """
        try:
            # Log request parameters
            logger.info(
                f"Fetching companies with filters: "
                f"industry_id={industry_id}, location_id={location_id}"
            )

            # Fetch data from repository
            repository = CompanyRepository(self.client)
            companies_data = repository.get_all(industry_id=industry_id, location_id=location_id)

            # Transform data to Pydantic schemas
            companies_read = []
            for company_dict in companies_data:
                # Extract nested industry data
                industry_data = company_dict.get("industry", {})
                industry_nested = IndustryNested(
                    id=industry_data.get("id", 0), name=industry_data.get("name", "")
                )

                # Extract nested location data
                location_data = company_dict.get("location", {})
                location_nested = LocationNested(
                    id=location_data.get("id", 0),
                    city=location_data.get("city", ""),
                    country=location_data.get("country", ""),
                )

                # Create CompanyRead instance
                company_read = CompanyRead(
                    id=company_dict["id"],
                    name=company_dict["name"],
                    industry=industry_nested,
                    location=location_nested,
                    products=company_dict.get("products"),
                    founding_year=company_dict.get("founding_year"),
                    total_funding=company_dict.get("total_funding"),
                    arr=company_dict.get("arr"),
                    valuation=company_dict.get("valuation"),
                    employees=company_dict.get("employees"),
                    g2_rating=company_dict.get("g2_rating"),
                )
                companies_read.append(company_read)

            # Build filters metadata
            filters_applied: dict[str, Any] = {
                "industry_id": industry_id,
                "location_id": location_id,
            }

            # Log result
            logger.info(f"Found {len(companies_read)} companies")

            # Return response
            return CompanyListResponse(
                companies=companies_read,
                total=len(companies_read),
                filters_applied=filters_applied,
            )

        except Exception as e:
            logger.error(f"Error fetching companies: {e}")
            raise
