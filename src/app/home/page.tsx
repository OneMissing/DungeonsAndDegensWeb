import { redirect } from "next/navigation";
import CharacterList from "@/components/character/list";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/ui/sidebar";
import LinkCharacter from "@/components/character/changes/link";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CreateChar from "@/components/character/changes/create";

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
            <div className="absolute bottom-0 w-full">
              <div className="grid gap-y-1.5 px-4 py-6">
                <LinkCharacter />
                <CreateChar />
              </div>
            </div>
          </Sidebar>
          <div className="w-full grid grid-cols-1 md:grid-cols-2">
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
