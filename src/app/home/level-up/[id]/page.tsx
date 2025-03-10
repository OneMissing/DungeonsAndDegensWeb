"use client";

import { CharacterManager } from "@/lib/levelup/characterManager";
import { createClient } from "@/lib/supabase/client";
import { Character } from "@/lib/tools/types";
import { CircleMinus, CirclePlus } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [character, setCharacter] = useState<Character | undefined>(undefined);
  const [characterManager, setCharacterManager] = useState<CharacterManager | null>(null);

  const supabase = createClient();

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

  const updateStateCallback = () => {
    console.log("State updated!");
    setCharacterManager((prev) => {
      if (prev) {
        return new CharacterManager(prev.character, updateStateCallback);
      }
      return null;
    });
  };

  useEffect(() => {
    loadCharacter();
  }, [id, supabase]);

  useEffect(() => {
    if (character) {
      const manager = new CharacterManager(character, updateStateCallback);
      setCharacterManager(manager);
    }
  }, [character]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!character || !characterManager) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {characterManager.skillEnable() && (
        <div>
          <p>Skill Enable is true!</p>
          {characterManager.currentSkills.map((skill, index) => (
            <div className="mb-1 p-2 bg-gray-700 rounded flex justify-between" key={index}>
              <div>
                <span className="font-semibold">{skill.key}:</span> {skill.value}
              </div>
              <div className="flex gap-2">
                <CirclePlus
                  color={characterManager.plusEnable(characterManager.currentSkills, characterManager.originalSkills, characterManager.skillPoints) ? "green" : "gray"}
                  onClick={
                    characterManager.plusEnable(characterManager.currentSkills, characterManager.originalSkills, characterManager.skillPoints)
                      ? () => characterManager.plus("skill", skill.key)
                      : undefined
                  }
                />
                <CircleMinus
                  color={characterManager.minusEnable(skill.key, characterManager.currentSkills, characterManager.originalSkills) ? "red" : "gray"}
                  onClick={
                    characterManager.minusEnable(skill.key, characterManager.currentSkills, characterManager.originalSkills)
                      ? () => characterManager.minus("skill", skill.key)
                      : undefined
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {characterManager.statEnable() && (
        <div>
          <p>Stat Enable is true!</p>
          {characterManager.currentStats.map((stat, index) => (
            <div className="mb-1 p-2 bg-gray-700 rounded flex justify-between" key={index}>
              <div>
                <span className="font-semibold">{stat.key}:</span> {stat.value}
              </div>
              <div className="flex gap-2">
                <CirclePlus
                  color={characterManager.plusEnable(characterManager.currentStats, characterManager.originalStats, characterManager.statPoints) ? "green" : "gray"}
                  onClick={
                    characterManager.plusEnable(characterManager.currentStats, characterManager.originalStats, characterManager.statPoints)
                      ? () => characterManager.plus("stat", stat.key)
                      : undefined
                  }
                />
                <CircleMinus
                  color={characterManager.minusEnable(stat.key, characterManager.currentStats, characterManager.originalStats) ? "red" : "gray"}
                  onClick={
                    characterManager.minusEnable(stat.key, characterManager.currentStats, characterManager.originalStats)
                      ? () => characterManager.minus("stat", stat.key)
                      : undefined
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}