"""Service layer for Location business logic.

This module implements the business logic layer for locations,
transforming repository data into response schemas.
"""

import logging

from supabase import Client

from backend.repositories.location_repository import LocationRepository
from backend.schemas.location import LocationListResponse, LocationRead

logger = logging.getLogger(__name__)


class LocationService:
    """Service for managing location business logic.

    Attributes:
        client: Supabase client for database access.
    """

    def __init__(self, client: Client) -> None:
        """Initialize LocationService.

        Args:
            client: Supabase client instance.
        """
        self.client = client

    def list_locations(self) -> LocationListResponse:
        """List all locations.

        Returns:
            LocationListResponse with locations list and total count.
            Each location includes computed display_name field.

        Raises:
            Exception: If there's an error fetching or transforming data.
        """
        try:
            # Log request
            logger.info("Fetching all locations")

            # Fetch data from repository
            repository = LocationRepository(self.client)
            locations_data = repository.get_all()

            # Transform data to Pydantic schemas
            # LocationRead will automatically compute display_name via @computed_field
            locations_read = [
                LocationRead(
                    id=location_dict["id"],
                    city=location_dict["city"],
                    country=location_dict["country"],
                )
                for location_dict in locations_data
            ]

            # Log result
            logger.info(f"Found {len(locations_read)} locations")

            # Return response
            return LocationListResponse(locations=locations_read, total=len(locations_read))

        except Exception as e:
            logger.error(f"Error fetching locations: {e}")
            raise
