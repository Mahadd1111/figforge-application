"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Adjust the path as needed

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.getSession();

    setSession(session);
    setUser(session?.user || null);

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return <UserContext.Provider value={{ user, session }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
