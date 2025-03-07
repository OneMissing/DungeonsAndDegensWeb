import { Character } from "../tools/types";

let totalSkillPoints: number = 5;
let remainingSkillPoints: number = totalSkillPoints; 
let totalStatPoints: number = 5; 
let remainingStatPoints: number = totalStatPoints; 

let skillPoints: Record<string, number> = {};
let skillEnablePlus: Record<string, boolean> = {};
let skillEnableMinus: Record<string, boolean> = {};

let statPoints: Record<string, number> = {};
let statEnablePlus: Record<string, boolean> = {};
let statEnableMinus: Record<string, boolean> = {};

let stats: Record<string, number> = {};
let skills: Record<string, number> = {};
let minStats: Record<string, number> = {};
let minSkills: Record<string, number> = {};

const shouldAllocatePoints = (level: number, type: 'stat' | 'skill'): boolean => {

  if (type === 'skill') {
    return level % 2 === 0;  
  }
  if (type === 'stat') {
    return level % 3 === 0;  
  }
  return false;
};

export function loadCharacter(inputCharacter: Character) {

  minStats = {
    strength: inputCharacter.strength,
    dexterity: inputCharacter.dexterity,
    constitution: inputCharacter.constitution,
    intelligence: inputCharacter.intelligence,
    wisdom: inputCharacter.wisdom,
    charisma: inputCharacter.charisma,
  };

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

  Object.keys(minSkills).forEach(skill => {
    skillPoints[skill] = 0;  
    skillEnablePlus[skill] = shouldAllocatePoints(inputCharacter.level, 'skill') && remainingSkillPoints > 0; 
    skillEnableMinus[skill] = false; 
  });

  Object.keys(minStats).forEach(stat => {
    statPoints[stat] = 0;  
    statEnablePlus[stat] = shouldAllocatePoints(inputCharacter.level, 'stat') && remainingStatPoints > 0; 
    statEnableMinus[stat] = false; 
  });
}

export function skillPlus(skill: string) {
  if (remainingSkillPoints > 0 && skillEnablePlus[skill]) {
    skillPoints[skill] += 1;  
    skills[skill] += 1;  
    remainingSkillPoints--;  

    skillEnableMinus[skill] = true;

    if (remainingSkillPoints <= 0) {
      skillEnablePlus[skill] = false;
    }
  }
}

export function skillMinus(skill: string) {
  if (skillPoints[skill] > 0) {
    skillPoints[skill] -= 1;  
    skills[skill] -= 1;  
    remainingSkillPoints++;  

    skillEnablePlus[skill] = true;

    if (skillPoints[skill] <= 0) {
      skillEnableMinus[skill] = false;
    }
  }
}

export function statPlus(stat: string) {
  if (remainingStatPoints > 0 && statEnablePlus[stat]) {
    statPoints[stat] += 1;  
    stats[stat] += 1;  
    remainingStatPoints--;  

    statEnableMinus[stat] = true;

    if (remainingStatPoints <= 0) {
      statEnablePlus[stat] = false;
    }
  }
}

export function statMinus(stat: string) {
  if (statPoints[stat] > 0) {
    statPoints[stat] -= 1;  
    stats[stat] -= 1;  
    remainingStatPoints++;  

    statEnablePlus[stat] = true;

    if (statPoints[stat] <= 0) {
      statEnableMinus[stat] = false;
    }
  }
}

export { skillEnablePlus, skillEnableMinus, statEnablePlus, statEnableMinus };