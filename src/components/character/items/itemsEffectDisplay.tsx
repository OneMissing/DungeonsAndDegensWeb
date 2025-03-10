"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type DamageType = "acid" | "bludgeoning" | "cold" | "fire" | "force" | "lightning" | "necrotic" | "piercing" | "poison" | "psychic" | "radiant" | "slashing" | "thunder";

type ItemEffect = {
  [key in `${DamageType}_dice_count` | `${DamageType}_dice_sides`]?: number;
} & {
  healing_dice_count?: number;
  healing_dice_sides?: number;
  armor_class?: number;
};

function ItemEffectsDisplay({ itemId }: { itemId: string }) {
  const [effects, setEffects] = useState<ItemEffect | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchEffects() {
      if (!itemId) return;
      setLoading(true);
      try {
        const storedEffects = localStorage.getItem(`item_effects_${itemId}`);
        if (storedEffects) {
          setEffects(JSON.parse(storedEffects));
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from("item_effects")
          .select("*")
          .eq("item_id", itemId)
          .maybeSingle();

        if (error) {
          console.error("Error fetching item effects:", error);
        } else {
          setEffects(data || null);
          if (data) {
            localStorage.setItem(`item_effects_${itemId}`, JSON.stringify(data));
          }
        }
      } catch (err) {
        console.error("Unexpected error fetching item effects:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEffects();
  }, [itemId]);

  if (loading) return <p>Loading effects...</p>;
  if (!effects) return <p>None</p>;

  const damageTypes: DamageType[] = [
    "acid", "bludgeoning", "cold", "fire", "force", "lightning", "necrotic", "piercing", "poison", "psychic", "radiant", "slashing", "thunder"
  ];

  const hasValidEffects =
    damageTypes.some(
      (type) =>
        (effects?.[`${type}_dice_count` as keyof ItemEffect] ?? 0) > 0 &&
        (effects?.[`${type}_dice_sides` as keyof ItemEffect] ?? 0) > 0
    ) ||
    (effects?.healing_dice_count ?? 0) > 0 ||
    (effects?.armor_class ?? 0) > 0;

  if (!hasValidEffects) return null;

  return (
    <div>
      {damageTypes.map((type) => {
        const count = effects?.[`${type}_dice_count` as keyof ItemEffect] ?? 0;
        const sides = effects?.[`${type}_dice_sides` as keyof ItemEffect] ?? 0;
        return count > 0 && sides > 0 ? (
          <p key={type} className="text-gray-300">
            <span className="font-semibold">
              {type.charAt(0).toUpperCase() + type.slice(1)} Damage:
            </span>{" "}
            {count}d{sides}
          </p>
        ) : null;
      })}
      {effects?.healing_dice_count! > 0 && effects?.healing_dice_sides! > 0 && (
        <p className="text-green-400">
          <span className="font-semibold">Heal:</span>{" "}
          {effects.healing_dice_count}d{effects.healing_dice_sides}
        </p>
      )}
      {effects?.armor_class! > 0 && (
        <p className="text-blue-400">
          <span className="font-semibold">Armor Class:</span>{" "}
          {effects.armor_class}
        </p>
      )}
    </div>
  );
}

export default ItemEffectsDisplay;
