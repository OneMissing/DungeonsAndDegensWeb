"use client";

import { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Session } from '@supabase/supabase-js';
import supabase from '@/lib/supabase';

interface User {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  created_at: string;
}

export default function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  
  // Fetch session and user data on component mount
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

  // Fetch user data when session changes
  useEffect(() => {
    if (session) {
      const fetchUser = async () => {
        const { data, error } = await supabase
          .from('user')
          .select('*')
          .eq('auth_user_id', session.user.id)
          .single(); 
      };

      fetchUser();
    }
  }, [session]);

if (!session) {
        return {
      redirect: {
        destination: '/autorization',
        permanent: false,
      },
    };
  } else {
    return (
      <div>
        <h1>Logged in!</h1>
        {user ? (
          <div>
            <h2>User Details</h2>
            <p>Name: {user.full_name}</p>
            <p>Email: {user.email}</p>
          </div>
        ) : (
          <p>No user data found.</p>
        )}
        <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
      </div>
    );





}
