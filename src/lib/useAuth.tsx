import supabase from './supabase';
import crypto from 'crypto';
import { useState } from 'react';

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256').toString('hex');
  return `${salt}:${hashedPassword}`;
}

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUser = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const hashedPassword = hashPassword(password);

      const { error } = await supabase.from('users').insert([{ email, password: hashedPassword }]);

      if (error) throw error;

      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error };
}
