"""Service layer for Industry business logic.

This module implements the business logic layer for industries,
transforming repository data into response schemas.
"""

import logging

from supabase import Client

from backend.repositories.industry_repository import IndustryRepository
from backend.schemas.industry import IndustryListResponse, IndustryRead

logger = logging.getLogger(__name__)


class IndustryService:
    """Service for managing industry business logic.

    Attributes:
        client: Supabase client for database access.
    """

    def __init__(self, client: Client) -> None:
        """Initialize IndustryService.

        Args:
            client: Supabase client instance.
        """
        self.client = client

    def list_industries(self) -> IndustryListResponse:
        """List all industries.

        Returns:
            IndustryListResponse with industries list and total count.

        Raises:
            Exception: If there's an error fetching or transforming data.
        """
        try:
            # Log request
            logger.info("Fetching all industries")

            # Fetch data from repository
            repository = IndustryRepository(self.client)
            industries_data = repository.get_all()

            # Transform data to Pydantic schemas
            industries_read = [
                IndustryRead(id=industry_dict["id"], name=industry_dict["name"])
                for industry_dict in industries_data
            ]

            # Log result
            logger.info(f"Found {len(industries_read)} industries")

            # Return response
            return IndustryListResponse(industries=industries_read, total=len(industries_read))

        except Exception as e:
            logger.error(f"Error fetching industries: {e}")
            raise
