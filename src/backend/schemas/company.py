"""Pydantic schemas for Company model."""

from typing import Any

from pydantic import BaseModel, ConfigDict


class IndustryNested(BaseModel):
    """Nested schema for industry data in company responses."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class LocationNested(BaseModel):
    """Nested schema for location data in company responses."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    city: str
    country: str


class CompanyRead(BaseModel):
    """Schema for reading company data."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    industry: IndustryNested
    location: LocationNested
    products: str | None = None
    founding_year: int | None = None
    total_funding: int | None = None
    arr: int | None = None
    valuation: int | None = None
    employees: int | None = None
    g2_rating: float | None = None


class CompanyListResponse(BaseModel):
    """Schema for company list response."""

    companies: list[CompanyRead]
    total: int
    filters_applied: dict[str, Any]
