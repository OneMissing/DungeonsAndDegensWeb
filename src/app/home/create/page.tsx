import { createClient } from "@/lib/supabase/server";
import CreateCharacter from "@/components/characterCreator";

const getUserSession = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return data?.user?.id || null;
};

export default async function Page() {
  const userId = await getUserSession();

  return (
    <div>
      <h1>Your Characters</h1>
      <CreateCharacter userId={userId} />
    </div>
  );
}
