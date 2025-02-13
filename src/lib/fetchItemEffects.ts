"use client";
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

export async function fetchItemEffects(itemId: string): Promise<string[]> {

  const { data, error } = await supabase
    .from("item_effects")
    .select("*")
    .eq("item_id", itemId);

  if (error) {
    console.error("Error fetching item effects:", error);
    return [];
  }

  return (data || []).flatMap(effect =>
    damageTypes
      .map(type => {
        const count = effect[`${type}_dice_count` as keyof ItemEffect];
        const sides = effect[`${type}_dice_sides` as keyof ItemEffect];
        return count && sides ? `${type}:${count}d${sides}` : "";
      })
      .filter(entry => entry !== "")
  );
}
