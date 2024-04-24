import { createClient } from '@supabase/supabase-js';

// Your Supabase URL and public API key
const supabaseUrl = 'https://kpclehqrncegbgduiysb.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwY2xlaHFybmNlZ2JnZHVpeXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk1MTIzMTYsImV4cCI6MjAxNTA4ODMxNn0.1EZExw5NZdMaWWk5TdBF-F7pWsOapuKxseVh96kXlBQ';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);
