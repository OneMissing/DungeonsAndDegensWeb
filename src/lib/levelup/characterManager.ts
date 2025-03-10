import { Character } from "../tools/types";

export class CharacterManager {
  character: Character;
  originalSkills: { key: string; value: number }[];
  currentSkills: { key: string; value: number }[];
  originalStats: { key: string; value: number }[];
  currentStats: { key: string; value: number }[];
  updateStateCallback: () => void;
  
  skillPoints:number = 5;
  statPoints:number = 5

  static readonly stats:string[] = [
    "Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma",
  ];

  static readonly skills:string[] = [
    "Acrobatics", "Animal_Handling", "Arcana", "Athletics", "Deception",
    "History", "Insight", "Intimidation", "Investigation", "Medicine",
    "Nature", "Perception", "Performance", "Persuasion", "Religion",
    "Sleight_of_Hand", "Stealth", "Survival",
  ];

  constructor(character: Character, updateStateCallback: () => void) {
    this.character = character;
    this.originalSkills = this.getKeyValueArray(CharacterManager.skills, this.character);
    this.currentSkills = this.getKeyValueArray(CharacterManager.skills, this.character);
    this.originalStats = this.getKeyValueArray(CharacterManager.stats, this.character);
    this.currentStats = this.getKeyValueArray(CharacterManager.stats, this.character);

    this.character.level++;

    this.updateStateCallback = updateStateCallback;
  }

  private getKeyValueArray(keys: string[], source: Character): { key: string; value: number }[] {
    return keys.map((key) => ({
      key,
      value: source[key.toLowerCase() as keyof Character] as number,
    }));
  }

  private sumValues(map: { key: string; value: number }[]): number {
    if (!map || !Array.isArray(map)) return 0;
    return map.reduce((total, item) => total + item.value, 0);
  }
  
  public skillEnable(): boolean{
    if(this.character.level % 2 === 0)
      return true;
    return false;
  }
  
  public statEnable(): boolean{
    if(this.character.level % 2 !== 0)
      return true;
    return false;
  }
  
  public plusEnable(current: { key: string; value: number }[], original: { key: string; value: number }[], points: number): boolean {
    if(this.sumValues(current) < this.sumValues(original) + points)
      return true;
    return false;
  }
  
  public minusEnable(key: string, current: { key: string; value: number }[], original: { key: string; value: number }[]): boolean {
    const originalItem = original.find((item) => item.key === key);
    const currentItem = current.find((item) => item.key === key);
  
    if(originalItem && currentItem && currentItem.value > originalItem.value)
      return true;
    return false;
  }

  public plus(type: "skill" | "stat", key?: string) {
    let current: { key: string; value: number }[];
    let original: { key: string; value: number }[];
    let points: number;
  
    if (type === "skill") {
      current = this.currentSkills;
      original = this.originalSkills;
      points = this.skillPoints;
    } else if (type === "stat") {
      current = this.currentStats;
      original = this.originalStats;
      points = this.statPoints;
    } else {
      return; // Invalid type
    }
  
    if (this.plusEnable(current, original, points)) {
      const itemToUpdate = key ? current.find((item) => item.key === key) : current[0]; // Update specific item or first item
      if (itemToUpdate) {
        itemToUpdate.value++;
        if (type === "skill") {
          this.skillPoints--;
        } else if (type === "stat") {
          this.statPoints--;
        }
        this.updateStateCallback(); // Notify the UI of the change
      }
    }
  }
  
  public minus(type: "skill" | "stat", key?: string) {
    let current: { key: string; value: number }[];
    let original: { key: string; value: number }[];
  
    if (type === "skill") {
      current = this.currentSkills;
      original = this.originalSkills;
    } else if (type === "stat") {
      current = this.currentStats;
      original = this.originalStats;
    } else {
      return; // Invalid type
    }
  
    const itemToUpdate = key ? current.find((item) => item.key === key) : current[0]; // Update specific item or first item
    if (itemToUpdate && this.minusEnable(itemToUpdate.key, current, original)) {
      itemToUpdate.value--;
      if (type === "skill") {
        this.skillPoints++;
      } else if (type === "stat") {
        this.statPoints++;
      }
      this.updateStateCallback(); // Notify the UI of the change
    }
  }
}