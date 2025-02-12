import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CharacterList from '@/components/characterList';
export default async function PrivatePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/');
  }

  return(
    <div>
      <p>Hello {data.user.email}</p>
      <CharacterList />
    </div>
  );
}