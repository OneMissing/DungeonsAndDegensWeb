"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Session } from '@supabase/supabase-js';

// Define the User type
interface User {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  created_at: string;
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export default function App() {
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
          .single(); // Use .single() if you expect only one row

        if (error) {
          console.error('Error fetching user:', error);
        } else {
          setUser(data);
        }
      };

      fetchUser();
    }
  }, [session]);

  // Handle signup
  const handleSignup = async () => {
    try {
      // Step 1: Sign up the user with Supabase Auth
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

      // Step 2: Insert user data into the `user` table
      const { data: userData, error: userError } = await supabase
        .from('user')
        .insert([
          {
            auth_user_id: data.user?.id, // Link to the auth user
            full_name: fullName,
            email: email,
          },
        ])
        .select(); // Use .select() to return the inserted data

      if (userError) {
        console.error('Error inserting into user table:', userError);
        setError(userError.message);
      } else if (userData && userData.length > 0) {
        console.log('User created in user table:', userData);
        setUser(userData[0]); // Update the user state
      } else {
        setError('No data returned from the insert operation.');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred.');
    }
  };

  // Render the Auth UI if no session, otherwise render the user details
  if (!session) {
    return (
      <div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google', 'github']} // Add providers if needed
        />
      </div>
    );
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
}