import { createClient } from "@/lib/supabase/client";
import { Character, Item } from "@/lib/tools/types";

const supabase = createClient();

export async function getCharacters(userId: string): Promise<Character[]> {
	const { data, error } = await supabase.from("characters").select("*").or(`user_id.eq.${userId},player_id.eq.{${userId}}`);

	if (error) {
		console.error("Error fetching characters:", error.message);
		return [];
	}

	return data || [];
}

export async function getPlayerCharacters(userId: string): Promise<Character[]> {
	const { data, error } = await supabase.from("characters").select("*").eq("user_id", userId);

	if (error) {
		console.error("Error fetching characters:", error.message);
		return [];
	}

	return data || [];
}

export async function getDmCharacters(userId: string): Promise<Character[]> {
	const { data, error } = await supabase.from("characters").select("*").eq("player_id", userId);

	if (error) {
		console.error("Error fetching characters:", error.message);
		return [];
	}

	return data || [];
}