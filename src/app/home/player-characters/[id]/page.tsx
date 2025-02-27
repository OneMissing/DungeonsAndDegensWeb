"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Divider } from "@heroui/react";
import { Item, Tile } from "@/lib/tools/types";
import { getitems } from "@/lib/fetch/fetch";

const GRID_SIZE = 8;
const ADDITIONAL_SLOTS = 6;
const TOTAL_SLOTS = GRID_SIZE * GRID_SIZE + ADDITIONAL_SLOTS;

const getSlotType = (index: number): string => {
	const slotTypes = ["helmet", "chestplate", "gauntlets", "boots", "weapon", "weapon"];
	return slotTypes[index] || "weapon";
};

const initialGrid: Tile[] = Array.from({ length: TOTAL_SLOTS }, (_, index) => ({
	id: `tile-${index}`,
	item: null,
	isSideSlot: index >= GRID_SIZE * GRID_SIZE,
	slotType: index >= GRID_SIZE * GRID_SIZE ? getSlotType(index - GRID_SIZE * GRID_SIZE) : undefined,
}));

initialGrid.push({id: "trash-tile", item: null, isTrash: true,});

const CharacterDetails = () => {
	const [grid, setGrid] = useState<Tile[]>(initialGrid);
	const [itemEffectsMap, setItemEffectsMap] = useState<Record<string, Item[]>>({});
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const className = "bg-2-light dark:bg-2-dark mt-4 p-4 rounded-lg shadow-md xl:min-h-[calc(100vh-6.5rem)] xl:max-h-[calc(100vh-6.5rem)] select-none";
	const [table, setTable] = useState<[boolean, boolean]>([true, true]);

	useEffect(() => {
		const fetchData = async () => {
			if (!id) return <p className="text-center text-red-500">Wrong character Link</p>;
			setLoading(false);
		};
		fetchData();
	}, [id]);

	useEffect(() => {
		getitems().then((effects) => {
			setItemEffectsMap(effects);
			localStorage.setItem("itemEffects", JSON.stringify(effects));
			setLoading(false);
		});
	}, []);

	if (loading) return <p className="text-center text-gray-500">Loading character...</p>;

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full pl-4 pr-4 select-none">
			<section className={className}>
				<div className="grid grid-cols-11">
					<button onClick={() => setTable([true, table[1]])} className={`text-center text-2xl col-span-5`}>
						Character
					</button>
					<Divider orientation="vertical" className="w-[0.08rem] rounded-lg bg-[#d4af37] mx-auto" />
					<button onClick={() => setTable([false, table[1]])} className={`text-2xl col-span-5`}>
						Skills
					</button>
				</div>
				<Divider orientation="vertical" className="my-1 h-[0.08rem] rounded-lg bg-[#d4af37] mx-auto" />
				<div className="mt-4"></div>
			</section>
			<section className={className}>
				<h3 className="text-2xl font-semibold">Spells</h3>
				<p>No spells learned</p>
			</section>
			<section className={`${className} md:col-span-2 min-h-fill max-h-full`}>
				<div className="grid grid-cols-11">
					<button onClick={() => setTable([table[0], true])} className={`text-center text-2xl col-span-5`}>
						Inventory
					</button>
					<Divider orientation="vertical" className="w-[0.08rem] rounded-lg bg-[#d4af37] mx-auto" />
					<button onClick={() => setTable([table[0], false])} className={`text-2xl col-span-5`}>
						Item Adder
					</button>
				</div>
				<Divider orientation="vertical" className="my-1 h-[0.08rem] rounded-lg bg-[#d4af37] mx-auto" />
				<div className="mt-4">{table[1] ? <></> : <></>}</div>
			</section>
		</div>
	);
};

export default CharacterDetails;
