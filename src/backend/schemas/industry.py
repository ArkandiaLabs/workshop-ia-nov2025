"""Pydantic schemas for Industry model."""

from pydantic import BaseModel, ConfigDict


class IndustryRead(BaseModel):
    """Schema for reading industry data."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class IndustryListResponse(BaseModel):
    """Schema for industry list response."""

    industries: list[IndustryRead]
    total: int
