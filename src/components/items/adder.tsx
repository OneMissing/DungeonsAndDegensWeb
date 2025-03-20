"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Item, Tile, uniqueInstanceTypes } from "@/lib/tools/types";
import DecorativeLine from "../ui/decorativeLine";

const supabase = createClient();

const categories = {
  helmet: ["helmet", "hat", "cap", "light helmet", "light hat", "light cap", "heavy helmet", "heavy hat", "heavy cap"],
  chestplate: ["light chestplate", "chestplate", "armor", "heavy chestplate", "heavy armor"],
  gauntlets: ["light gauntlets", "gauntlets", "heavy gauntlets"],
  boots: ["light boots", "boots", "heavy boots"],
  weapon: ["weapon", "sword", "bow", "knife", "polearm", "axe", "staff", "wand", "shield", "dagger" , "scythe"],
  potion: ["potion"],
  food: ["food", "meal"],
  currency: ["currency", "gem"],
  tool: ["tool"],
  book: ["book", "spellbook"],
  misc: ["misc"],
} as const;

type CategoryKey = keyof typeof categories;

const BookInventory: React.FC<{ character_id: string; items: Item[]; grid: Tile[]; setGrid: (grid: Tile[]) => void }> = ({ character_id, items, grid, setGrid }) => {
  const [activeTab, setActiveTab] = useState<CategoryKey | "all">("all");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const addToInventory = async (item: Item) => {
    try {
      if (uniqueInstanceTypes.includes(item.type)) {
        const { data: insertedItem, error: insertError } = await supabase
          .from("inventory")
          .insert([{ character_id, item_id: item.item_id, quantity: 1 }])
          .select()
          .single();
        if (insertError) throw insertError;
        const firstAvailableTile = grid.find((tile) => !tile.item);
        if (firstAvailableTile) {
          const updatedGrid = grid.map((tile) => tile.id === firstAvailableTile.id ? { ...tile, item: { ...insertedItem, ...item } } : tile);
          setGrid(updatedGrid);
        }
      } else {
        const existingItem = grid.find((tile) => tile.item?.character_id === character_id && tile.item?.item_id === item.item_id)?.item;
        if (existingItem) {
          const { error: updateError } = await supabase
            .from("inventory")
            .update({ quantity: existingItem.quantity + 1 })
            .eq("inventory_id", existingItem.inventory_id);
          if (updateError) throw updateError;
          const updatedGrid = grid.map((tile) => tile.item?.inventory_id === existingItem.inventory_id ? { ...tile, item: { ...tile.item, quantity: tile.item.quantity + 1 } } : tile);
          setGrid(updatedGrid);
        } else {
          const { data: insertedItem, error: insertError } = await supabase
            .from("inventory")
            .insert([{ character_id, item_id: item.item_id, quantity: 1 }])
            .select()
            .single();
          if (insertError) throw insertError;
          const firstAvailableTile = grid.find((tile) => !tile.item);
          if (firstAvailableTile) {
            const updatedGrid = grid.map((tile) => tile.id === firstAvailableTile.id ? { ...tile, item: { ...insertedItem, ...item } } : tile);
            setGrid(updatedGrid);
          }
        }
      }
      showMessage("Item added successfully!", "success");
    } catch (error) {
      console.error("Error adding to inventory:", error);
      showMessage("Failed to add item.", "error");
    }
  };

  const itemTypes = Object.keys(categories) as CategoryKey[];
  const filteredItems = activeTab === "all" 
    ? items 
    : items.filter((item) => (categories[activeTab] as readonly string[]).includes(item.type));

  return (
    <div className="rounded-lg shadow-lg w-full">
      {message ? (
        <div className={`p-2 mb-2 text-center rounded ${message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {message.text}
        </div>
      ):(
      <div className="pb-4 top-0 flex justify-center gap-4 mx-[1px]">
        <select 
          value={activeTab} 
          onChange={(e) => setActiveTab(e.target.value as CategoryKey | "all")} 
          className="dark:bg-gray-700 dark:text-white w-full border p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer" 
          required
        >
          <option key="all" value="all">All</option>
          {itemTypes.map((type) => (
            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
          ))}
        </select>
      </div>
      )}
      <div className="w-full md:h-[calc(100vh-20rem)] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.item_id}
              className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => addToInventory(item)}
            >
              <h2 className="text-xl font-semibold text-secondary-dark dark:text-secondary-light">{item.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{item.description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookInventory;
