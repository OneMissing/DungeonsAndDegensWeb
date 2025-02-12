"use client";

import { useState } from "react";

const AddItem = ({ characterId }: { characterId: string }) => {
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddItem = async () => {
    setError(null);
    setSuccess(null);

    const response = await fetch("/api/inventory/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ characterId, itemId, quantity }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Failed to add item.");
    } else {
      setSuccess("Item added successfully!");
      setItemId("");
      setQuantity(1);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-2">Add Item to Inventory</h2>

      <input
        type="text"
        placeholder="Item ID"
        value={itemId}
        onChange={(e) => setItemId(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="border p-2 rounded w-full mb-2"
        min={1}
      />

      <button
        onClick={handleAddItem}
        className="bg-blue-500 text-white p-2 rounded w-full"
      >
        Add Item
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
};

export default AddItem;
