/* "use client";

import React, { useState, useEffect } from "react";
import { Character } from "@/lib/tools/types";
import { CharacterLoad,skillMinus,skillPlus,statMinus,statPlus,skillEnablePlus,skillEnableMinus,statEnablePlus,statEnableMinus,} from "@/lib/levelup/levelup";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Inventory from "@/components/items/inventory";
import { Divider } from "@heroui/react";
import BookInventory from "@/components/items/adder";
import SpellList from "@/components/character/spellList";
import CharacterPanel from "@/components/character/dm/characterPanel";
import SkillsPanel from "@/components/character/dm/skillsPanel";
import { motion } from "framer-motion";

const supabase = createClient();

const { id } = useParams();
const [error, setError] = useState<string | null>(null);
const [character, setCharacter] = useState<Character  | undefined>(undefined);
const loadCharacter = async () => {
  try {
    const { data, error } = await supabase.from("characters").select("*").eq("character_id", id).single();

    if (error) {
      setError("Error fetching character data.");
      console.error(error);
      return;
    }

    setCharacter(data);
  } catch (err) {
    setError("Unexpected error fetching character data.");
    console.error(err);
  }
};

loadCharacter();
useEffect(() => {console.log(character)}, [character]);
CharacterLoad(character);

  const characterR:Character | undefined = character;

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
  const [tempSkills, setTempSkills] = useState<Character | undefined>({ ...character });
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

      {}
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

    
      {}
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

      {}
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

      {}
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
 */
"use client"

import LevelUpSkill from "@/components/levelup/skillLevelup";
import LevelUpStat from "@/components/levelup/statLevelup";
import { CharacterLoad, skillEnable, statEnable} from "@/lib/levelup/levelup";
import { createClient } from "@/lib/supabase/client";
import { Character } from "@/lib/tools/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function Page() {
  const { id } = useParams();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [character, setCharacter] = useState<Character  | undefined>(undefined);

  useEffect(() => {
    const loadCharacter = async () => {
      try {
        const { data, error } = await supabase
          .from("characters")
          .select("*")
          .eq("character_id", id)
          .single();

        if (error) {
          setError("Error fetching character data.");
          console.error(error);
          return;
        }

        setCharacter(data);
      } catch (err) {
        setError("Unexpected error fetching character data.");
        console.error(err);
      }
    };

    if (id) {
      loadCharacter();
    }
  }, [id]);

  useEffect(() => {
    if (character) {
      console.log(character);
    }
  }, [character]);

  useEffect(() => {
    if (character) {
      CharacterLoad(character);
    }
  }, [character]);

  return(
    
    <div>
      {skillEnable && (<LevelUpSkill character={character}/>)}
      {statEnable && (<LevelUpStat character={character}/>)}
    </div>
  );
};