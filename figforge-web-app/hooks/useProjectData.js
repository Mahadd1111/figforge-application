"use client"
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const useProjectData = (projectId) => {
  const [projectPages, setProjectPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) {
      setError('No project ID provided');
      setLoading(false);
      return;
    }

    const fetchProjectPages = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_project_details2', { p_project_id: projectId });

        if (error) {
          throw error;
        }

        setProjectPages(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectPages();
  }, [projectId]);

  return { projectPages, loading, error };
};

export default useProjectData;
