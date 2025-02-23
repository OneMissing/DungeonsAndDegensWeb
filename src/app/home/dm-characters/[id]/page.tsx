"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SkillsTable from "@/components/character/dm/skills";
import InventorySection from "@/components/character/items/inventoryDisplay";
import CharacterInfo from "@/components/character/dm/characterInfo";
import { Divider } from "@heroui/react";
import Inventory from "@/components/character/player/inventory";

const CharacterDetails = () => {
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const className = "bg-2-light dark:bg-2-dark mt-4 p-4 rounded-lg shadow-md h-full lg:min-h-[calc(100vh-6.5rem)] lg:max-h-[calc(100vh-6.5rem)] select-none";
	const [table, setTable] = useState<boolean>(false);
	useEffect(() => {
		const fetchData = async () => {
			if (!id) return <p className="text-center text-red-500">Wrong character Link</p>;
			setLoading(false);
		};
		fetchData();
	}, [id]);

	if (loading) return <p className="text-center text-gray-500">Loading character...</p>;
	if (error) return <p className="text-center text-red-500">{error}</p>;

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full pl-4 pr-4 select-none">
			<section className={className}>
				<div className="grid grid-cols-11">
					<button onClick={() => setTable(false)} className={`text-center text-2xl col-span-5`}>
						Charcter
					</button>
					<Divider orientation="vertical" className="w-[0.08rem] rounded-lg bg-[#d4af37] mx-auto" />
					<button onClick={() => setTable(true)} className={`text-2xl col-span-5`}>
						Skills
					</button>
				</div>
				<Divider orientation="vertical" className="mt-1 h-[0.08rem] rounded-lg bg-[#d4af37] mx-auto" />
				<div className="mt-4">
					{table ? (
						<SkillsTable
							characterId={id as string}
							className="min-h-0 lg:min-h-[calc(100vh-12rem)] lg:h-[calc(100vh-12rem)] overflow-y-visible lg:overflow-y-auto mt-4 w-full rounded-lg"
						/>
					) : (
						<CharacterInfo characterId={id as string} className={className} />
					)}
				</div>
			</section>
			<section className={className}>
				<h3 className="text-2xl font-semibold">Spells</h3>
				<p>No spells learned</p>
			</section>
			<section className={`${className} md:col-span-2 min-h-fill max-h-full`}>
				<Inventory character_id={id as string} />
			</section>
		</div>
	);
};

export default CharacterDetails;
