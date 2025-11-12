"""Supabase database client configuration."""

from supabase import Client, create_client

from backend.core.config import settings


def get_supabase_client() -> Client:
    """Create and return a Supabase client instance.

    Returns:
        Client: Configured Supabase client.
    """
    return create_client(settings.supabase_url, settings.supabase_key)


def get_db() -> Client:
    """FastAPI dependency for getting Supabase client.

    Returns:
        Client: Supabase client instance.
    """
    return get_supabase_client()
