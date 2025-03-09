"use client"

import { skillEnableMinus, skillEnablePlus, skillMinus, skillPlus } from "@/lib/levelup/levelup";
import { Character } from "@/lib/tools/types";
import { CircleMinus, CirclePlus } from "lucide-react";

const skills = [
	"Acrobatics",
	"Animal Handling",
	"Arcana",
	"Athletics",
	"Deception",
	"History",
	"Insight",
	"Intimidation",
	"Investigation",
	"Medicine",
	"Nature",
	"Perception",
	"Performance",
	"Persuasion",
	"Religion",
	"Sleight of Hand",
	"Stealth",
	"Survival",
];

interface LevelUpProps {
  character: Character | undefined; // Define the correct prop type
}

const LevelUpSkill: React.FC<LevelUpProps> = ({ character }) => {
  if(character === undefined)
    return(<p>Loading</p>);
    
  return(
    <div>
      <p>Skill</p>
      <div className="grid grid-cols-1">	
			{skills.map((skill, index) => (
				<div className="mb-1 p-2 bg-gray-700 rounded flex justify-between" key={index}>
					<div>
						<span className="font-semibold">
							{skill}:
						</span> {character[skill.toLowerCase().replace(/ /g, "_") as keyof Character]}
					</div>
					<div className="flex gap-2">
						<CirclePlus  color={skillEnablePlus ? "green" : "gray"} onClick={() => skillPlus(skill)} />
						<CircleMinus color={skillEnableMinus ? "red" : "gray"}   onClick={() => skillMinus(skill)} />
					</div>
				</div>
			))}
		</div>
    </div>
  );
};

export default LevelUpSkill