"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase/client";
import SkillsTable from "@/components/character/skills";
import InventorySection from "@/components/character/items/inventoryDisplay";

interface Character {
  id: string;
  user_id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  experience: number;
  background: string;
  alignment: string;
  created_at: string;
  strength?: number;
  dexterity?: number;
  constitution?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;
}

interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  type: string;
  weight: number;
  value: number;
  quantity: number;
  inventoryId: string;
}

const CharacterDetails = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<"Inventory" | "Items">("Inventory");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const fetchData = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const { data: characterData, error: characterError } = await supabase
        .from("characters")
        .select("*")
        .eq("id", id)
        .single();
      if (characterError) throw new Error("Character not found.");

      const { data: statsData, error: statsError } = await supabase
        .from("character_stats")
        .select("strength, dexterity, constitution, intelligence, wisdom, charisma")
        .eq("character_id", id)
        .single();
      if (statsError) throw new Error("Failed to load character stats.");

      setCharacter({ ...characterData, ...statsData });

      // Fetch inventory
      const { data: inventoryData, error: inventoryError } = await supabase
        .from("inventory")
        .select("id, quantity, items(id, name, description, type, weight, value)")
        .eq("character_id", id);
      if (inventoryError) throw new Error("Failed to load inventory.");

      const formattedInventory = inventoryData.map((entry: any) => ({
        id: entry.items.id,
        name: entry.items.name,
        description: entry.items.description,
        type: entry.items.type,
        weight: entry.items.weight,
        value: entry.items.value,
        quantity: entry.quantity,
        inventoryId: entry.id,
      }));

      setInventory(formattedInventory);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading character...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!character) return <p className="text-center text-gray-500">Character not found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full min-h-[calc(100vh-4.5rem)] overflow-hidden pt-4 pl-4 pr-4">
      <section className="bg-gray-100 p-6 rounded-lg shadow-md min-h-0 md:min-h-[calc(100vh-6rem)] md:h-[calc(100vh-6rem)]">
        <h2 className="text-4xl font-bold text-center">{character.name}</h2>
        <p className="text-lg text-gray-600 text-center">{character.race} - {character.class} (Level {character.level})</p>
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


      <section className="bg-gray-100 p-6 rounded-lg shadow-md min-h-0 md:min-h-[calc(100vh-6rem)] md:h-[calc(100vh-6rem)]">
        <h3 className="text-2xl font-semibold">Skills</h3>
        <SkillsTable characterId={id as string} />
      </section>

      {/*inventory*/}
      <InventorySection characterId={id as string}/>



      <section className="bg-gray-100 p-6 rounded-lg shadow-md min-h-0 md:min-h-[calc(100vh-6rem)] md:h-[calc(100vh-6rem)]">
        <h3 className="text-2xl font-semibold">Spells</h3>
        <p>No spells learned</p>
      </section>
    </div>
  );
};

export default CharacterDetails;
