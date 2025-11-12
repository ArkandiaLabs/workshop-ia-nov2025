"""Pydantic schemas for Location model."""

from pydantic import BaseModel, ConfigDict, computed_field


class LocationRead(BaseModel):
    """Schema for reading location data."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    city: str
    country: str

    @computed_field  # type: ignore[misc]
    @property
    def display_name(self) -> str:
        """Generate display name in format 'City, Country'."""
        return f"{self.city}, {self.country}"


class LocationListResponse(BaseModel):
    """Schema for location list response."""

    locations: list[LocationRead]
    total: int
