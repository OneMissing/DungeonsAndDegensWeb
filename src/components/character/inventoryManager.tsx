import { useState } from "react";
import supabase from "@/lib/supabase/client";

const InventoryManager = ({ characterId, onItemAdded }: { characterId: string; onItemAdded: () => void }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddItem = async () => {
    if (!selectedItem || quantity < 1) return;

    setLoading(true);
    setError(null);

    const { error: insertError } = await supabase
      .from("inventory")
      .insert([{ character_id: characterId, item_id: selectedItem, quantity }]);

    if (insertError) {
      setError("Failed to add item.");
    } else {
      setSelectedItem(null);
      setQuantity(1);
      onItemAdded();
    }

    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-2">Add Item</h3>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <select
        className="w-full p-2 border rounded mb-2"
        value={selectedItem || ""}
        onChange={(e) => setSelectedItem(e.target.value || null)}
      >
        <option value="">Select an item</option>
        {/* Map items dynamically from fetched data */}
        <option value="item1">Sword</option>
        <option value="item2">Shield</option>
        <option value="item3">Potion</option>
      </select>

      <input
        type="number"
        className="w-full p-2 border rounded mb-2"
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
        min={1}
      />

      <button
        className={`w-full p-2 text-white rounded transition ${
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
  );
};

export default InventoryManager;
