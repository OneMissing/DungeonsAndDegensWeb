import { Character } from "../tools/types";

// Total available points for stats and skills
let totalSkillPoints: number = 5;
let remainingSkillPoints: number = totalSkillPoints; // Track remaining skill points
let totalStatPoints: number = 5; // Total stat points available
let remainingStatPoints: number = totalStatPoints; // Track remaining stat points

// Store the points for each individual skill
let skillPoints: Record<string, number> = {};
let skillEnablePlus: Record<string, boolean> = {};
let skillEnableMinus: Record<string, boolean> = {};

// Store the points for each individual stat
let statPoints: Record<string, number> = {};
let statEnablePlus: Record<string, boolean> = {};
let statEnableMinus: Record<string, boolean> = {};

// Stats and skills state
let stats: Record<string, number> = {};
let skills: Record<string, number> = {};
let minStats: Record<string, number> = {};
let minSkills: Record<string, number> = {};

// Function to check if the current level should enable points for skills or stats
const shouldAllocatePoints = (level: number, type: 'stat' | 'skill'): boolean => {
  // For skill points, available every even level (level % 2 === 0)
  // For stat points, available every third level (level % 3 === 0)
  if (type === 'skill') {
    return level % 2 === 0;  // Skill points available on even levels
  }
  if (type === 'stat') {
    return level % 3 === 0;  // Stat points available on every third level
  }
  return false;
};

export function loadCharacter(inputCharacter: Character) {
  // Initialize stats
  minStats = {
    strength: inputCharacter.strength,
    dexterity: inputCharacter.dexterity,
    constitution: inputCharacter.constitution,
    intelligence: inputCharacter.intelligence,
    wisdom: inputCharacter.wisdom,
    charisma: inputCharacter.charisma,
  };

  // Initialize skills
  minSkills = {
    acrobatics: inputCharacter.acrobatics,
    animal_handling: inputCharacter.animal_handling,
    arcana: inputCharacter.arcana,
    athletics: inputCharacter.athletics,
    deception: inputCharacter.deception,
    history: inputCharacter.history,
    insight: inputCharacter.insight,
    intimidation: inputCharacter.intimidation,
    investigation: inputCharacter.investigation,
    medicine: inputCharacter.medicine,
    nature: inputCharacter.nature,
    perception: inputCharacter.perception,
    performance: inputCharacter.performance,
    persuasion: inputCharacter.persuasion,
    religion: inputCharacter.religion,
    sleight_of_hand: inputCharacter.sleight_of_hand,
    stealth: inputCharacter.stealth,
    survival: inputCharacter.survival,
  };

  stats = { ...minStats };
  skills = { ...minSkills };

  // Initialize skill points and enable/disable buttons based on level
  Object.keys(minSkills).forEach(skill => {
    skillPoints[skill] = 0;  // Initialize skill points for each skill to 0
    skillEnablePlus[skill] = shouldAllocatePoints(inputCharacter.level, 'skill') && remainingSkillPoints > 0; // Enable '+' if points available
    skillEnableMinus[skill] = false; // Disable '-' initially
  });

  // Initialize stat points and enable/disable buttons based on level
  Object.keys(minStats).forEach(stat => {
    statPoints[stat] = 0;  // Initialize stat points for each stat to 0
    statEnablePlus[stat] = shouldAllocatePoints(inputCharacter.level, 'stat') && remainingStatPoints > 0; // Enable '+' if points available
    statEnableMinus[stat] = false; // Disable '-' initially
  });
}

// Update individual skill points
export function skillPlus(skill: string) {
  if (remainingSkillPoints > 0 && skillEnablePlus[skill]) {
    skillPoints[skill] += 1;  // Increase skill points for the specific skill
    skills[skill] += 1;  // Increase the skill value
    remainingSkillPoints--;  // Decrease remaining points

    // Enable the minus button now that we can decrease the skill
    skillEnableMinus[skill] = true;

    // Disable the plus button if there are no points left to add
    if (remainingSkillPoints <= 0) {
      skillEnablePlus[skill] = false;
    }
  }
}

// Decrease individual skill points
export function skillMinus(skill: string) {
  if (skillPoints[skill] > 0) {
    skillPoints[skill] -= 1;  // Decrease the skill points for the specific skill
    skills[skill] -= 1;  // Decrease the skill value
    remainingSkillPoints++;  // Increase remaining points

    // Enable the plus button since we can now add points again
    skillEnablePlus[skill] = true;

    // Disable the minus button if the skill points are at the minimum value
    if (skillPoints[skill] <= 0) {
      skillEnableMinus[skill] = false;
    }
  }
}

// Update individual stat points
export function statPlus(stat: string) {
  if (remainingStatPoints > 0 && statEnablePlus[stat]) {
    statPoints[stat] += 1;  // Increase stat points for the specific stat
    stats[stat] += 1;  // Increase the stat value
    remainingStatPoints--;  // Decrease remaining points

    // Enable the minus button now that we can decrease the stat
    statEnableMinus[stat] = true;

    // Disable the plus button if there are no points left to add
    if (remainingStatPoints <= 0) {
      statEnablePlus[stat] = false;
    }
  }
}

// Decrease individual stat points
export function statMinus(stat: string) {
  if (statPoints[stat] > 0) {
    statPoints[stat] -= 1;  // Decrease the stat points for the specific stat
    stats[stat] -= 1;  // Decrease the stat value
    remainingStatPoints++;  // Increase remaining points

    // Enable the plus button since we can now add points again
    statEnablePlus[stat] = true;

    // Disable the minus button if the stat points are at the minimum value
    if (statPoints[stat] <= 0) {
      statEnableMinus[stat] = false;
    }
  }
}

// Export flags to be used in the component
export { skillEnablePlus, skillEnableMinus, statEnablePlus, statEnableMinus };
