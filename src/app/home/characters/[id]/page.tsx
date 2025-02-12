"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase/client";
import InventoryManager from "@/components/character/inventoryManager";

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
  description: string | null;
  type: string;
  weight: number;
  value: number;
  quantity: number;
  inventoryId: string;
}

interface Item {
  id: string;
  name: string;
}

const CharacterDetails = () => {
  const { id } = useParams(); // Get character ID from URL
  const [character, setCharacter] = useState<Character | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!id) return;

    try {
      const { data: characterData, error: characterError } = await supabase
        .from("characters")
        .select("*")
        .eq("id", id)
        .single();

      if (characterError) throw new Error("Character not found.");
      setCharacter(characterData);

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
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading character...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!character) return <p className="text-center text-gray-500">Character not found.</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{character.name}</h2>
      <p className="text-lg text-gray-600">{character.race} - {character.class} (Level {character.level})</p>
      <p className="text-gray-500">Experience: {character.experience}</p>
      <p className="text-gray-500">Background: {character.background}</p>
      <p className="text-gray-500">Alignment: {character.alignment}</p>

      <h3 className="text-xl font-semibold mt-4">Attributes</h3>
      <ul className="grid grid-cols-2 gap-2 mt-2 text-gray-700">
        <li><strong>STR:</strong> {character.strength}</li>
        <li><strong>DEX:</strong> {character.dexterity}</li>
        <li><strong>CON:</strong> {character.constitution}</li>
        <li><strong>INT:</strong> {character.intelligence}</li>
        <li><strong>WIS:</strong> {character.wisdom}</li>
        <li><strong>CHA:</strong> {character.charisma}</li>
      </ul>

      <h3 className="text-2xl font-semibold mt-6">Inventory</h3>
      
      {/* Inventory Component */}
      <InventoryManager characterId={id as string} onItemAdded={fetchData} />

      {inventory.length === 0 ? (
        <p className="text-gray-500">No items in inventory.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {inventory.map((item) => (
            <li key={item.id} className="border p-3 rounded-lg shadow-md bg-white">
              <h4 className="text-lg font-semibold">{item.name}</h4>
              {item.description && <p className="text-gray-600">{item.description}</p>}
              <p className="text-sm text-gray-500">Type: {item.type}</p>
              <p className="text-sm text-gray-500">Weight: {item.weight} | Value: {item.value} gp</p>
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CharacterDetails;


