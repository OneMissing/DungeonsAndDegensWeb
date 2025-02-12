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
  const { id } = useParams(); // Get character ID from URL
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
        // Fetch character details
        const { data: characterData, error: characterError } = await supabase
          .from("characters")
          .select("*")
          .eq("id", id)
          .single();

        if (characterError) throw new Error("Character not found.");
        setCharacter(characterData);

        // Fetch inventory with item details
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

        // Fetch available items for dropdown
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
      // Check if item already exists in inventory
      const existingItem = inventory.find((item) => item.id === selectedItem.id);

      if (existingItem) {
        // Update quantity if item exists
        const { error: updateError } = await supabase
          .from("inventory")
          .update({ quantity: existingItem.quantity + quantity })
          .eq("id", existingItem.inventoryId);

        if (updateError) throw new Error("Failed to update item quantity.");
      } else {
        // Insert new item
        const { error: insertError } = await supabase
          .from("inventory")
          .insert([{ character_id: id, item_id: selectedItem.id, quantity }]);

        if (insertError) throw new Error("Failed to add item to inventory.");
      }

      setSuccess("Item added successfully!");
      setSearchTerm("");
      setSelectedItem(null);
      setQuantity(1);

      // Refresh inventory
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

      <h3 className="text-2xl font-semibold mt-6">Inventory</h3>
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

      {/* Add Item Section */}
      <div className="p-4 border rounded-md shadow-md mt-6">
        <h2 className="text-lg font-semibold mb-2">Add Item to Inventory</h2>

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

        <button onClick={handleAddItem} className="bg-blue-500 text-white p-2 rounded w-full mt-2">
          Add Item
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </div>
    </div>
  );
};

export default CharacterDetails;
