"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Inventory from "@/components/items/inventory";
import { useParams } from "next/navigation";
import { Tile, Item, Character, Spell, Action } from "@/lib/tools/types";
import { Divider } from "@heroui/react";
import BookInventory from "@/components/items/adder";
import SpellList from "@/components/character/spellList";
import CharacterPanel from "@/components/character/player/characterPanel";
import SkillsPanel from "@/components/character/player/skillsPanel";
import { motion } from "framer-motion";
import DecorativeLine from "@/components/ui/decorativeLine";

const supabase = createClient();

const GRID_SIZE = 8;
const ADDITIONAL_SLOTS = 10;
const TOTAL_SLOTS = GRID_SIZE * GRID_SIZE + ADDITIONAL_SLOTS;

const getSlotType = (index: number): string => {
  const slotTypes = ["helmet", "chestplate", "gauntlets", "boots", "cape", "amulet", "ring", "ring", "weapon", "weapon"];
  return slotTypes[index] || "weapon";
};

const initialGrid: Tile[] = Array.from({ length: TOTAL_SLOTS }, (_, index) => ({
  id: `tile-${index}`,
  position: index,
  item: undefined,
  isSideSlot: index >= GRID_SIZE * GRID_SIZE,
  slotType: index >= GRID_SIZE * GRID_SIZE ? getSlotType(index - GRID_SIZE * GRID_SIZE) : undefined,
}));

initialGrid.push({ id: "trash-tile", position: TOTAL_SLOTS, item: undefined, isTrash: true });

export default function Page() {
  const { id } = useParams();
  const [grid, setGrid] = useState<Tile[]>(initialGrid);
  const [error, setError] = useState<string | null>(null);
  const [table, setTable] = useState<[boolean, boolean]>([true, true]);
  const [items, setItems] = useState<Item[]>([]);
  const [spells, setSpells] = useState<Spell[]>([]);
  const [character, setCharacter] = useState<Character | undefined>(undefined);
  const [actions, setActions] = useState<Action[]>([]);

  useEffect(() => {
    if (!id) return;
    const loadInventory = async () => {
      try {
        const { data, error } = await supabase.from("inventory").select("*").eq("character_id", id).order("position");

        if (error) {
          setError("Error fetching inventory data.");
          return;
        }

        const updatedGrid = [...initialGrid];
        data.forEach((inventoryEntry) => {
          const existingItem = updatedGrid.find((tile) => tile.item?.inventory_id === inventoryEntry.inventory_id);
          if (existingItem) return;
          if (inventoryEntry.position !== null) {
            const tile = updatedGrid.find((tile) => tile.position === inventoryEntry.position);
            if (tile) tile.item = inventoryEntry;
          } else {
            const firstAvailableTile = updatedGrid.find((tile) => !tile.item);
            if (firstAvailableTile) {
              firstAvailableTile.item = inventoryEntry;
              supabase
                .from("inventory")
                .update({ position: firstAvailableTile.position })
                .eq("inventory_id", inventoryEntry.inventory_id)
                .then(({ error }) => {
                  if (error) console.error("Failed to update item position in the database:", error);
                });
            }
          }
        });
        setGrid(updatedGrid);
      } catch (err) {
        setError("Unexpected error fetching data.");
      }
    };

    const loadItems = async () => {
      try {
        const { data, error } = await supabase.from("items").select("*");
        if (error) {
          setError("Error fetching inventory data.");
          return;
        }
        setItems(data);
      } catch (err) {
        setError("Unexpected error fetching data.");
        console.error(err);
      }
    };

    const loadSpells = async () => {
      try {
        const { data, error } = await supabase.from("spells").select("*");
        if (error) {
          setError("Error fetching inventory data.");
          return;
        }
        setSpells(data);
      } catch (err) {
        setError("Unexpected error fetching data.");
        console.error(err);
      }
    };

    const loadActions = async () => {
      try {
        const { data, error } = await supabase.from("actions").select("*").eq("character_id", id);
        if (error) throw new Error("Error fetching data");
        setActions(data);
      } catch (error) {
        setError(error as string);
      }
    };

    const loadCharacter = async () => {
      try {
        const { data, error } = await supabase.from("characters").select("*").eq("character_id", id).single();
        if (error) throw new Error("Error fetching data");
        setCharacter(data);
      } catch (err) {
        setError(error as string);
      }
    };

    loadCharacter();
    loadInventory();
    loadItems();
    loadSpells();
    loadActions();
  }, []);

  if (error !== null) return <>Loading</>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full p-4 select-none">
      {/* Character & Skills Section */}
      <section className="bg-white dark:bg-gray-800 mt-4 p-6 rounded-lg shadow-lg lg:overflow-hidden lg:h-[calc(100vh-8rem)]">
        <div className="relative flex gap-4 -mb-2 bg-gray-200 dark:bg-gray-700 pr-1 pt-1 pb-1 rounded-lg ">
          <motion.div
            className="absolute top-0 bottom-0 w-1/2 bg-[#d4af37] rounded-lg"
            initial={false}
            animate={{ x: table[0] ? "0%" : "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 20, duration: 0.2 }}
          />
          <button
            onClick={() => setTable([true, table[1]])}
            onDoubleClick={() => setTable([true, true])}
            className="relative md:text-2xl text-lg font-semibold w-1/2 p-2 rounded-lg transition-colors">
            <motion.span
              animate={{ scale: table[0] ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, duration: 0.2 }}
              className={table[0] ? "text-white" : "text-secondary-light"}>
              {" "}
              Character{" "}
            </motion.span>
          </button>
          <button
            onClick={() => setTable([false, table[1]])}
            onDoubleClick={() => setTable([false, false])}
            className="relative md:text-2xl text-lg font-semibold w-1/2 p-2 rounded-lg transition-colors">
            <motion.span
              animate={{ scale: !table[0] ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, duration: 0.2 }}
              className={!table[0] ? "text-white" : "text-secondary-light"}>
              {" "}
              Skills{" "}
            </motion.span>
          </button>
        </div>
        <DecorativeLine color="#d4af37" />
        <div className="-mt-2 overflow-y-auto overflow-x-hidden lg:overflow-hidden lg:h-[calc(100vh-14rem)]">
          <motion.div className="hidden lg:flex w-[200%] transition-transform" animate={{ x: table[0] ? "0%" : "-50%" }} transition={{ duration: 0.2, ease: "easeInOut" }}>
            <div className="w-1/2">
              <CharacterPanel character={character} setCharacter={setCharacter} className="mt-1" spells={spells} actions={actions} setActions={setActions} />
            </div>
            <div className="w-1/2 overflow-y-auto overflow-x-hidden lg:overflow-hidden">
              <SkillsPanel character={character} setCharacter={setCharacter} />
            </div>
          </motion.div>
        </div>
        <div className="lg:hidden flex h-full w-full">
          {table[0] ? (
            <CharacterPanel character={character} setCharacter={setCharacter} spells={spells} actions={actions} setActions={setActions} className="mt-1 w-full" />
          ) : (
            <SkillsPanel character={character} setCharacter={setCharacter} className="w-full" />
          )}
        </div>
      </section>

      {/* Spells Section */}
      <section className="bg-white dark:bg-gray-800 mt-4 p-6 rounded-lg shadow-lg lg:overflow-hidden lg:h-[calc(100vh-8rem)]">
        <div className="relative flex gap-4 -mb-2 bg-gray-200 dark:bg-gray-700 pr-1 pt-1 pb-1 rounded-lg ">
          <motion.div className="absolute top-0 bottom-0 w-full bg-[#d4af37] rounded-lg" initial={false} />
          <div className="relative md:text-2xl text-lg font-semibold w-full p-2 rounded-lg transition-colors">
            <motion.span animate={{ scale: table[0] ? 1.1 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 15, duration: 0.2 }} className={"text-white"}>
              {" "}
              Character{" "}
            </motion.span>
          </div>
        </div>
        <DecorativeLine color="#d4af37" />
        <div className="-mt-2">
          <SpellList character_id={id as string} spells={spells} actions={actions} />
        </div>
      </section>

      {/* Inventory & Item Adder Section */}
      <section className={`bg-white xl:h-[calc(100vh-8rem)] overflow-hidden dark:bg-gray-800 mt-4 p-6 rounded-lg shadow-lg md:col-span-2 lg:overflow-hidden md:h-auto`}>
        <div className="relative flex gap-4 -mb-2 bg-gray-200 dark:bg-gray-700 pr-1 pt-1 pb-1 rounded-lg">
          <motion.div
            className="absolute top-0 bottom-0 w-1/2 bg-[#d4af37] rounded-lg"
            initial={false}
            animate={{ x: table[1] ? "0%" : "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 20, duration: 0.2 }}
          />
          <button
            onClick={() => setTable([table[0], true])}
            onDoubleClick={() => setTable([true, true])}
            className="relative md:text-2xl text-lg font-semibold w-1/2 p-2 rounded-lg transition-colors">
            <motion.span
              animate={{ scale: table[1] ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, duration: 0.2 }}
              className={table[1] ? "text-white" : "text-secondary-light"}>
              Inventory
            </motion.span>
          </button>

          <button
            onClick={() => setTable([table[0], false])}
            onDoubleClick={() => setTable([false, false])}
            className="relative md:text-2xl text-lg font-semibold w-1/2 p-2 rounded-lg transition-colors">
            <motion.span
              animate={{ scale: !table[1] ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, duration: 0.2 }}
              className={!table[1] ? "text-white" : "text-secondary-light"}>
              Item Book
            </motion.span>
          </button>
        </div>

        <DecorativeLine color="#d4af37" />
        <div
          onContextMenu={(event) => {
            event.preventDefault();
          }}
          className="-mt-2 h-full overflow-hidden hidden lg:flex flex-col">
          <motion.div
            onContextMenu={(event) => {
              event.preventDefault();
            }}
            className="flex w-[200%] transition-transform flex-grow"
            animate={{ x: table[1] ? "0%" : "-50%" }}
            transition={{ duration: 0.2, ease: "easeInOut" }}>
            <div
              className="w-1/2 h-full"
              onContextMenu={(event) => {
                event.preventDefault();
              }}>
              <div className="h-full">
                <Inventory character_id={id as string} grid={grid} setGrid={setGrid} items={items} />
              </div>
            </div>
            <div className="w-1/2 h-full overflow-y-auto">
              <BookInventory character_id={id as string} items={items} grid={grid} setGrid={setGrid} />
            </div>
          </motion.div>
        </div>
        <div className="lg:hidden flex">
          {table[1] ? (
            <div className="h-full w-full">
              <Inventory character_id={id as string} grid={grid} setGrid={setGrid} items={items} />
            </div>
          ) : (
            <div className="w-full h-full overflow-y-auto">
              <BookInventory character_id={id as string} items={items} grid={grid} setGrid={setGrid} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
