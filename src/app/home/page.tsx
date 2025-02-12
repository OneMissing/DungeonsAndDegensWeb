import { redirect } from 'next/navigation';
import CharacterList from '@/components/characterList';
import Link from 'next/link';
import { createClient } from "@/lib/supabase/server";

const getUserSession = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return data?.user || null; // Return the whole user object
};

export default async function Home() {
  const user = await getUserSession(); // Get the whole user object

  return (
    <div>
      {user ? (
        <>
          <p>Hello {user.email}</p> {/* Access the user's email */}
          <h1>Your Characters</h1>
          <CharacterList userId={user.id} />
        </>
      ) : (
        <p>You must be logged in to view and create characters.</p>
      )}
      <Link href="/home/create">Create character</Link>
    </div>
  );
}
