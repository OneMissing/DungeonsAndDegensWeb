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

export interface Character {
    id: string;
    user_id: string;
    name: string;
    race: string;
    class: string;
    background: string;
    alignment: string;
    created_at: string;
    player_id: string;
}

export interface CharacterAttribute {
    character_id?: string;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
}

export interface CharacterSkill {
    character_id?: string;
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

export interface CharacterStat {
    character_id?: string;
    level: number;
    hpmax: number;
    hpnow: number;
    hptmp: number;
    ac: number;
}

export interface Inventory {
    id: string;
    character_id: string;
    item_id: string;
    quantity: number;
}

export interface Item {
    id: string;
    name: string;
    description: string;
    type: string;
    weight: number;
    value: number;
}

export interface ItemEffect {
    item_id: string;
    acid_dice_count?: number;
    acid_dice_sides?: number;
    bludgeoning_dice_count?: number;
    bludgeoning_dice_sides?: number;
    cold_dice_count?: number;
    cold_dice_sides?: number;
    fire_dice_count?: number;
    fire_dice_sides?: number;
    force_dice_count?: number;
    force_dice_sides?: number;
    lightning_dice_count?: number;
    lightning_dice_sides?: number;
    necrotic_dice_count?: number;
    necrotic_dice_sides?: number;
    piercing_dice_count?: number;
    piercing_dice_sides?: number;
    poison_dice_count?: number;
    poison_dice_sides?: number;
    psychic_dice_count?: number;
    psychic_dice_sides?: number;
    radiant_dice_count?: number;
    radiant_dice_sides?: number;
    slashing_dice_count?: number;
    slashing_dice_sides?: number;
    thunder_dice_count?: number;
    thunder_dice_sides?: number;
    healing_dice_count?: number;
    healing_dice_sides?: number;
    armor_class?: number;
}

export interface Spell {
    id: string;
    name: string;
    description: string;
    level: number;
    school: string;
    casting_time: string;
    range: string;
    components: string;
    duration: string;
    concentration: boolean;
    ritual: boolean;
}