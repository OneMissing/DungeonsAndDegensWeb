"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase/client";

interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  background?: string;
  alignment?: string;
  strength?: number;
  dexterity?: number;
  constitution?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;
}

const CharacterDetails = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from("characters")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          setError("Character not found.");
        } else {
          setCharacter(data);
        }
      } catch (err) {
        setError("An error occurred while fetching the character.");
      }

      setLoading(false);
    };

    fetchCharacterDetails();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading character details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!character) return <p className="text-center text-gray-500">Character not found.</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{character.name}</h2>
      <p className="text-lg">{character.race} - {character.class} (Level {character.level})</p>
      {character.background && <p className="text-gray-600">Background: {character.background}</p>}
      {character.alignment && <p className="text-gray-600">Alignment: {character.alignment}</p>}

      <h3 className="text-xl font-semibold mt-4">Attributes</h3>
      <ul className="grid grid-cols-2 gap-2 mt-2 text-gray-700">
        <li><strong>STR:</strong> {character.strength}</li>
        <li><strong>DEX:</strong> {character.dexterity}</li>
        <li><strong>CON:</strong> {character.constitution}</li>
        <li><strong>INT:</strong> {character.intelligence}</li>
        <li><strong>WIS:</strong> {character.wisdom}</li>
        <li><strong>CHA:</strong> {character.charisma}</li>
      </ul>
    </div>
  );
};

export default CharacterDetails;
