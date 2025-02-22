import { redirect } from "next/navigation";
import CharacterList from "@/components/character/characterList";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/ui/sidebar"
import LinkCharacter from "@/components/character/sidebar/linkCharacter";

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
                <div className="h-main flex">
                        <Sidebar width="20rem" >
                            <LinkCharacter />
                            <Link href='/home/create'>Create character</Link>
                        </Sidebar>
                        <CharacterList userId={user.id} dm={true } />
                        <CharacterList userId={user.id} dm={false} />
                </div>
            ) : (
                <p>You must be logged in to view and create characters.</p>
            )}
        </div>
    );
}
