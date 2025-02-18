import { redirect } from 'next/navigation';
import CharacterList from '@/components/character/list';
import Link from 'next/link';
import { createClient } from "@/lib/supabase/server";

const getUserSession = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return data?.user || null; 
};

export default async function Home() {
  const user = await getUserSession(); 
  return (
    <div>
      {user ? (
        <>
          <p>Hello {user.email}</p>
          <CharacterList userId={user.id} />
        </>
      ) : (
        <p>You must be logged in to view and create characters.</p>
      )}
      <Link href="/home/create">Create character</Link>

    </div>
  );
}
