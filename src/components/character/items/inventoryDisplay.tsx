"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase/client";
import { Button } from "@/components/ui/cards/button";
import { Card } from "@/components/ui/cards/card";
import { CardContent } from "@/components/ui/cards/cardContent";
import ItemEffectsTooltip from "@/components/character/items/ItemEffectsTooltip";
import ItemEffectsDisplay from "@/components/character/items/itemsEffectDisplay";

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

interface Item {
  id: string;
  name: string;
}

interface InventorySectionProps {
  characterId: string;
}

const InventorySection: React.FC<InventorySectionProps> = ({ characterId }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<"Inventory" | "Items">("Inventory");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Fetch the inventory data for the given character
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("inventory")
        .select("id, quantity, items(id, name, description, type, weight, value)")
        .eq("character_id", characterId);
      if (error) throw new Error("Failed to load inventory.");

      const formattedInventory = data.map((entry: any) => ({
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
    fetchInventory();
  }, [characterId]);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from("items").select("id, name");
      if (error) console.error("Failed to fetch items:", error);
      else setItems(data);
    };

    fetchItems();
  }, []);

  const toggleExpand = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const updateInventoryState = (itemId: string, change: number) => {
    setInventory((prev) =>
      prev
        .map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + change } : item
        )
        .filter((item) => item.quantity > 0)
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

  const handleAddItem = async () => {
    if (!selectedItem || quantity < 1) return;

    setLoading(true);
    setError(null);

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
      for (let index = 0; index < quantity; index++) {
        addItem(existingItem.id);
      }
    } else {
      const { error: insertError } = await supabase
        .from("inventory")
        .insert([{ character_id: characterId, item_id: selectedItem.id, quantity }]);

      if (insertError) {
        setError("Failed to add item.");
        setLoading(false);
        return;
      }
    }
    updateInventoryState(selectedItem.id, quantity);
    setLoading(false);
  };

  if (loading) return <p className="text-center text-gray-500">Loading inventory...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="bg-gray-100 p-6 rounded-lg shadow-md min-h-0 md:min-h-[calc(100vh-6rem)] md:h-[calc(100vh-6rem)]">
      <div className="grid-cols-2">
        <Button
          className="w-1/2"
          variant={activeButton === "Inventory" ? "default" : "outline"}
          onClick={() => setActiveButton("Inventory")}
        >
          Inventory
        </Button>
        <Button
          className="w-1/2"
          variant={activeButton === "Items" ? "default" : "outline"}
          onClick={() => setActiveButton("Items")}
        >
          Items
        </Button>
      </div>
      <Card>
        <CardContent>
          {activeButton === "Inventory" ? (
            inventory.length === 0 ? (
              <p className="text-gray-500">No items in inventory.</p>
            ) : (
              <ul className="border rounded bg-white overflow-y-auto">
                {inventory.map((item) => (
                  <li key={item.id} className="border p-2 rounded-lg shadow-sm bg-white">
                    {expandedItem === item.id ? (
                      <div>
                        <div
                          className="grid grid-cols-2 items-center"
                          onClick={() => toggleExpand(item.id)}
                        >
                          <h4 className="text-lg font-semibold cursor-pointer text-yellow-600">
                            {item.name}
                          </h4>
                          <h6 className="text-lg font-semibold cursor-pointer text-yellow-600">
                            {item.quantity}×
                          </h6>
                        </div>
                        <div>
                          {item.description && (
                            <p className="text-gray-600">{item.description}</p>
                          )}
                          <p className="text-sm text-gray-500">Type: {item.type}</p>
                          <p className="text-sm text-gray-500">
                            Weight: {item.weight} | Value: {item.value} gp
                          </p>
                          <ItemEffectsDisplay itemId={item.id} />
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <button
                              className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-700"
                              onClick={() => addItem(item.id)}
                            >
                              Add
                            </button>
                            <button
                              className="bg-red-400 text-white py-2 rounded-lg hover:bg-red-700"
                              onClick={() => removeItem(item.id)}
                            >
                              Use
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <ItemEffectsTooltip itemId={item.id}>
                        <div
                          className="grid grid-cols-2 items-center"
                          onClick={() => {
                            toggleExpand(item.id);
                          }}
                        >
                          <h4 className="text-lg font-semibold cursor-pointer text-yellow-600">
                            {item.name}
                          </h4>
                          <h6 className="text-lg font-semibold cursor-pointer text-yellow-600">
                            {item.quantity}×
                          </h6>
                        </div>
                      </ItemEffectsTooltip>
                    )}
                  </li>
                ))}
              </ul>
            )
          ) : (
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
                  className={`p-2 w-full text-white rounded transition ${selectedItem
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
                <ul className="rounded-lg shadow-md min-h-0 md:min-h-[calc(100vh-13rem)] md:h-[calc(100vh-13rem)] overflow-y-visible md:overflow-y-auto mt-4">
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
                    onClick={() => { setSelectedItem(null); setSearchTerm(""); }}
                  >
                    Deselect
                  </button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default InventorySection;
