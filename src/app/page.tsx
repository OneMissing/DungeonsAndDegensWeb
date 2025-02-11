import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (!error && data?.user) {
    redirect('/home');
  }

  return(
    <div className="flex items-center justify-center min-h-screen bg-red-900 w-full">
      <h1>Landing page</h1>
      <button onClick={redirect('/login')}>Get started</button>
    </div>
  );
}