import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const useUserProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async (userId) => {
      try {
        const { data, error: fetchError } = await supabase
          .rpc("get_user_projects", { user_uuid: userId });

        if (fetchError) {
          throw fetchError;
        }

        setProjects(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const session = supabase.auth.getSession();

    if (session && session.user) {
      fetchProjects(session.user.id);
    } else {
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session && session.user) {
          fetchProjects(session.user.id);
        }
      });
    }
  }, []);

  return { projects, loadingProjects: loading, error };
};
