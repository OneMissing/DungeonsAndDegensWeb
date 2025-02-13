import { useState, useEffect, ReactNode } from "react";
import supabase from "@/lib/supabase/client";

type ItemEffect = {
  acid_dice_count?: number;
  acid_dice_sides?: number;
  bludgeoning_dice_count?: number;
  bludgeoning_dice_sides?: number;
  cold_dice_count?: number;
  cold_dice_sides?: number;
  fire_dice_count?: number;
  fire_dice_sides?: number;
  force_dice_count?: number;
  force_dice_sides?: number;
  lightning_dice_count?: number;
  lightning_dice_sides?: number;
  necrotic_dice_count?: number;
  necrotic_dice_sides?: number;
  piercing_dice_count?: number;
  piercing_dice_sides?: number;
  poison_dice_count?: number;
  poison_dice_sides?: number;
  psychic_dice_count?: number;
  psychic_dice_sides?: number;
  radiant_dice_count?: number;
  radiant_dice_sides?: number;
  slashing_dice_count?: number;
  slashing_dice_sides?: number;
  thunder_dice_count?: number;
  thunder_dice_sides?: number;
  healing_dice_count?: number;
  healing_dice_sides?: number;
  armor_class?: number;
};

type Props = {
  itemName: string;
  children: ReactNode;
};

export default function ItemEffectsTooltip({ itemName, children }: Props) {
  const [effects, setEffects] = useState<ItemEffect | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    async function fetchEffects() {
      const { data: itemData, error: itemError } = await supabase
        .from("items")
        .select("id")
        .eq("name", itemName)
        .single();

      if (itemError) {
        console.error("Error fetching item ID:", itemError);
        return;
      }

      const { data, error } = await supabase
        .from("item_effects")
        .select("*")
        .eq("item_id", itemData.id)
        .single();

      if (error) {
        console.error("Error fetching item effects:", error);
      } else {
        setEffects(data);
      }
    }
    fetchEffects();
  }, [itemName]);

  if (!effects) return <>{children}</>;

  const damageTypes = [
    "acid",
    "bludgeoning",
    "cold",
    "fire",
    "force",
    "lightning",
    "necrotic",
    "piercing",
    "poison",
    "psychic",
    "radiant",
    "slashing",
    "thunder",
  ];

  return (
    <div
      className="relative inline-block cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <div className="absolute left-0 top-full mt-2 w-64 p-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-10">
          {damageTypes.map((type) => {
            const count = effects[`${type}_dice_count` as keyof ItemEffect];
            const sides = effects[`${type}_dice_sides` as keyof ItemEffect];
            return count! > 0 && sides! > 0 ? (
              <p key={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)} damage: {count}d{sides}
              </p>
            ) : null;
          })}
          {effects.healing_dice_count! > 0 && effects.healing_dice_sides! > 0 && (
            <p>Heals: {effects.healing_dice_count}d{effects.healing_dice_sides}</p>
          )}
          {effects.armor_class! > 0 && <p>Armor Class: {effects.armor_class}</p>}
        </div>
      )}
    </div>
  );
}
