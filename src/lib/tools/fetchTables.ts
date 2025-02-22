"use client";
import { createClient } from "../supabase/client";
import { Character, CharacterAttribute, CharacterSkill, CharacterStat, Inventory, Item, ItemEffect, Spell } from "./types";
export const supabase = createClient();
export async function user() {
    const { data, error } = await supabase.auth.getUser();
    return error ? null : data.user;
}

export async function fetchTable<T>(
    table: string,
    column?: string,
    value?: any
): Promise<T[] | null> {
    let query = supabase.from(table).select("*");
    if (column && value !== undefined) query = query.eq(column, value);
    const { data, error } = await query;
    if (error) {
        console.error(`Error fetching ${table}:`, error);
        return null;
    }
    return data ?? null;
}

export async function fetchDmCharacters(): Promise<Character[]> {
    const currentUser = await user();
    if (!currentUser) return [];
    const data = await fetchTable<Character>("characters", "user_id", currentUser.id);
    return data ?? [];
}

export async function fetchPlayerCharacters(): Promise<Character[]> {
    const currentUser = await user();
    if (!currentUser) return [];
    const data = await fetchTable<Character>("characters", "player_id", currentUser.id);
    return data ?? [];
}

export async function fetchCharacterAttributes(): Promise<CharacterAttribute[]> {
    const data = await fetchTable<CharacterAttribute>("character_attrib");
    return data ?? [];
}

export async function fetchCharacterSkills(character_id: string | undefined): Promise<CharacterSkill[]> {
    const data = await fetchTable<CharacterSkill>("character_skills","character_id",character_id);
    return data ?? [];
}

export async function fetchCharacterStats(): Promise<CharacterStat[]> {
    const data = await fetchTable<CharacterStat>("character_stats");
    return data ?? [];
}

export async function fetchInventory(): Promise<Inventory[]> {
    const data = await fetchTable<Inventory>("inventory");
    return data ?? [];
}

export async function fetchItems(): Promise<Item[]> {
    const data = await fetchTable<Item>("items");
    return data ?? [];
}

export async function fetchItemEffects(): Promise<ItemEffect[]> {
    const data = await fetchTable<ItemEffect>("item_effects");
    return data ?? [];
}

export async function fetchSpells(): Promise<Spell[]> {
    const data = await fetchTable<Spell>("spells");
    return data ?? [];
}

