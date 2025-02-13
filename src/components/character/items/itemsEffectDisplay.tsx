"use client";
import { useEffect, useState } from "react";
import { fetchItemEffects } from "@/lib/fetchItemEffects";

function ItemEffectsDisplay({ itemId }: { itemId: string }) {
  const [effects, setEffects] = useState<string[]>([]);

  useEffect(() => {
    async function loadEffects() {
      const result = await fetchItemEffects(itemId);
      setEffects(result);
    }
    loadEffects();
  }, [itemId]);

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700">Effects:</h4>
      <ul className="text-sm text-gray-500">
        {effects.length > 0 ? (
          effects.map((effect, index) => <li key={index}>{effect}</li>)
        ) : ""}
      </ul>
    </div>
  );
}

export default ItemEffectsDisplay;