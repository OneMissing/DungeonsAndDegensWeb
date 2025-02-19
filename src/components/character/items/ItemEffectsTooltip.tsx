"use client";

import { useState, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

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
  itemId: string;
  children: ReactNode;
};

export default function ItemEffectsTooltip({ itemId, children }: Props) {
  const supabase = createClient();
  const [effects, setEffects] = useState<ItemEffect | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchEffects() {
      if (!userId) return;

      const { data, error } = await supabase
        .from("item_effects")
        .select("*")
        .eq("item_id", itemId)
        .single();
      if(error && !data)
        setEffects(null);
      setEffects(data);
    }
    fetchEffects();
  }, [itemId, userId]);

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
    damageTypes.some((type) => {
      const diceCountKey = `${type}_dice_count` as keyof ItemEffect;
      const diceSidesKey = `${type}_dice_sides` as keyof ItemEffect;

      return (effects[diceCountKey] ?? 0) > 0 && (effects[diceSidesKey] ?? 0) > 0;
    }) ||
    (effects.healing_dice_count ?? 0) > 0 && (effects.healing_dice_sides ?? 0) > 0 ||
    (effects.armor_class ?? 0) > 0;


  if (!hasValidEffects) return <>{children}</>;

  return (
    <div
      className="relative inline-block cursor-pointer w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <div className="absolute left-1/2 mt-2 w-72 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-xl z-[100] border border-gray-700 transform -translate-x-1/2 animate-fadeIn">
          {damageTypes.map((type) => {
            const diceCountKey = `${type}_dice_count` as keyof ItemEffect;
            const diceSidesKey = `${type}_dice_sides` as keyof ItemEffect;

            const count = effects?.[diceCountKey] ?? 0;
            const sides = effects?.[diceSidesKey] ?? 0;

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
              <span className="font-semibold">Heals:</span>{" "}
              {effects.healing_dice_count}d{effects.healing_dice_sides}
            </p>
          )}
          {effects?.armor_class! > 0 && (
            <p className="text-blue-400">
              <span className="font-semibold">Armor Class:</span> {effects.armor_class}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
