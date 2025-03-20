"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Action, Spell } from "@/lib/tools/types";

const supabase = createClient();

const SpellBook: React.FC<{ character_id: string; spells: Spell[]; actions: Action[]; setActions: (actions: Action[]) => void }> = ({
  character_id,
  spells,
  actions,
  setActions,
}) => {
  const [activeTab, setActiveTab] = useState<number>(-1);
  const [table, setTable] = useState(true);

  const usedSpellIds = new Set(actions.map((action) => action.spell_id));
  const availableSpells = spells.filter((spell) => !usedSpellIds.has(spell.spell_id) && (activeTab === -1 || spell.level === activeTab));
  const learnedSpells = spells.filter((spell) => usedSpellIds.has(spell.spell_id));

  const handleAddSpell = async (spellID: string) => {
    try {
      const { data, error } = await supabase
        .from("actions")
        .insert([{ character_id, spell_id: spellID }])
        .select();
      if (error) throw error;
      setActions([...actions, ...data]);
    } catch (err) {
      console.error("Error inserting spell into actions:", err);
    }
  };

  const handleRemoveSpell = async (spellID: string) => {
    try {
      const { error } = await supabase.from("actions").delete().match({ character_id, spell_id: spellID });
      if (error) throw error;
      setActions(actions.filter((action) => action.spell_id !== spellID));
    } catch (err) {
      console.error("Error removing spell from actions:", err);
    }
  };

  return (
    <div className="rounded-lg shadow-lg w-full">
      <div className="pb-4 top-0 flex justify-center gap-4 mx-[1px]">
        <button
          className={`dark:bg-gray-700 dark:text-white hover:dark:bg-gray-500 border p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
            table ? "w-1/3" : "w-full"
          }`}
          onClick={() => setTable(!table)}>
          {table ? "Learning" : "Forgetting"}
        </button>
        {table && (
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(Number(e.target.value))}
            className="dark:bg-gray-700 dark:text-white w-2/3 border p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            required>
            <option value="-1">All</option>
            {[...new Set(spells.map((spell) => spell.level))]
              .sort((a, b) => a - b)
              .map((level) => (
                <option key={level} value={level}>{`Level ${level}`}</option>
              ))}
          </select>
        )}
      </div>

      {table ? (
        <div className="w-full md:h-[calc(100vh-20rem)] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 mx-[1px]">
            {availableSpells.map((spell) => (
              <button onClick={() => handleAddSpell(spell.spell_id)} key={spell.spell_id}>
                <div className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <h2 className="text-xl font-semibold text-secondary-dark dark:text-secondary-light">{spell.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">{spell.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Level {spell.level}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full md:h-[calc(100vh-20rem)] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 mx-[1px]">
            {learnedSpells.map((spell) => (
              <button onClick={() => handleRemoveSpell(spell.spell_id)} key={spell.spell_id}>
                <div className="border rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800">
                  <div className="rounded-lg hover:bg-red-200 p-4 dark:hover:bg-red-400">
                    <h2 className="text-xl font-semibold text-secondary-dark dark:text-secondary-light">{spell.name}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{spell.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Level {spell.level}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpellBook;
