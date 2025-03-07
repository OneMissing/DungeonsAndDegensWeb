"use client";

import React, { useState, useEffect } from "react";
import { Character } from "@/lib/tools/types";
import {
  loadCharacter,
  skillMinus,
  skillPlus,
  statMinus,
  statPlus,
  skillEnablePlus,
  skillEnableMinus,
  statEnablePlus,
  statEnableMinus,
} from "@/lib/levelup/levelup";

// Example Character data
const exampleCharacter: Character = {
  character_id: "char_12345",
  user_id: "user_67890",
  name: "Eldrin Shadowleaf",
  race: "Elf",
  class: "Rogue",
  background: "Outlander",
  alignment: "Chaotic Good",
  created_at: "2023-10-01T12:34:56Z",
  player_id: "player_54321",
  strength: 14,
  dexterity: 18,
  constitution: 12,
  intelligence: 10,
  wisdom: 8,
  charisma: 16,
  level: 2,
  hpmax: 120,
  hpnow: 85,
  hptmp: 25,
  acrobatics: 7,
  animal_handling: 4,
  arcana: 3,
  athletics: 9,
  deception: 6,
  history: 5,
  insight: 8,
  intimidation: 7,
  investigation: 6,
  medicine: 4,
  nature: 5,
  perception: 7,
  performance: 3,
  persuasion: 8,
  religion: 2,
  sleight_of_hand: 9,
  stealth: 10,
  survival: 6,
  spell_slot_1: 2,
  spell_slot_2: 1,
  spell_slot_3: 0,
  spell_slot_4: 3,
  spell_slot_5: 2,
  spell_slot_6: 1,
  spell_slot_7: 0,
  spell_slot_8: 0,
  spell_slot_9: 0,
};

loadCharacter(exampleCharacter);

// Define a type for the stats portion of the character
type CharacterStats = {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};

const SkillStatLevelUpComponent: React.FC = () => {
  // Update the state to reflect full `Character` structure
  const [tempSkills, setTempSkills] = useState<Character>({ ...exampleCharacter });
  const [tempStats, setTempStats] = useState<CharacterStats>({
    strength: exampleCharacter.strength,
    dexterity: exampleCharacter.dexterity,
    constitution: exampleCharacter.constitution,
    intelligence: exampleCharacter.intelligence,
    wisdom: exampleCharacter.wisdom,
    charisma: exampleCharacter.charisma,
  });

  // Separate points for stats and skills
  const [remainingSkillPoints, setRemainingSkillPoints] = useState(5); // 5 skill points
  const [remainingStatPoints, setRemainingStatPoints] = useState(0); // 0 stat points initially

  useEffect(() => {
    // Update remaining stat points based on level
    if (exampleCharacter.level % 3 === 0) {
      setRemainingStatPoints(5); // 5 stat points at every 3rd level
    } else {
      setRemainingStatPoints(0); // No stat points at level 2
    }
  }, [exampleCharacter.level]);

  // Skill Update Logic
  const handleSkillPlus = (skill: string) => {
    const currentSkillValue = tempSkills[skill as keyof Character];

    if (remainingSkillPoints > 0 && typeof currentSkillValue === "number") {
      skillPlus(skill);
      setTempSkills({
        ...tempSkills,
        [skill]: currentSkillValue + 1,
      });
      setRemainingSkillPoints(remainingSkillPoints - 1);
    }
  };

  const handleSkillMinus = (skill: string) => {
    const currentSkillValue = tempSkills[skill as keyof Character];
    const minSkillValue = Number(exampleCharacter[skill as keyof Character]);

    if (
      typeof currentSkillValue === "number" &&
      currentSkillValue > minSkillValue
    ) {
      skillMinus(skill);
      setTempSkills({
        ...tempSkills,
        [skill]: currentSkillValue - 1,
      });
      setRemainingSkillPoints(remainingSkillPoints + 1);
    }
  };

  // Stat Update Logic
  const handleStatPlus = (stat: string) => {
    const currentStatValue = tempStats[stat as keyof CharacterStats];

    if (remainingStatPoints > 0 && typeof currentStatValue === "number") {
      statPlus(stat);
      setTempStats({
        ...tempStats,
        [stat]: currentStatValue + 1,
      });
      setRemainingStatPoints(remainingStatPoints - 1);
    }
  };

  const handleStatMinus = (stat: string) => {
    const currentStatValue = tempStats[stat as keyof CharacterStats];
    const minStatValue = Number(exampleCharacter[stat as keyof Character]);

    if (currentStatValue > minStatValue) {
      statMinus(stat);
      setTempStats({
        ...tempStats,
        [stat]: currentStatValue - 1,
      });
      setRemainingStatPoints(remainingStatPoints + 1);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Skill & Stat Level-Up</h2>

      {/* Display remaining points */}
      <div className="mb-4">
        <p>
          Remaining Skill Points:{" "}
          <span className="font-bold text-green-500">{remainingSkillPoints}</span>
        </p>
        <p>
          Remaining Stat Points:{" "}
          <span className="font-bold text-blue-500">{remainingStatPoints}</span>
        </p>
      </div>

      {/* Stats Section */}
      <h3 className="text-lg font-semibold mb-2">Stats</h3>
      {["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].map(
        (stat, index) => {
          const statValue = tempStats[stat as keyof CharacterStats];
          return (
            <div key={index} className="flex justify-between p-2 bg-gray-700 rounded mb-2">
              <span className="text-white font-semibold">
                {stat.toUpperCase()}: {statValue}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatPlus(stat)}
                  className={`bg-green-500 text-white p-1 rounded ${remainingStatPoints === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={remainingStatPoints === 0}
                >
                  +
                </button>
                <button
                  onClick={() => handleStatMinus(stat)}
                  className={`bg-red-500 text-white p-1 rounded ${statValue === exampleCharacter[stat as keyof Character] ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={statValue === exampleCharacter[stat as keyof Character]}
                >
                  -
                </button>
              </div>
            </div>
          );
        }
      )}

      {/* Skills Section */}
      <h3 className="text-lg font-semibold mt-4 mb-2">Skills</h3>
      {[
        "animal_handling",
        "arcana",
        "athletics",
        "deception",
        "history",
        "insight",
        "intimidation",
        "investigation",
        "medicine",
        "nature",
        "perception",
        "performance",
        "persuasion",
        "religion",
        "sleight_of_hand",
        "stealth",
        "survival",
      ].map((skill, index) => {
        const skillValue = tempSkills[skill as keyof Character];
        return (
          <div key={index} className="flex justify-between p-2 bg-gray-700 rounded mb-2">
            <span className="text-white font-semibold">
              {skill.replace(/_/g, " ").toUpperCase()}: {skillValue}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleSkillPlus(skill)}
                className={`bg-green-500 text-white p-1 rounded ${remainingSkillPoints === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={remainingSkillPoints === 0}
              >
                +
              </button>
              <button
                onClick={() => handleSkillMinus(skill)}
                className={`bg-red-500 text-white p-1 rounded ${skillValue === exampleCharacter[skill as keyof Character] ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={skillValue === exampleCharacter[skill as keyof Character]}
              >
                -
              </button>
            </div>
          </div>
        );
      })}

      {/* Submit Button */}
      <div className="mt-4">
        <button
          onClick={() => alert("Changes submitted!")}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Submit Changes
        </button>
      </div>
    </div>
  );
};

export default SkillStatLevelUpComponent;
