"use client";
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

  const hasValidEffects =
    damageTypes.some(
      (type) =>
        effects[`${type}_dice_count` as keyof ItemEffect]! > 0 &&
        effects[`${type}_dice_sides` as keyof ItemEffect]! > 0
    ) ||
    (effects.healing_dice_count! > 0 && effects.healing_dice_sides! > 0) ||
    effects.armor_class! > 0;

  if (!hasValidEffects) return <>{children}</>;

  return (
    <div
      className="relative inline-block cursor-pointer w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <div className="absolute left-1/2 top-full mt-2 w-72 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-xl z-10 border border-gray-700 transform -translate-x-1/2 animate-fadeIn">
          {damageTypes.map((type) => {
            const count = effects[`${type}_dice_count` as keyof ItemEffect];
            const sides = effects[`${type}_dice_sides` as keyof ItemEffect];
            return count! > 0 && sides! > 0 ? (
              <p key={type} className="text-gray-300">
                <span className="font-semibold">
                  {type.charAt(0).toUpperCase() + type.slice(1)} Damage:
                </span>{" "}
                {count}d{sides}
              </p>
            ) : null;
          })}
          {effects.healing_dice_count! > 0 && effects.healing_dice_sides! > 0 && (
            <p className="text-green-400">
              <span className="font-semibold">Heals:</span>{" "}
              {effects.healing_dice_count}d{effects.healing_dice_sides}
            </p>
          )}
          {effects.armor_class! > 0 && (
            <p className="text-blue-400">
              <span className="font-semibold">Armor Class:</span>{" "}
              {effects.armor_class}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
