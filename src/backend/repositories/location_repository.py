"""Repository for Location data access using Supabase."""

import logging

from supabase import Client

logger = logging.getLogger(__name__)


class LocationRepository:
    """Repository for accessing location data from Supabase."""

    def __init__(self, client: Client) -> None:
        """Initialize repository with Supabase client.

        Args:
            client: Supabase client instance.
        """
        self.client = client

    def get_all(self) -> list[dict]:
        """Get all locations ordered by country and city.

        Returns:
            List of location dictionaries ordered by country, then city.

        Raises:
            Exception: If query execution fails.
        """
        try:
            # Build query with ordering by country, then city
            query = self.client.table("location").select("*").order("country").order("city")

            # Execute query
            response = query.execute()

            logger.info(f"Retrieved {len(response.data)} locations")

            return response.data

        except Exception as e:
            logger.error(f"Error fetching locations: {e}")
            raise
