"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase/client";
import InventoryManager from "@/components/character/items/inventoryManager";
import ItemEffectsTooltip from "@/components/character/items/ItemEffectsTooltip";

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

  const fetchData = async () => {
    if (!id) return;

    try {
      setLoading(true);

      // Fetch character details
      const { data: characterData, error: characterError } = await supabase
        .from("characters")
        .select("*")
        .eq("id", id)
        .single();
      if (characterError) throw new Error("Character not found.");

      // Fetch character stats
      const { data: statsData, error: statsError } = await supabase
        .from("character_stats")
        .select("strength, dexterity, constitution, intelligence, wisdom, charisma")
        .eq("character_id", id)
        .single();
      if (statsError) throw new Error("Failed to load character stats.");

      // Merge character and stats
      setCharacter({ ...characterData, ...statsData });

      // Fetch inventory
      const { data: inventoryData, error: inventoryError } = await supabase
        .from("inventory")
        .select("id, quantity, items(id, name, description, type, weight, value)")
        .eq("character_id", id);
      if (inventoryError) throw new Error("Failed to load inventory.");

      // Format inventory and remove duplicates
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

  useEffect(() => {
    fetchData();
  }, [id]);

  const updateInventoryState = (itemId: string, change: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + change } : item
      ).filter((item) => item.quantity > 0)
    );
  };

  const addItem = async (itemId: string) => {
    try {
      const item = inventory.find((i) => i.id === itemId);
      if (!item) return;

      await supabase
        .from("inventory")
        .update({ quantity: item.quantity + 1 })
        .eq("id", item.inventoryId);

      updateInventoryState(itemId, 1);
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const item = inventory.find((i) => i.id === itemId);
      if (!item || item.quantity <= 0) return;

      if (item.quantity === 1) {
        await supabase.from("inventory").delete().eq("id", item.inventoryId);
      } else {
        await supabase
          .from("inventory")
          .update({ quantity: item.quantity - 1 })
          .eq("id", item.inventoryId);
      }

      updateInventoryState(itemId, -1);
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading character...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!character) return <p className="text-center text-gray-500">Character not found.</p>;


  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-4xl font-bold text-center text-gray-800">{character.name}</h2>
        <p className="text-lg text-gray-600 text-center mb-4">
          {character.race} - {character.class} (Level {character.level})
        </p>
        <h3 className="text-2xl font-semibold mb-2">Attributes</h3>
        <ul className="grid grid-cols-2 gap-2 text-gray-700 text-lg">
          <li><strong>STR:</strong> {character.strength}</li>
          <li><strong>DEX:</strong> {character.dexterity}</li>
          <li><strong>CON:</strong> {character.constitution}</li>
          <li><strong>INT:</strong> {character.intelligence}</li>
          <li><strong>WIS:</strong> {character.wisdom}</li>
          <li><strong>CHA:</strong> {character.charisma}</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
        <h3 className="text-2xl font-semibold mb-4">Inventory</h3>
        {inventory.length === 0 ? (
          <p className="text-gray-500">No items in inventory.</p>
        ) : (
          <ul className="space-y-4 max-h-96 overflow-y-auto">
            {inventory.map((item) => (
              <li key={item.id} className="border p-4 rounded-lg bg-gray-50 shadow-sm flex flex-col">
                <ItemEffectsTooltip itemName={item.name}>
                  <h4 className="text-lg font-semibold">{item.name}</h4>
                  {item.description && <p className="text-gray-600">{item.description}</p>}
                  <p className="text-sm text-gray-500">Type: {item.type}</p>
                  <p className="text-sm text-gray-500">Weight: {item.weight} | Value: {item.value} gp</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </ItemEffectsTooltip>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 h-full">
        <h3 className="text-2xl font-semibold">Spells</h3>
        <p>No spells learned</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 h-full">
        <h3 className="text-2xl font-semibold">Item Manager</h3>
        <InventoryManager characterId={id as string} onItemAdded={fetchData} />
      </div>
    </div>
  );
};

export default CharacterDetails;
