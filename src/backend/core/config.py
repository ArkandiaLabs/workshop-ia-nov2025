"""Application configuration settings."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)

    app_name: str = "Top SaaS Backend"
    app_version: str = "1.0.0"
    environment: str = "development"
    host: str = "0.0.0.0"
    port: int = 8000
    cors_origins: str = "http://localhost:3000"

    # Supabase configuration
    supabase_url: str = ""
    supabase_key: str = ""


settings = Settings()
