import { Character } from "@/lib/tools/types";
import { CircleMinus, CirclePlus, Minus, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { skillRoll } from "@/lib/rolling/skillRoll";
import { usePopup } from "../../dices/dicePopup";

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

const SkillsPanel: React.FC<{ character: Character | undefined; setCharacter: (character: Character) => void; className?: string; }> = ({ character, setCharacter, className }) => {
  if (character === undefined) return <>Loading</>;
  const { showPopup } = usePopup();
  const updateSkill = async (skill: string, delta: number) => {
    const skillKey = skill.toLowerCase().replace(/ /g, "_") as keyof Character;
    const newSkillValue = Number(character[skillKey]) + delta;
    if (newSkillValue < -20 || newSkillValue > 20) return;
    const { data, error } = await supabase
      .from("characters")
      .update({ [skillKey]: newSkillValue })
      .eq("character_id", character.character_id)
      .select()
      .single();
    if (!error && data) setCharacter(data);
  };

  return (
    <div className="w-full lg:h-[calc(100vh-17rem)] overflow-y-auto">
    <div className={`${className} grid grid-cols-1 `}>
      {skills.map((skill, index) => (
        <div
          className="mb-1 p-2 dark:bg-3-dark bg-3-light  rounded flex justify-between"
          onClick={(e) => showPopup(`1d20+${character[skill.toLowerCase().replace(/ /g, "_") as keyof Character]}`)}
          key={index}>
          <div className="flex justify-between w-full px-2">
            <div className="font-semibold">{skill}:</div>
            <div className="text-right">{character[skill.toLowerCase().replace(/ /g, "_") as keyof Character]}</div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default SkillsPanel;
