import { randomNumber } from "./random"

export const skillRoll = (skill: number) =>{
  if(typeof skill !== "number")
    return

  const diceRolled = randomNumber(20);
  const allRolled = randomNumber(20) + skill;

  console.log(allRolled)
}