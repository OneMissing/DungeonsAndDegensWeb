import { Item } from "../tools/types";
import { randomNumber } from "./random";

export const weaponRoll = (item: Item) => {
  const damageArray = new Map<string, number>();

  for (const prop in item) {
    if (!prop.startsWith("damage")) continue;

    const damageValue: string = item[prop as keyof Item] as string;
    if (damageValue === "EMPTY") continue; // Skip if the damage value is "EMPTY"

    const damageParts = damageValue.split(";");

    let totalDamage = 0

    for (const part of damageParts) { 
      if (!part.trim()) continue;

      const regex = /^(\d*)d(\d+)([+-]?\d+)?$/;
      const match = part.match(regex);

      if (!match) continue;

      const numDice = parseInt(match[1] || "1", 10); // Default to 1 if no number before "d"
      const diceMax = parseInt(match[2], 10); // The max value of the dice (after "d")
      const modifier = match[3] ? parseInt(match[3], 10) : 0;

      let rollTotal = 0;

      for (let i = 0; i < numDice; i++) {
        let diceRoll = randomNumber(diceMax);
        rollTotal += diceRoll;
        console.log("Roll: " + diceRoll);
      }

      console.log("Roll modifier: " + modifier);
      rollTotal += modifier;

      totalDamage += rollTotal;
    }

    damageArray.set(prop, totalDamage);
  }

  const overallDamage = Array.from(damageArray.values()).reduce((sum, damage) => sum + damage, 0);
  console.log("Overall total damage: " + overallDamage);
};