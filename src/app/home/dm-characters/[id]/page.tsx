"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Inventory from "@/components/items/inventory";
import { useParams } from "next/navigation";

const supabase = createClient();


export default function ParentComponent() {
	const { id }  = useParams();
	const character_id = id;
	const [error, setError] = useState<string | null>(null);

	return (
		<div>
			{error && <p className="text-red-500">{error}</p>}
			<Inventory character_id={id as string}				
					/>
		</div>
	);
}