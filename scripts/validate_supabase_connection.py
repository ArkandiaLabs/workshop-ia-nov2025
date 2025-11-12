"""Script to validate Supabase database connection.

This script tests the connection to the Supabase database by executing
a simple query to fetch one company record.
"""

import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client


def main() -> None:
    """Validate Supabase connection by executing a simple query."""
    # Load environment variables from backend/.env
    backend_path = Path(__file__).parent.parent / "src" / "backend"
    env_file = backend_path / ".env"
    
    if not env_file.exists():
        print(f"❌ Error: .env file not found at {env_file}")
        print("   Please create .env file with SUPABASE_URL and SUPABASE_KEY")
        sys.exit(1)
    
    load_dotenv(env_file)
    
    # Get Supabase credentials
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    
    if not supabase_url or not supabase_key:
        print("❌ Error: Missing Supabase credentials in .env file")
        print("   Required: SUPABASE_URL and SUPABASE_KEY")
        sys.exit(1)
    
    print("🔌 Validating Supabase connection...")
    print("-" * 50)
    print(f"   URL: {supabase_url}")
    print(f"   Key: {supabase_key[:20]}...")

    try:
        # Create Supabase client
        client: Client = create_client(supabase_url, supabase_key)
        print("✅ Supabase client created successfully")

        # Execute simple query to fetch one company
        print("\n📊 Executing test query: SELECT id FROM company LIMIT 1")
        response = client.table("company").select("id").limit(1).execute()

        # Verify response
        if response.data:
            print(f"✅ Query executed successfully!")
            print(f"   Retrieved {len(response.data)} record(s)")
            print(f"   Sample data: {response.data}")
        else:
            print("⚠️  Query executed but returned no data")
            print("   This might mean the 'company' table is empty")

        print("\n" + "=" * 50)
        print("✅ CONNECTION VALIDATED SUCCESSFULLY!")
        print("=" * 50)

    except Exception as e:
        print("\n" + "=" * 50)
        print("❌ CONNECTION VALIDATION FAILED!")
        print("=" * 50)
        print(f"\nError type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        print("\nPlease check:")
        print("1. SUPABASE_URL is correctly set in .env")
        print("2. SUPABASE_KEY is correctly set in .env")
        print("3. The database tables have been created")
        print("4. Network connectivity to Supabase")
        sys.exit(1)


if __name__ == "__main__":
    main()
