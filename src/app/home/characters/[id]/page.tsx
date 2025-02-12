"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase/client";

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
  const { id } = useParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
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

        const { data: itemsData, error: itemsError } = await supabase
          .from("items")
          .select("id, name");

        if (itemsError) throw new Error("Failed to load items.");
        setItems(itemsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleAddItem = async () => {
    setError(null);
    setSuccess(null);

    if (!selectedItem || quantity <= 0) {
      setError("Please select an item and enter a valid quantity.");
      return;
    }

    try {
      const existingItem = inventory.find((item) => item.id === selectedItem.id);

      if (existingItem) {
        const { error: updateError } = await supabase
          .from("inventory")
          .update({ quantity: existingItem.quantity + quantity })
          .eq("id", existingItem.inventoryId);

        if (updateError) throw new Error("Failed to update item quantity.");
      } else {
        const { error: insertError } = await supabase
          .from("inventory")
          .insert([{ character_id: id, item_id: selectedItem.id, quantity }]);

        if (insertError) throw new Error("Failed to add item to inventory.");
      }

      setSuccess("Item added successfully!");
      setSearchTerm("");
      setSelectedItem(null);
      setQuantity(1);

      const { data: updatedInventory, error: fetchError } = await supabase
        .from("inventory")
        .select("id, quantity, items(id, name, description, type, weight, value)")
        .eq("character_id", id);

      if (fetchError) throw new Error("Failed to refresh inventory.");

      const formattedInventory = updatedInventory.map((entry: any) => ({
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
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold mt-6">Add Item to Inventory</h3>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="border p-2 rounded w-full mt-2"
      />
      <button onClick={handleAddItem} className="bg-blue-500 text-white p-2 rounded w-full mt-2">
        Add Item
      </button>
      <input
        type="text"
        placeholder="Search item..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      {searchTerm && (
        <ul className="border rounded bg-white max-h-40 overflow-y-auto">
          {items
            .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((item) => (
              <li
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  setSearchTerm(item.name);
                }}
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                {item.name}
              </li>
            ))}
        </ul>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
};

export default CharacterDetails;
