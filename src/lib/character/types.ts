export interface Character {
    id: string;
    name: string;
    race: string;
    class: string;
    level: number;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    hpmax: number;
    hptmp: number;
    hpnow: number;
    ac: number;
};

export interface Skills {
    acrobatics: number;
    animal_handling: number;
    arcana: number;
    athletics: number;
    deception: number;
    history: number;
    insight: number;
    intimidation: number;
    investigation: number;
    medicine: number;
    nature: number;
    perception: number;
    performance: number;
    persuasion: number;
    religion: number;
    sleight_of_hand: number;
    stealth: number;
    survival: number;
}

export enum Races {
    Dragonborn = "Dragonborn",
    Dwarf = "Dwarf",
    Elf = "Elf",
    Gnome = "Gnome",
    HalfElf = "Half-Elf",
    Halfling = "Halfling",
    HalfOrc = "Half-Orc",
    Human = "Human",
    Tiefling = "Tiefling",
    Aarakocra = "Aarakocra",
    Genasi = "Genasi",
    Goliath = "Goliath",
    Tabaxi = "Tabaxi",
    Firbolg = "Firbolg",
    Kenku = "Kenku",
    Lizardfolk = "Lizardfolk",
    Tortle = "Tortle",
    YuanTi = "Yuan-Ti Pureblood",
    Goblin = "Goblin",
    Hobgoblin = "Hobgoblin",
    Bugbear = "Bugbear",
    Kobold = "Kobold",
    Changeling = "Changeling",
    Warforged = "Warforged",
    Shifter = "Shifter",
    Gith = "Gith",
    Satyr = "Satyr",
    Minotaur = "Minotaur",
    Centaur = "Centaur",
    Loxodon = "Loxodon",
    Vedalken = "Vedalken",
    SimicHybrid = "Simic Hybrid",
    Harengon = "Harengon",
    Owlin = "Owlin"
}

export enum Classes {
    Barbarian = "Barbarian",
    Bard = "Bard",
    Cleric = "Cleric",
    Druid = "Druid",
    Fighter = "Fighter",
    Monk = "Monk",
    Paladin = "Paladin",
    Ranger = "Ranger",
    Rogue = "Rogue",
    Sorcerer = "Sorcerer",
    Warlock = "Warlock",
    Wizard = "Wizard",
}

export const getLevelUpPoints = (charClass: Classes, level: number): number => {
    const basePoints: Record<Classes, number> = {
        [Classes.Barbarian]:    2,
        [Classes.Bard]:         2,
        [Classes.Cleric]:       2,
        [Classes.Druid]:        2,
        [Classes.Fighter]:      2,
        [Classes.Monk]:         2,
        [Classes.Paladin]:      2,
        [Classes.Ranger]:       2,
        [Classes.Rogue]:        2,
        [Classes.Sorcerer]:     2,
        [Classes.Warlock]:      2,
        [Classes.Wizard]:       2,
    };
    return basePoints[charClass] + Math.floor(level / 5);
};

export async function updateCharacter(
    characterId: string,
    updates: Partial<Omit<Character, 'id'>>,
    supabase: any
): Promise<void> {
    try {
        const { error } = await supabase.from("characters").update(updates).eq("id", characterId);
        if (error) throw error;
    } catch (error) {
        console.error("Failed to update character:", error);
    }
}
