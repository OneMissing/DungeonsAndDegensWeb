import { Item } from "../tools/types";

export const weaponRoll = (item: Item) => {
  const damageArray = new Map<string, string>(); 
  for (const prop in item) {
    if (!prop.startsWith("damage")) continue;
    const damageValue: string = item[prop as keyof Item] as string;
    if (damageValue === "EMPTY") continue; 
    const damageParts = damageValue.split(";");
    let damageString = ""; 
    for (const part of damageParts) {
      if (!part.trim()) continue; 
      const regex = /^(\d*)d(\d+)([+-]?\d+)?$/;
      const match = part.match(regex);
      if (!match) continue;
      if (damageString) damageString += ";"; 
      damageString += part;
    }
    if (damageString) damageArray.set(prop, damageString);
  }
  const overallDamage = Array.from(damageArray.values()).join(";");
  return overallDamage; 
};