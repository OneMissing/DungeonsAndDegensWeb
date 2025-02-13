"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase/client";
import InventoryManager from "@/components/character/items/inventoryManager";
import ItemEffectsTooltip from "@/components/character/items/ItemEffectsTooltip";
import SkillsTable from "@/components/character/skills";
import { Button } from "@/components/ui/cards/button";
import { Card } from "@/components/ui/cards/card";
import { CardContent } from "@/components/ui/cards/cardContent";

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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full min-h-[calc(100vh-4.5rem)] overflow-hidden mt-4 ml-4 mr-4">
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


      <section className="bg-gray-100 p-6 rounded-lg shadow-md min-h-0 md:min-h-[calc(100vh-6rem)] md:h-[calc(100vh-6rem)]">
        <div className="grid-cols-2">
          <Button
            className="w-1/2"
            variant={activeButton === "Inventory" ? "default" : "outline"}
            onClick={() => setActiveButton("Inventory")}
          >Inventory</Button>
          <Button
            className="w-1/2"
            variant={activeButton === "Items" ? "default" : "outline"}
            onClick={() => setActiveButton("Items")}
          >Items</Button>
        </div>
        <Card>
          <CardContent>
            {activeButton === "Inventory" ? (
              inventory.length === 0 ? (
                <p className="text-gray-500">No items in inventory.</p>
              ) : (
                <ul className="space-y-4 overflow-y-auto mt-4 min-h-0 md:min-h-[calc(100vh-13rem)] md:h-[calc(100vh-13rem)] md:overflow-y-auto">
                  {inventory.map((item) => (
                    <li key={item.id} className="border p-4 rounded-lg shadow-sm bg-white">
                      <ItemEffectsTooltip itemName={item.name}>
                        <div className="grid grid-cols-2 items-center">
                          <h4
                            className="text-lg font-semibold cursor-pointer text-yellow-600"
                            onClick={() => toggleExpand(item.id)}
                          >
                            {item.name}
                          </h4>
                          <h6 className="text-lg font-semibold cursor-pointer text-yellow-600">
                            {item.quantity}×
                          </h6>
                        </div>

                        {expandedItem === item.id && (
                          <div>
                            {item.description && <p className="text-gray-600">{item.description}</p>}
                            <p className="text-sm text-gray-500">Type: {item.type}</p>
                            <p className="text-sm text-gray-500">Weight: {item.weight} | Value: {item.value} gp</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              <button className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-700" onClick={() => addItem(item.id)}>Add</button>
                              <button className="bg-red-400 text-white py-2 rounded-lg hover:bg-red-700" onClick={() => removeItem(item.id)}>Use</button>
                            </div>
                          </div>
                        )}
                      </ItemEffectsTooltip>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              <InventoryManager characterId={character.id} />
            )}
          </CardContent>
        </Card>
      </section>



      <section className="bg-gray-100 p-6 rounded-lg shadow-md min-h-0 md:min-h-[calc(100vh-6rem)] md:h-[calc(100vh-6rem)]">
        <h3 className="text-2xl font-semibold">Spells</h3>
        <p>No spells learned</p>
      </section>
    </div>
  );
};

export default CharacterDetails;
