import { createClient } from "@/lib/supabase/client";
import { Character, Inventory, Item } from "@/lib/tools/types";

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

export const getItems = async (): Promise<Item[]> => {
	const { data, error } = await supabase.from("items").select("*");
	if (error) {
		console.error("Error fetching item data:", error);
		return [];
	}
	return data; 
};

export const getInventory = async (character_id: string): Promise<Inventory[]> => {
	const { data, error } = await supabase.from("inventory").select("*").eq("character_id", character_id);
	if (error) {
		console.error("Error fetching item data:", error);
		return [];
	}
	return data; 
};