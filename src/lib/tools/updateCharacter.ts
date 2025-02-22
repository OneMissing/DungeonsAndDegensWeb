import { createClient } from "../supabase/client";
import { Character } from "./types";

export async function updateCharacter(
    characterId: string,
    updates: Partial<Omit<Character, "id">>
): Promise<void> {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from("characters")
            .update(updates)
            .eq("id", characterId);
        if (error) throw error;
    } catch (error) {
        console.error("Failed to update character:", error);
    }
}