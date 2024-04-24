import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kpclehqrncegbgduiysb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwY2xlaHFybmNlZ2JnZHVpeXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk1MTIzMTYsImV4cCI6MjAxNTA4ODMxNn0.1EZExw5NZdMaWWk5TdBF-F7pWsOapuKxseVh96kXlBQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
