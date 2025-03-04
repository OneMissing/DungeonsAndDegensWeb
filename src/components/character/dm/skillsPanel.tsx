import { Character } from "@/lib/tools/types";
import { CircleMinus, CirclePlus, Minus, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

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

const SkillsPanel: React.FC<{ character: Character | undefined; setCharacter: (character: Character) => void }> = ({ character, setCharacter }) => {
	if (character === undefined) return <>Loading</>;

	const updateSkill = async (skill: string, delta: number) => {
		const skillKey = skill.toLowerCase().replace(/ /g, "_") as keyof Character;
		const newSkillValue = Number(character[skillKey]) + delta;
		if(newSkillValue < 0) return;
		const { data, error } = await supabase
			.from("characters")
			.update({ [skillKey]: newSkillValue })
			.eq("character_id", character.character_id)
			.select()
			.single();
		if (!error && data) 
			setCharacter(data);
	};

	return (
		<div className="grid grid-cols-1">
			{skills.map((skill, index) => (
				<div className="mb-1 p-2 bg-gray-700 rounded flex justify-between" key={index}>
					<div>
						<span className="font-semibold">{skill}:</span> {character[skill.toLowerCase().replace(/ /g, "_") as keyof Character]}
					</div>
					<div className="flex gap-2">
						<CirclePlus  color="green" onClick={() => updateSkill(skill,  1)} />
						<CircleMinus color="red"   onClick={() => updateSkill(skill, -1)} />
					</div>
				</div>
			))}
		</div>
	);
};

export default SkillsPanel;
