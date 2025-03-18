export interface Character {
  character_id: string;
  user_id: string;
  player_id: string;
  name: string;
  race: string;
  class: string;
  proficiency: number;
  background: string;
  alignment: string;
  created_at: string;
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
  damage_bludgeoning?: string;
  damage_cold?: string;
  damage_fire?: string;
  damage_force?: string;
  damage_lightning?: string;
  damage_necrotic?: string;
  damage_piercing?: string;
  damage_poison?: string;
  damage_psychic?: string;
  damage_radiant?: string;
  damage_slashing?: string;
  damage_thunder?: string;
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

export const uniqueInstanceTypes = ["helmet", "chestplate", "armor", "gauntlets", "boots", "weapon", "sword", "bow", "knife", "polearm", "axe", "staff", "wand", "shield", "bow"];

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
  owlin = "owlin",
}
export const cantripSlotTable: { [className: string]: { [level: number]: number } } = {
  wizard: {
    1: 3,
    2: 0,
    3: 0,
    4: 1,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 1,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
  }, 
  
  cleric: {
    1: 3,
    2: 0,
    3: 0,
    4: 1,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 1,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
  }, 
  
  druid: {
    1: 2,
    2: 0,
    3: 0,
    4: 1,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 1,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
  },
  
  warlock: {
    1: 2,
    2: 0,
    3: 0,
    4: 1,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 1,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
  },
  
  sorcerer: {
    1: 4,
    2: 0,
    3: 0,
    4: 1,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 1,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
  }, 
  
  bard: {
    1: 2,
    2: 0,
    3: 0,
    4: 1,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 1,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
  }
}

export const spellSlotTable: { [className: string]: { [level: number]: number[] } } = {
  wizard: {
    1:  [3],
    2:  [2],
    3:  [2, 2],
    4:  [1, 2],
    5:  [0, 1, 2],
    6:  [0, 1, 1],
    7:  [0, 0, 1, 1],
    8:  [0, 0, 0, 1],
    9:  [0, 0, 0, 1, 1],
    10: [0, 0, 0, 0, 1],
    11: [0, 0, 0, 0, 1, 1],
    12: [0, 0, 0, 0, 0, 2],
    13: [0, 0, 0, 0, 0, 1, 1],
    14: [0, 0, 0, 0, 0, 0, 1],
    15: [0, 0, 0, 0, 0, 0, 1, 1],
    16: [0, 0, 0, 0, 0, 0, 1, 1],
    17: [0, 0, 0, 0, 0, 0, 0, 1, 1],
    18: [0, 0, 0, 0, 0, 0, 0, 1, 1],
    19: [0, 0, 0, 0, 0, 1, 0, 0, 1],
    20: [0, 0, 0, 0, 0, 0, 1, 0, 1],
  },cleric: {
    1:  [2],
    2:  [1],
    3:  [1, 2],
    4:  [0, 1],
    5:  [0, 0, 2],
    6:  [0, 0, 1],
    7:  [0, 0, 0, 1],
    8:  [0, 0, 0, 1],
    9:  [0, 0, 0, 1, 1],
    10: [0, 0, 0, 0, 1],
    11: [0, 0, 0, 0, 0, 1],
    12: [0, 0, 0, 0, 0, 0],
    13: [0, 0, 0, 0, 0, 0, 1],
    14: [0, 0, 0, 0, 0, 0, 1],
    15: [0, 0, 0, 0, 0, 0, 1, 1],
    16: [0, 0, 0, 0, 0, 0, 0, 1],
    17: [0, 0, 0, 0, 0, 0, 0, 1, 1],
    18: [0, 0, 0, 0, 0, 0, 0, 1, 1],
    19: [0, 0, 0, 0, 0, 1, 0, 0, 1],
    20: [0, 0, 0, 0, 0, 0, 1, 0, 1],
  },druid: {
    1:  [2],
    2:  [1],
    3:  [1, 2],
    4:  [0, 1],
    5:  [0, 0, 2],
    6:  [0, 0, 1],
    7:  [0, 0, 0, 1],
    8:  [0, 0, 0, 1],
    9:  [0, 0, 0, 1, 1],
    10: [0, 0, 0, 0, 1],
    11: [0, 0, 0, 0, 0, 1],
    12: [0, 0, 0, 0, 0, 0],
    13: [0, 0, 0, 0, 0, 0, 1],
    14: [0, 0, 0, 0, 0, 0, 1],
    15: [0, 0, 0, 0, 0, 0, 1, 1],
    16: [0, 0, 0, 0, 0, 0, 0, 1],
    17: [0, 0, 0, 0, 0, 0, 0, 1, 1],
    18: [0, 0, 0, 0, 0, 0, 0, 1, 1],
    19: [0, 0, 0, 0, 0, 1, 0, 0, 1],
    20: [0, 0, 0, 0, 0, 0, 1, 0, 1],
  },sorcerer: {
    1:  [2],
    2:  [1],
    3:  [1, 2],
    4:  [0, 1],
    5:  [0, 0, 2],
    6:  [0, 0, 1],
    7:  [0, 0, 0, 1],
    8:  [0, 0, 0, 1],
    9:  [0, 0, 0, 1, 1],
    10: [0, 0, 0, 0, 1],
    11: [0, 0, 0, 0, 0, 1],
    12: [0, 0, 0, 0, 0, 0],
    13: [0, 0, 0, 0, 0, 0, 1],
    14: [0, 0, 0, 0, 0, 0, 1],
    15: [0, 0, 0, 0, 0, 0, 1, 1],
    16: [0, 0, 0, 0, 0, 0, 0, 1],
    17: [0, 0, 0, 0, 0, 0, 0, 1, 1],
    18: [0, 0, 0, 0, 0, 0, 0, 1, 1],
    19: [0, 0, 0, 0, 0, 1, 0, 0, 1],
    20: [0, 0, 0, 0, 0, 0, 1, 0, 1],
  },bard: {
    1:  [2],
    2:  [1],
    3:  [1, 2],
    4:  [0, 1],
    5:  [0, 0, 2],
    6:  [0, 0, 1],
    7:  [0, 0, 0, 1],
    8:  [0, 0, 0, 1],
    9:  [0, 0, 0, 1, 1],
    10: [0, 0, 0, 0, 1],
    11: [0, 0, 0, 0, 0, 1],
    12: [0, 0, 0, 0, 0, 0],
    13: [0, 0, 0, 0, 0, 0, 1],
    14: [0, 0, 0, 0, 0, 0, 1],
    15: [0, 0, 0, 0, 0, 0, 1, 1],
    16: [0, 0, 0, 0, 0, 0, 0, 1],
    17: [0, 0, 0, 0, 0, 0, 0, 1, 1],
    18: [0, 0, 0, 0, 0, 0, 0, 1, 1],
    19: [0, 0, 0, 0, 0, 1, 0, 0, 1],
    20: [0, 0, 0, 0, 0, 0, 1, 0, 1],
  },paladin: {
    1:  [2],
    2:  [1],
    3:  [1, 2],
    4:  [0, 1],
    5:  [0, 0, 2],
    6:  [0, 0, 1],
    7:  [0, 0, 0, 1],
    8:  [0, 0, 0, 1],
    9:  [0, 0, 0, 1, 1],
    10: [0, 0, 0, 0, 1],
    11: [0, 0, 0, 0, 0, 1],
    12: [0, 0, 0, 0, 0, 0],
    13: [0, 0, 0, 0, 0, 0, 1],
    14: [0, 0, 0, 0, 0, 0, 1],
    15: [0, 0, 0, 0, 0, 0, 1, 1],
    16: [0, 0, 0, 0, 0, 0, 0, 1],
    17: [0, 0, 0, 0, 0, 0, 0, 1, 1],
    18: [0, 0, 0, 0, 0, 0, 0, 1, 1],
    19: [0, 0, 0, 0, 0, 1, 0, 0, 1],
    20: [0, 0, 0, 0, 0, 0, 1, 0, 1],
  },ranger: {
    1:  [2],
    2:  [1],
    3:  [1, 2],
    4:  [0, 1],
    5:  [0, 0, 2],
    6:  [0, 0, 1],
    7:  [0, 0, 0, 1],
    8:  [0, 0, 0, 1],
    9:  [0, 0, 0, 1, 1],
    10: [0, 0, 0, 0, 1],
    11: [0, 0, 0, 0, 0, 1],
    12: [0, 0, 0, 0, 0, 0],
    13: [0, 0, 0, 0, 0, 0, 1],
    14: [0, 0, 0, 0, 0, 0, 1],
    15: [0, 0, 0, 0, 0, 0, 1, 1],
    16: [0, 0, 0, 0, 0, 0, 0, 1],
    17: [0, 0, 0, 0, 0, 0, 0, 1, 1],
    18: [0, 0, 0, 0, 0, 0, 0, 1, 1],
    19: [0, 0, 0, 0, 0, 1, 0, 0, 1],
    20: [0, 0, 0, 0, 0, 0, 1, 0, 1],
  },warlock: {
    1:  [2],
    2:  [1],
    3:  [1, 2],
    4:  [0, 1],
    5:  [0, 0, 2],
    6:  [0, 0, 1],
    7:  [0, 0, 0, 1],
    8:  [0, 0, 0, 1],
    9:  [0, 0, 0, 1, 1],
    10: [0, 0, 0, 0, 1],
    11: [0, 0, 0, 0, 0, 1],
    12: [0, 0, 0, 0, 0, 0],
    13: [0, 0, 0, 0, 0, 0, 1],
    14: [0, 0, 0, 0, 0, 0, 1],
    15: [0, 0, 0, 0, 0, 0, 1, 1],
    16: [0, 0, 0, 0, 0, 0, 0, 1],
    17: [0, 0, 0, 0, 0, 0, 0, 1, 1],
    18: [0, 0, 0, 0, 0, 0, 0, 1, 1],
    19: [0, 0, 0, 0, 0, 1, 0, 0, 1],
    20: [0, 0, 0, 0, 0, 0, 1, 0, 1],
  },
};
