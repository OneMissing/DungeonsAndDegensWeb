export interface Character {
	character_id: string;
	user_id: string;
	name: string;
	race: string;
	class: string;
	background: string;
	alignment: string;
	created_at: string;
	player_id: string;
	strength: number;
	dexterity: number;
	constitution: number;
	intelligence: number;
	wisdom: number;
	charisma: number;
	level: number;
	hpmax: number;
	hpnow: number;
	hptmp: number;
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
	spell_slot_1: number;
	spell_slot_2: number;
	spell_slot_3: number;
	spell_slot_4: number;
	spell_slot_5: number;
	spell_slot_6: number;
	spell_slot_7: number;
	spell_slot_8: number;
	spell_slot_9: number;
}

export interface Item {
	description: string;
	item_id: string;
	name: string;
	type: string;
	weight: number;
	value: number;
	damage_acid?: string;
	damage_fire?: string;
	damage_ice?: string;
	damage_piercing?: string;
	heal?: string;
	armor_class?: string;
}

export interface InventoryItem {
	inventory_id: string;
	character_id: string;
	item_id: string;
	quantity: number;
	position: number;
	item: Item;
}

export interface Tile {
	id: string;
	position: number;
	item?: InventoryItem | null;
	isSideSlot?: boolean;
	isTrash?: boolean;
	slotType?: string;
}

export interface Spell {
	spell_id: string;
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

export interface Action {
	action_id: string;
	character_id: string;
	spell_id: string;
}

export function itemFilter(items: Item[], itemId: string): Item | undefined {
	return items.find((item) => item.item_id === itemId);
}

export const uniqueInstanceTypes = ["helmet", "chestplate", "armor", "gauntlets", "boots", "weapon", "sword", "bow", "knife", "polearm", "axe", "staff", "wand", "shield"];


export enum Classes {
    barbarian = "barbarian",
    bard = "bard",
    cleric = "cleric",
    druid = "druid",
    fighter = "fighter",
    monk = "monk",
    paladin = "paladin",
    ranger = "ranger",
    rogue = "rogue",
    sorcerer = "sorcerer",
    warlock = "warlock",
    wizard = "wizard",
}

export enum Races {
    dragonborn = "dragonborn",
    dwarf = "dwarf",
    elf = "elf",
    gnome = "gnome",
    halfelf = "half-elf",
    halfling = "halfling",
    halforc = "half-orc",
    human = "human",
    tiefling = "tiefling",
    aarakocra = "aarakocra",
    genasi = "genasi",
    goliath = "goliath",
    tabaxi = "tabaxi",
    firbolg = "firbolg",
    kenku = "kenku",
    lizardfolk = "lizardfolk",
    tortle = "tortle",
    yuanti = "yuan-ti pureblood",
    goblin = "goblin",
    hobgoblin = "hobgoblin",
    bugbear = "bugbear",
    kobold = "kobold",
    changeling = "changeling",
    warforged = "warforged",
    shifter = "shifter",
    gith = "gith",
    satyr = "satyr",
    minotaur = "minotaur",
    centaur = "centaur",
    loxodon = "loxodon",
    vedalken = "vedalken",
    simichybrid = "simic hybrid",
    harengon = "harengon",
    owlin = "owlin"
}

