import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import CreateCharacter from '@/components/characterCreator';
export default async function PrivatePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  return(
    <div>
      <p>Hello {data.user.email}</p>
      <CreateCharacter />
    </div>
  );
}