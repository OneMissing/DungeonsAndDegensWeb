import { useEffect, useState } from "react";
import { fetchItemEffects } from "@/lib/fetchItemEffects";

function ItemEffectsDisplay({ itemName }: { itemName: string }) {
  const [effects, setEffects] = useState<string[]>([]);

  useEffect(() => {
    async function loadEffects() {
      const result = await fetchItemEffects(itemName);
      setEffects(result);
    }
    loadEffects();
  }, [itemName]);

  return (
    <div className="mt-2">
      <h4 className="text-sm font-semibold text-gray-700">Effects:</h4>
      <ul className="text-sm text-gray-500">
        {effects.length > 0 ? (
          effects.map((effect, index) => <li key={index}>{effect}</li>)
        ) : (
          <li>none</li>
        )}
      </ul>
    </div>
  );
}

export default ItemEffectsDisplay;