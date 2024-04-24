# supabase_client.py
from supabase import create_client
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get Supabase URL and key from environment variables
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

# Initialize Supabase client
supabase = create_client(supabase_url, supabase_key)
