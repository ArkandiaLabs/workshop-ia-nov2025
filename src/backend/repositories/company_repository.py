"""Repository for Company data access using Supabase."""

import logging
from typing import Any

from supabase import Client

logger = logging.getLogger(__name__)


class CompanyRepository:
    """Repository for accessing company data from Supabase."""

    def __init__(self, client: Client) -> None:
        """Initialize repository with Supabase client.

        Args:
            client: Supabase client instance.
        """
        self.client = client

    def get_all(self, industry_id: int | None = None, location_id: int | None = None) -> list[Any]:
        """Get all companies with optional filters.

        Args:
            industry_id: Optional industry ID to filter by.
            location_id: Optional location ID to filter by.

        Returns:
            List of company dictionaries with nested industry and location data.

        Raises:
            Exception: If query execution fails.
        """
        try:
            # Build base query with nested industry and location data
            query = self.client.table("company").select("*, industry(*), location(*)")

            # Apply industry filter if provided
            if industry_id is not None:
                query = query.eq("industry_id", industry_id)
                logger.debug(f"Applied industry filter: industry_id={industry_id}")

            # Apply location filter if provided
            if location_id is not None:
                query = query.eq("location_id", location_id)
                logger.debug(f"Applied location filter: location_id={location_id}")

            # Execute query
            response = query.execute()

            logger.info(
                f"Retrieved {len(response.data)} companies "
                f"(industry_id={industry_id}, location_id={location_id})"
            )

            return response.data

        except Exception as e:
            logger.error(
                f"Error fetching companies: {e} "
                f"(industry_id={industry_id}, location_id={location_id})"
            )
            raise
