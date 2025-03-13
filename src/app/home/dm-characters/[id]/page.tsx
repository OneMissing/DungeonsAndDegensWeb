"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Inventory from "@/components/items/inventory";
import { useParams } from "next/navigation";
import { Tile, Item, Character, Spell, Action } from "@/lib/tools/types";
import { Divider } from "@heroui/react";
import BookInventory from "@/components/items/adder";
import SpellList from "@/components/character/spellList";
import CharacterPanel from "@/components/character/dm/characterPanel";
import SkillsPanel from "@/components/character/dm/skillsPanel";
import { motion } from "framer-motion";

const supabase = createClient();

const GRID_SIZE = 8;
const ADDITIONAL_SLOTS = 10;
const TOTAL_SLOTS = GRID_SIZE * GRID_SIZE + ADDITIONAL_SLOTS;

const getSlotType = (index: number): string => {
	const slotTypes = ["helmet", "chestplate", "gauntlets", "boots", "cape", "amulet", "ring", "ring", "weapon", "weapon"];
	return slotTypes[index] || "weapon";
};

const initialGrid: Tile[] = Array.from({ length: TOTAL_SLOTS }, (_, index) => ({
	id: `tile-${index}`,
	position: index,
	item: undefined,
	isSideSlot: index >= GRID_SIZE * GRID_SIZE,
	slotType: index >= GRID_SIZE * GRID_SIZE ? getSlotType(index - GRID_SIZE * GRID_SIZE) : undefined,
}));

initialGrid.push({ id: "trash-tile", position: TOTAL_SLOTS, item: undefined, isTrash: true });

export default function Page() {
	const { id } = useParams();
	const [grid, setGrid] = useState<Tile[]>(initialGrid);
	const [error, setError] = useState<string | null>(null);
	const [table, setTable] = useState<[boolean, boolean]>([true, true]);
	const [items, setItems] = useState<Item[]>([]);
	const [spells, setSpells] = useState<Spell[]>([]);
	const [character, setCharacter] = useState<Character | undefined>(undefined);
	const [actions, setActions] = useState<Action[]>([]);

	useEffect(() => {
		if (!id) return;
		const loadInventory = async () => {
			try {
				const { data, error } = await supabase.from("inventory").select("*").eq("character_id", id).order("position");

				if (error) {
					setError("Error fetching inventory data.");
					return;
				}

				const updatedGrid = [...initialGrid];
				data.forEach((inventoryEntry) => {
					const existingItem = updatedGrid.find((tile) => tile.item?.inventory_id === inventoryEntry.inventory_id);
					if (existingItem) return;
					if (inventoryEntry.position !== null) {
						const tile = updatedGrid.find((tile) => tile.position === inventoryEntry.position);
						if (tile) tile.item = inventoryEntry;
					} else {
						const firstAvailableTile = updatedGrid.find((tile) => !tile.item);
						if (firstAvailableTile) {
							firstAvailableTile.item = inventoryEntry;
							supabase
								.from("inventory")
								.update({ position: firstAvailableTile.position })
								.eq("inventory_id", inventoryEntry.inventory_id)
								.then(({ error }) => {
									if (error) console.error("Failed to update item position in the database:", error);
								});
						}
					}
				});
				setGrid(updatedGrid);
			} catch (err) {
				setError("Unexpected error fetching data.");
			}
		};
		const loadItems = async () => {
			try {
				const { data, error } = await supabase.from("items").select("*");
				if (error) {
					setError("Error fetching inventory data.");
					return;
				}
				setItems(data);
			} catch (err) {
				setError("Unexpected error fetching data.");
				console.error(err);
			}
		};
		const loadSpells = async () => {
			try {
				const { data, error } = await supabase.from("spells").select("*");
				if (error) {
					setError("Error fetching inventory data.");
					return;
				}
				setSpells(data);
			} catch (err) {
				setError("Unexpected error fetching data.");
				console.error(err);
			}
		};
		const loadActions = async () => {
			try {
				const { data, error } = await supabase.from("actions").select("*").eq("character_id", id);
				if (error) {
					setError("Error fetching actions data.");
					return;
				}
				setActions(data);
			} catch (err) {
				setError("Unexpected error fetching data.");
				console.error(err);
			}
		};
		const loadCharacter = async () => {
			try {
				const { data, error } = await supabase.from("characters").select("*").eq("character_id", id).single();

				if (error) {
					setError("Error fetching character data.");
					console.error(error);
					return;
				}

				setCharacter(data);
			} catch (err) {
				setError("Unexpected error fetching character data.");
				console.error(err);
			}
		};

		loadCharacter();
		loadInventory();
		loadItems();
		loadSpells();
		loadActions();
	}, []);

	if(error !== null)
		return <>Loading</> 

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full pl-4 pr-4 select-none">
			<section className="bg-2-light dark:bg-2-dark mt-4 p-4 rounded-lg shadow-md xl:min-h-[calc(100vh-6.5rem)] xl:max-h-[calc(100vh-6.5rem)] select-none">
				<div className="grid grid-cols-11">
					<button onClick={() => setTable([true, table[1]])} className={`text-center text-2xl col-span-5`}>
						Charcter
					</button>
					<Divider orientation="vertical" className="w-[0.08rem] rounded-lg bg-[#d4af37] mx-auto" />
					<button onClick={() => setTable([false, table[1]])} className={`text-2xl col-span-5`}>
						Skills
					</button>
				</div>
				<Divider orientation="vertical" className="my-1 h-[0.08rem] rounded-lg bg-[#d4af37] mx-auto" />
				<div className="mt-4 overflow-y-hidden overflow-x-hidden xl:min-h-[calc(100vh-12rem)] xl:max-h-[calc(100vh-12rem)] rounded relative w-full">
					<motion.div className="flex w-[200%] transition-transform" animate={{ x: table[0] ? "0%" : "-50%" }} transition={{ duration: 0.2, ease: "easeInOut" }}>
						<div className="w-1/2">
							<CharacterPanel character={character} setCharacter={setCharacter} className="mt-1" />
						</div>
						<div className="w-1/2 overflow-y-auto overflow-x-hidden xl:min-h-[calc(100vh-12rem)] xl:max-h-[calc(100vh-12rem)] rounded">
							<SkillsPanel character={character} setCharacter={setCharacter} />
						</div>
					</motion.div>
				</div>
			</section>
			<section className="bg-2-light dark:bg-2-dark mt-4 p-4 rounded-lg shadow-md xl:min-h-[calc(100vh-6.5rem)] xl:max-h-[calc(100vh-6.5rem)] select-none">
				<h3 className="text-2xl font-semibold">Spells</h3>
				<SpellList character_id={id as string} spells={spells} actions={actions} />
			</section>
			<section className="bg-2-light dark:bg-2-dark mt-4 p-4 rounded-lg shadow-md xl:min-h-[calc(100vh-6.5rem)] xl:max-h-[calc(100vh-6.5rem)] select-none md:col-span-2 min-h-fill max-h-full">
				<div className="grid grid-cols-11">
					<button onClick={() => setTable([table[0], true])} className={`text-center text-2xl col-span-5`}>
						Character
					</button>
					<Divider orientation="vertical" className="w-[0.08rem] rounded-lg bg-[#d4af37] mx-auto" />
					<button onClick={() => setTable([table[0], false])} className={`text-2xl col-span-5`}>
						Item Adder
					</button>
				</div>
				<Divider orientation="vertical" className="my-1 h-[0.08rem] rounded-lg bg-[#d4af37] mx-auto" />
				<div
					onContextMenu={(event) => {
						event.preventDefault();
					}}
					className="mt-4 overflow-y-hidden overflow-x-hidden xl:min-h-[calc(100vh-12rem)] xl:max-h-[calc(100vh-12rem)] rounded relative w-full">
					<motion.div
						onContextMenu={(event) => {
							event.preventDefault();
						}}
						className="flex w-[200%] transition-transform"
						animate={{ x: table[1] ? "0%" : "-50%" }}
						transition={{ duration: 0.2, ease: "easeInOut" }}>
						<div
							className="w-1/2"
							onContextMenu={(event) => {
								event.preventDefault();
							}}>
							<Inventory character_id={id as string} grid={grid} setGrid={setGrid} items={items} />
						</div>
						<div className="w-1/2 overflow-y-hidden overflow-x-hidden xl:min-h-[calc(100vh-12rem)] xl:max-h-[calc(100vh-12rem)] rounded">
							<BookInventory character_id={id as string} items={items} grid={grid} setGrid={setGrid} />
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
