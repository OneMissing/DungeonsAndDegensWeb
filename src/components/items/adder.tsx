"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Item, Tile, uniqueInstanceTypes } from "@/lib/tools/types";
import { PosAnimation } from "leaflet";
const supabase = createClient();

const BookInventory: React.FC<{character_id: string; items: Item[]; grid: Tile[]; setGrid: (grid: Tile[]) => void; }> = ({ character_id, items, grid, setGrid }) => {
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
        } catch (error) {console.error("Error adding to inventory:", error)}
    };
	const itemTypes = Array.from(new Set(items.map((item) => item.type)));
	const filteredItems = activeTab === "all" ? items : items.filter((item) => item.type === activeTab);

	return (
		<div className="flex h-full">
			<div className="w-1/5 border-r-1 border-yellow-400 h-full">
				<h2 className="text-lg font-bold mb-2 pb-2 w-full border-b-1 border-yellow-400">Categories</h2>
				<ul className="px-2 h-full overflow-auto">
					<li className={`mb-1 p-1 cursor-pointer ${activeTab === "all" ? " text-white" : ""}`} onClick={() => setActiveTab("all")}>
						All
					</li>
					{itemTypes.map((type) => (
						<li key={type} className={`mb-1 p-1 cursor-pointer ${activeTab === type ? " text-white" : ""}`} onClick={() => setActiveTab(type)}>
							{type}
						</li>
					))}
				</ul>
			</div>

			<div className="w-4/5 p-4">
				<h1 className="text-2xl font-bold mb-4">Items</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredItems.map((item) => (
						<div
							key={item.item_id}
							className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-1-light dark:bg-1-dark hover:bg-3-light dark:hover:bg-3-dark"
							onClick={() => addToInventory(item)}>
							<h2 className="text-xl font-semibold">{item.name}</h2>
							<p className="text-gray-600">{item.description}</p>
							<p className="text-sm text-gray-500">{item.type}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default BookInventory;
