"use client";

import { useState } from "react";
import { Eraser, Trash, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Tooltip } from "@heroui/react";
import { Character } from "@/lib/tools/types";

interface RemoveProps {
	charId: string;
	characters: Character[];
	setCharacters: (characters: Character[]) => void;
}

const Remove: React.FC<RemoveProps> = ({ charId, characters, setCharacters }) => {
	const supabase = createClient();
	const [loading, setLoading] = useState(false);

	const handleRemove = async () => {
		setLoading(true);
		try {
			const { error } = await supabase.from("characters").update({ player_id: null }).eq("character_id", charId);
		} catch (error) {
			console.error("Failed to copy text:", error);
		}
		finally{
			setLoading(false);
			setCharacters(characters.filter(character => character.character_id !== charId));
		}
	};

	return (
		<Tooltip
			placement="bottom"
			offset={0}
			delay={0}
			closeDelay={0}
			classNames={{
				base: ["before:bg-neutral-400 bg-1-dark dark:before:bg-1-light rounded-lg border-md border-1-light"],
				content: ["py-2 px-4 shadow-xl rounded-lg"],
			}}
			content="Remove from control"
			showArrow={true}>
			<button
				onClick={(e) => {
					e.stopPropagation();
					handleRemove();
				}}
				className="flex items-center gap-2 p-2 text-white bg-red-500 rounded-lg shadow-md hover:bg-red-900 transition z-[120]">
				<motion.div
					key={loading ? "checked" : "clipboard"}
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.8 }}
					transition={{ duration: 0.2 }}>
					{loading ? <Trash2 size={24} /> : <Eraser size={24} />}
				</motion.div>
			</button>
		</Tooltip>
	);
};

export default Remove;
