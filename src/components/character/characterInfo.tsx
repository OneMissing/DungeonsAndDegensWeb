"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase/client";

interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  strength?: number;
  dexterity?: number;
  constitution?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;
}

interface CharacterInfoProps {
  characterId: string;
}

const CharacterInfo = ({ characterId }: CharacterInfoProps) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!characterId) return;

    const fetchCharacter = async () => {
      try {
        setLoading(true);

        const { data: characterData, error: characterError } = await supabase
          .from("characters")
          .select("*")
          .eq("id", characterId)
          .single();

        if (characterError) throw new Error("Character not found.");

        const { data: statsData, error: statsError } = await supabase
          .from("character_stats")
          .select("strength, dexterity, constitution, intelligence, wisdom, charisma")
          .eq("character_id", characterId)
          .single();

        if (statsError) throw new Error("Failed to load character stats.");

        setCharacter({ ...characterData, ...statsData });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [characterId]);

  if (loading) return <p className="text-center text-gray-500">Loading character...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!character) return <p className="text-center text-gray-500">Character not found.</p>;

  return (
    <section className="bg-gray-100 p-6 rounded-lg shadow-md min-h-0 md:min-h-[calc(100vh-6rem)] md:h-[calc(100vh-6rem)]">
      <h2 className="text-4xl font-bold text-center">{character.name}</h2>
      <p className="text-lg text-gray-600 text-center">
        {character.race} - {character.class} (Level {character.level})
      </p>
      <h3 className="text-2xl font-semibold">Attributes</h3>
      <ul className="grid grid-cols-2 gap-4 text-gray-700">
        <li><strong>STR:</strong> {character.strength}</li>
        <li><strong>DEX:</strong> {character.dexterity}</li>
        <li><strong>CON:</strong> {character.constitution}</li>
        <li><strong>INT:</strong> {character.intelligence}</li>
        <li><strong>WIS:</strong> {character.wisdom}</li>
        <li><strong>CHA:</strong> {character.charisma}</li>
      </ul>
    </section>
  );
};

export default CharacterInfo;
