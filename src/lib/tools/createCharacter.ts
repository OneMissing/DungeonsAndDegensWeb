import { createClient } from "../supabase/client";
import { CharacterAttribute, CharacterSkill, Classes, Races } from "./types";
import { user } from "./fetchTables"

export const createCharacter = async (
    name: string,
    race: Races,
    charClass: Classes,
    attributes: CharacterAttribute,
) => {
    const supabase = createClient();
    const currentUser = await user();
    const { data, error } = await supabase
        .from("characters")
        .insert([
            {
                player_id: currentUser?.id,
                name: name,
                race: race,
                class: charClass,
            },
        ])
        .select("id")
        .single();

    if (error) {
        console.error("Error creating character:", error);
        return null;
    }

    const characterId = data.id;

    const { error: attribError } = await supabase
        .from("character_attrib")
        .insert([
            {
                character_id: characterId,
                ...attributes,
            },
        ]);

    if (attribError) {
        console.error("Error inserting attributes:", attribError);
        return null;
    }

    return characterId;
};
