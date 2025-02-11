"use client";

import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import supabase from '@/lib/supabase';

export default function useIsLoggedIn(): boolean {
  const [session, setSession] = useState<Session | null>(null);

  // Fetch session on component mount
  useEffect(() => {
    // Fetch the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  // Return whether the user is logged in
  return !!session;
}
