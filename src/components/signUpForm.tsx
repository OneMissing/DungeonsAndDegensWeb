"use client";

import { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Session } from '@supabase/supabase-js';
import supabase from '@/lib/supabase';
import { useRouter } from "next/navigation";

interface User {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  created_at: string;
}

const handleHome = async () => {
  const router = useRouter();
  await supabase.auth.signOut();
  router.push('/home');
};

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const handleSignup = async () => {
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      console.log('Auth user created:', data.user);

      const { data: userData, error: userError } = await supabase
        .from('user')
        .insert([
          {
            auth_user_id: data.user?.id,
            full_name: fullName,
            email: email,
          },
        ])
        .select();

      if (userError) {
        console.error('Error inserting into user table:', userError);
        setError(userError.message);
      } else if (userData && userData.length > 0) {
        console.log('User created in user table:', userData);
        setUser(userData[0]);
      } else {
        setError('No data returned from the insert operation.');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred.');
    }
  };
  
  if (!session) {
    return (
      <div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google', 'github']}
        />
      </div>
    );
  } 
  else {
    handleHome();
  }
}