"use client";

import { useState, useEffect } from "react";
import supabase from "@/lib/supabase/client";

interface Item {
  id: string;
  name: string;
}

interface InventoryItem {
  id: string;
  item_id: string;
  quantity: number;
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from("items").select("id, name");
      if (error) console.error("Failed to fetch items:", error);
      else setItems(data);
    };

    fetchItems();
  }, []);

  const handleAddItem = async () => {
    if (!selectedItem || quantity < 1) return;

    setLoading(true);
    setError(null);

    // Check if the item already exists in the character's inventory
    const { data: existingItem, error: fetchError } = await supabase
      .from("inventory")
      .select("id, quantity")
      .eq("character_id", characterId)
      .eq("item_id", selectedItem.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      setError("Failed to check inventory.");
      setLoading(false);
      return;
    }

    if (existingItem) {
      // If the item exists, update the quantity
      const { error: updateError } = await supabase
        .from("inventory")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id);

      if (updateError) {
        setError("Failed to update item quantity.");
        setLoading(false);
        return;
      }
    } else {
      // If the item does not exist, insert a new entry
      const { error: insertError } = await supabase
        .from("inventory")
        .insert([{ character_id: characterId, item_id: selectedItem.id, quantity }]);

      if (insertError) {
        setError("Failed to add item.");
        setLoading(false);
        return;
      }
    }

    if (onItemAdded) onItemAdded();

    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-2">Add Item</h3>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex items-center gap-2 mb-2">
        <input
          type="number"
          className="p-2 border rounded w-20"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
        />
        <button
          className={`p-2 w-full text-white rounded transition ${
            selectedItem
              ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed opacity-50"
          }`}
          onClick={handleAddItem}
          disabled={!selectedItem || loading}
        >
          {loading ? "Adding..." : "Add Item"}
        </button>
      </div>

      <input
        type="text"
        placeholder="Search item..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        disabled={!!selectedItem}
      />

      {searchTerm && !selectedItem && (
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

      {selectedItem && (
        <div className="flex justify-between items-center mt-2">
          <button
            className="text-sm text-red-500 hover:underline"
            onClick={() => {setSelectedItem(null); setSearchTerm("");}}
          >
            Deselect
          </button>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
