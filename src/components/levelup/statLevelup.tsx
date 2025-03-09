"use client"

import { skillEnableMinus, skillEnablePlus, statEnableMinus, statEnablePlus, statMinus, statPlus } from "@/lib/levelup/levelup";
import { Character } from "@/lib/tools/types";
import { CircleMinus, CirclePlus } from "lucide-react";

const stats = [
  "Strength",
  "Dexterity",
  "Constitution",
  "Intelligence",
  "Wisdom",
  "Charisma"
];



interface LevelUpProps {
  character: Character | undefined; // Define the correct prop type
}

const LevelUpStat: React.FC<LevelUpProps> = ({ character }) => {
  if(character === undefined)
    return(<p>Loading</p>);
    
  return(
    <div>
      <p>Stat</p>
      <div className="grid grid-cols-1">	
			{stats.map((stat, index) => (
				<div className="mb-1 p-2 bg-gray-700 rounded flex justify-between" key={index}>
					<div>
						<span className="font-semibold">
							{stat}:
						</span> {character[stat.toLowerCase().replace(/ /g, "_") as keyof Character]}
					</div>
					<div className="flex gap-2">
						<CirclePlus  color={statEnablePlus ? "green" : "gray"} onClick={() => statPlus(stat)} />
						<CircleMinus color={statEnableMinus ? "red" : "gray"}   onClick={() => statMinus(stat)} />
					</div>
				</div>
			))}
		</div>
    </div>
  );
};

export default LevelUpStat