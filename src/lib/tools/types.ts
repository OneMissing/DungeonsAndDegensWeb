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
    2: 3,
    3: 3,
    4: 3,
    5: 3,
    6: 3,
    7: 3,
    8: 4,
    9: 4,
    10: 4,
    11: 4,
    12: 4,
    13: 4,
    14: 4,
    15: 5,
    16: 5,
    17: 5,
    18: 5,
    19: 5,
    20: 5,
  }, cleric: {
    1: 3,
    2: 3,
    3: 3,
    4: 3,
    5: 3,
    6: 3,
    7: 3,
    8: 4,
    9: 4,
    10: 4,
    11: 4,
    12: 4,
    13: 4,
    14: 4,
    15: 5,
    16: 5,
    17: 5,
    18: 5,
    19: 5,
    20: 5,
  }, druid: {
    1: 3,
    2: 3,
    3: 3,
    4: 3,
    5: 3,
    6: 3,
    7: 3,
    8: 4,
    9: 4,
    10: 4,
    11: 4,
    12: 4,
    13: 4,
    14: 4,
    15: 5,
    16: 5,
    17: 5,
    18: 5,
    19: 5,
    20: 5,
  }, sorcerer: {
    1: 3,
    2: 3,
    3: 3,
    4: 3,
    5: 3,
    6: 3,
    7: 3,
    8: 4,
    9: 4,
    10: 4,
    11: 4,
    12: 4,
    13: 4,
    14: 4,
    15: 5,
    16: 5,
    17: 5,
    18: 5,
    19: 5,
    20: 5,
  }
}

export const spellSlotTable: { [className: string]: { [level: number]: number[] } } = {
  wizard: {
    1: [2],
    2: [3],
    3: [4, 2],
    4: [4, 3],
    5: [4, 3, 2],
    6: [4, 3, 3],
    7: [4, 3, 3, 1],
    8: [4, 3, 3, 2],
    9: [4, 3, 3, 3, 1],
    10: [4, 3, 3, 3, 2],
    11: [4, 3, 3, 3, 2, 1],
    12: [4, 3, 3, 3, 2, 1],
    13: [4, 3, 3, 3, 2, 1, 1],
    14: [4, 3, 3, 3, 2, 1, 1],
    15: [4, 3, 3, 3, 2, 1, 1, 1],
    16: [4, 3, 3, 3, 2, 1, 1, 1],
    17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
    18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
    19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
    20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
  },
  cleric: {
    1: [2],
    2: [3],
    3: [4, 2],
    4: [4, 3],
    5: [4, 3, 2],
    6: [4, 3, 3],
    7: [4, 3, 3, 1],
    8: [4, 3, 3, 2],
    9: [4, 3, 3, 3, 1],
    10: [4, 3, 3, 3, 2],
    11: [4, 3, 3, 3, 2, 1],
    12: [4, 3, 3, 3, 2, 1],
    13: [4, 3, 3, 3, 2, 1, 1],
    14: [4, 3, 3, 3, 2, 1, 1],
    15: [4, 3, 3, 3, 2, 1, 1, 1],
    16: [4, 3, 3, 3, 2, 1, 1, 1],
    17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
    18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
    19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
    20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
  },
  druid: {
    1: [2],
    2: [3],
    3: [4, 2],
    4: [4, 3],
    5: [4, 3, 2],
    6: [4, 3, 3],
    7: [4, 3, 3, 1],
    8: [4, 3, 3, 2],
    9: [4, 3, 3, 3, 1],
    10: [4, 3, 3, 3, 2],
    11: [4, 3, 3, 3, 2, 1],
    12: [4, 3, 3, 3, 2, 1],
    13: [4, 3, 3, 3, 2, 1, 1],
    14: [4, 3, 3, 3, 2, 1, 1],
    15: [4, 3, 3, 3, 2, 1, 1, 1],
    16: [4, 3, 3, 3, 2, 1, 1, 1],
    17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
    18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
    19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
    20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
  },
  sorcerer: {
    1: [2],
    2: [3],
    3: [4, 2],
    4: [4, 3],
    5: [4, 3, 2],
    6: [4, 3, 3],
    7: [4, 3, 3, 1],
    8: [4, 3, 3, 2],
    9: [4, 3, 3, 3, 1],
    10: [4, 3, 3, 3, 2],
    11: [4, 3, 3, 3, 2, 1],
    12: [4, 3, 3, 3, 2, 1],
    13: [4, 3, 3, 3, 2, 1, 1],
    14: [4, 3, 3, 3, 2, 1, 1],
    15: [4, 3, 3, 3, 2, 1, 1, 1],
    16: [4, 3, 3, 3, 2, 1, 1, 1],
    17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
    18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
    19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
    20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
  },
  bard: {
    1: [2],
    2: [3],
    3: [4, 2],
    4: [4, 3],
    5: [4, 3, 2],
    6: [4, 3, 3],
    7: [4, 3, 3, 1],
    8: [4, 3, 3, 2],
    9: [4, 3, 3, 3, 1],
    10: [4, 3, 3, 3, 2],
    11: [4, 3, 3, 3, 2, 1],
    12: [4, 3, 3, 3, 2, 1],
    13: [4, 3, 3, 3, 2, 1, 1],
    14: [4, 3, 3, 3, 2, 1, 1],
    15: [4, 3, 3, 3, 2, 1, 1, 1],
    16: [4, 3, 3, 3, 2, 1, 1, 1],
    17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
    18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
    19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
    20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
  },

  paladin: {
    1: [],
    2: [2],
    3: [3],
    4: [3],
    5: [4, 2],
    6: [4, 2],
    7: [4, 3],
    8: [4, 3],
    9: [4, 3, 2],
    10: [4, 3, 2],
    11: [4, 3, 3],
    12: [4, 3, 3],
    13: [4, 3, 3, 1],
    14: [4, 3, 3, 1],
    15: [4, 3, 3, 2],
    16: [4, 3, 3, 2],
    17: [4, 3, 3, 3, 1],
    18: [4, 3, 3, 3, 1],
    19: [4, 3, 3, 3, 2],
    20: [4, 3, 3, 3, 2],
  },
  ranger: {
    1: [],
    2: [2],
    3: [3],
    4: [3],
    5: [4, 2],
    6: [4, 2],
    7: [4, 3],
    8: [4, 3],
    9: [4, 3, 2],
    10: [4, 3, 2],
    11: [4, 3, 3],
    12: [4, 3, 3],
    13: [4, 3, 3, 1],
    14: [4, 3, 3, 1],
    15: [4, 3, 3, 2],
    16: [4, 3, 3, 2],
    17: [4, 3, 3, 3, 1],
    18: [4, 3, 3, 3, 1],
    19: [4, 3, 3, 3, 2],
    20: [4, 3, 3, 3, 2],
  },

  eldritch_knight: {
    1: [],
    2: [],
    3: [2],
    4: [3],
    5: [3],
    6: [3],
    7: [4, 2],
    8: [4, 2],
    9: [4, 2],
    10: [4, 3],
    11: [4, 3],
    12: [4, 3],
    13: [4, 3, 2],
    14: [4, 3, 2],
    15: [4, 3, 2],
    16: [4, 3, 3],
    17: [4, 3, 3],
    18: [4, 3, 3],
    19: [4, 3, 3, 1],
    20: [4, 3, 3, 1],
  },
  arcane_trickster: {
    1: [],
    2: [],
    3: [2],
    4: [3],
    5: [3],
    6: [3],
    7: [4, 2],
    8: [4, 2],
    9: [4, 2],
    10: [4, 3],
    11: [4, 3],
    12: [4, 3],
    13: [4, 3, 2],
    14: [4, 3, 2],
    15: [4, 3, 2],
    16: [4, 3, 3],
    17: [4, 3, 3],
    18: [4, 3, 3],
    19: [4, 3, 3, 1],
    20: [4, 3, 3, 1],
  },

  warlock: {
    1: [1],
    2: [2],
    3: [2],
    4: [2],
    5: [2],
    6: [2],
    7: [2],
    8: [2],
    9: [2],
    10: [2],
    11: [3],
    12: [3],
    13: [3],
    14: [3],
    15: [3],
    16: [3],
    17: [4],
    18: [4],
    19: [4],
    20: [4],
  },
};
