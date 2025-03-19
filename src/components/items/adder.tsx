"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Item, Tile, uniqueInstanceTypes } from "@/lib/tools/types";
import { PosAnimation } from "leaflet";
const supabase = createClient();

const BookInventory: React.FC<{ character_id: string; items: Item[]; grid: Tile[]; setGrid: (grid: Tile[]) => void }> = ({ character_id, items, grid, setGrid }) => {
  const [activeTab, setActiveTab] = useState<string>("all");

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
          const updatedGrid = grid.map((tile) => {
            if (tile.id === firstAvailableTile.id) {
              return { ...tile, item: { ...insertedItem, ...item } };
            }
            return tile;
          });
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
          const updatedGrid = grid.map((tile) => {
            if (tile.item?.inventory_id === existingItem.inventory_id) {
              return { ...tile, item: { ...tile.item, quantity: tile.item.quantity + 1 } };
            }
            return tile;
          });
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
            const updatedGrid = grid.map((tile) => {
              if (tile.id === firstAvailableTile.id) {
                return { ...tile, item: { ...insertedItem, ...item } };
              }
              return tile;
            });
            setGrid(updatedGrid);
          }
        }
      }
    } catch (error) {
      console.error("Error adding to inventory:", error);
    }
  };
  const itemTypes = Array.from(new Set(items.map((item) => item.type)));
  const filteredItems = activeTab === "all" ? items : items.filter((item) => item.type === activeTab);

  return (
    <div className="rounded-lg shadow-lg">
      <div className="pb-4 sticky">
      <select value={activeTab} onChange={(e) => setActiveTab(e.target.value)} className="bg-gray-700 text-white p-2 w-full rounded" required >
        <option key="all" value="all">All</option>
        {itemTypes.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>
      </div>

      <div className="w-full overflow-y-auto lg:h-[calc(100vh-20rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.item_id}
              className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => addToInventory(item)}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{item.name}</h2>
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
