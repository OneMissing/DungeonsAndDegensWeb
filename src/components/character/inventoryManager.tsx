"use client";

import { useState, useEffect } from "react";
import supabase from "@/lib/supabase/client";

interface Item {
  id: string;
  name: string;
}

interface InventoryProps {
  characterId: string;
  onItemAdded?: () => void;
}

const InventoryManager = ({ characterId, onItemAdded }: InventoryProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data: itemsData, error: itemsError } = await supabase
          .from("items")
          .select("id, name");

        if (itemsError) throw new Error("Failed to load items.");
        setItems(itemsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      }
    };

    fetchItems();
  }, []);

  const handleAddItem = async () => {
    setError(null);
    setSuccess(null);

    if (!selectedItem || quantity <= 0) {
      setError("Please select an item and enter a valid quantity.");
      return;
    }

    try {
      const { data: existingInventory, error: fetchError } = await supabase
        .from("inventory")
        .select("id, quantity")
        .eq("character_id", characterId)
        .eq("item_id", selectedItem.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw new Error("Failed to check existing inventory.");
      }

      if (existingInventory) {
        // Update the existing item's quantity
        const { error: updateError } = await supabase
          .from("inventory")
          .update({ quantity: existingInventory.quantity + quantity })
          .eq("id", existingInventory.id);

        if (updateError) throw new Error("Failed to update item quantity.");
      } else {
        // Insert new item if it doesn't exist
        const { error: insertError } = await supabase
          .from("inventory")
          .insert([{ character_id: characterId, item_id: selectedItem.id, quantity }]);

        if (insertError) throw new Error("Failed to add item to inventory.");
      }

      setSuccess("Item added successfully!");
      setSelectedItem(null);
      setQuantity(1);
      setSearchTerm("");

      if (onItemAdded) onItemAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    }
  };

  return (
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
                onClick={() => setSelectedItem(item)}
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                {item.name}
              </li>
            ))}
        </ul>
      )}

      {selectedItem && (
        <div className="mt-3">
          <p className="text-gray-700 font-semibold">Selected: {selectedItem.name}</p>

          {/* Flexbox Layout for Quantity and Button */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border p-2 rounded w-20"
            />
            <button
              onClick={handleAddItem}
              className="bg-blue-500 text-white p-2 rounded flex-1"
            >
              Add Item
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
};

export default InventoryManager;
