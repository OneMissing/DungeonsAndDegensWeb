import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CharacterList from '@/components/characterList';
import Link from 'next/link';
export default async function PrivatePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  return(
    <div>
      <p>Hello {data.user.email}</p>
      <CharacterList />
      <Link href="/home/create">Create character</Link>
    </div>
  );
}