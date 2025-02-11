'use client';

import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
export default function SignOutButton() {
  const router = useRouter();
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <button onClick={handleSignOut}>
      Sign Out
    </button>
  );
}
