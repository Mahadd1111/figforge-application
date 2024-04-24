import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [session, setSession] = useState(supabase.auth.getSession()); // Initialize state with current session
  const [isAuthorized, setIsAuthorized] = useState(!!session); // Determine if authorized based on session existence
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Define a function to update state based on the auth changes
    const updateAuthState = (event, session) => {
      setSession(session);
      setIsAuthorized(!!session);
      setLoading(false);
    };

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(updateAuthState);

    // If the component mounts and there's already a session, ensure loading is set to false
    if (session) {
      setLoading(false);
    }

  }, []);

  return { isAuthorized, loadingAuth: loading, session };
}
