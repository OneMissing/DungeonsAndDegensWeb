import { redirect } from "next/navigation";
import CharacterList from "@/components/character/characterList";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/character/sidebar/sidebar"
/*

</div>
*/
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
                <div>
                    <div className='flex'>
                        <Sidebar />
                        <CharacterList userId={user.id} dm={true} />
                        <CharacterList userId={user.id} dm={false} />
                    </div>
                </div>
            ) : (
                <p>You must be logged in to view and create characters.</p>
            )}
        </div>
    );
}
