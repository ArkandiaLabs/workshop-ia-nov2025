"""Repository for Industry data access using Supabase."""

import logging
from typing import Any

from supabase import Client

logger = logging.getLogger(__name__)


class IndustryRepository:
    """Repository for accessing industry data from Supabase."""

    def __init__(self, client: Client) -> None:
        """Initialize repository with Supabase client.

        Args:
            client: Supabase client instance.
        """
        self.client = client

    def get_all(self) -> list[Any]:
        """Get all industries ordered alphabetically by name.

        Returns:
            List of industry dictionaries ordered by name.

        Raises:
            Exception: If query execution fails.
        """
        try:
            # Build query with ordering by name
            query = self.client.table("industry").select("*").order("name")

            # Execute query
            response = query.execute()

            logger.info(f"Retrieved {len(response.data)} industries")

            return response.data

        except Exception as e:
            logger.error(f"Error fetching industries: {e}")
            raise
