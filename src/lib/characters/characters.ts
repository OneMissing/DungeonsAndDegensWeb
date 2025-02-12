import supabase from "@/lib/supabase/client";

export async function getCharacters() {
  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching characters:", error);
  return data || [];
}

export async function addCharacter(name: string, race: string, charClass: string) {
    const { data, error } = await supabase.from("characters").insert([
      {
        name,
        race,
        class: charClass,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      },
    ]);
  
    if (error) console.error("Error adding character:", error);
    return data;
  }
  