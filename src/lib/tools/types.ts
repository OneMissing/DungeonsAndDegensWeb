export interface Character {
	character_id: string;
	user_id: string;
	player_id: string;
	name: string;
	race: string;
	class: string;
	background: string;
	alignment: string;
	created_at: string;

	// Attributes
	strength: number;
	dexterity: number;
	constitution: number;
	intelligence: number;
	wisdom: number;
	charisma: number;

	// Stats
	level: number;
	hpmax: number;
	hpnow: number;
	hptmp: number;
	ac: number;

	// Skills
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

export function itemFilter(items: Item[], itemId: string): Item | undefined {
    return items.find(item => item.item_id === itemId);
}

export const uniqueInstanceTypes = ["helmet", "chestplate", "armor", "gauntlets", "boots", "weapon", "sword", "bow", "knife", "polearm", "axe", "staff", "wand", "shield"];