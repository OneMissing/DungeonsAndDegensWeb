"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Action, Spell } from "@/lib/tools/types";
import { motion, AnimatePresence } from "framer-motion";

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

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 1500);
  };

  const handleAddSpell = async (spellID: string) => {
    try {
      const { data, error } = await supabase
        .from("actions")
        .insert([{ character_id, spell_id: spellID }])
        .select();
      if (error) throw error;
      setActions([...actions, ...data]);
      showMessage("Spell added successfully!", "success");
    } catch (err) {
      console.error("Error inserting spell into actions:", err);
      showMessage("Failed to add item.", "error");
    }
  };

  const handleRemoveSpell = async (spellID: string) => {
    try {
      const { error } = await supabase.from("actions").delete().match({ character_id, spell_id: spellID });
      if (error) throw error;
      setActions(actions.filter((action) => action.spell_id !== spellID));
      showMessage("Spell removed successfully!", "success");
    } catch (err) {
      console.error("Error removing spell from actions:", err);
      showMessage("Failed to add item.", "error");
    }
  };

  return (
    <div className="-mt-2 rounded-lg w-full">
      <div className="rounded-lg shadow-lg w-full">
        <div className="w-full h-14">
          <AnimatePresence mode="wait">
            {message !== null ? (
              <motion.div
                key="message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full h-full flex items-center justify-center" // Full height and centered
              >
                <div className={`w-full p-2 text-center rounded ${message?.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>{message?.text}</div>
              </motion.div>
            ) : (
              <motion.div
                key="dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full h-full flex items-center justify-center" // Full height and centered
              >
                <div key="dropdown" className="w-full h-full flex items-center justify-center">
                  <div className={`${table ? "gap-2" : "gap-0"} w-full flex mr-[0.1px] transition-width duration-300 ease-linear`}>
                    <button
                      className={`transition-width duration-300 ease-linear dark:bg-gray-700 dark:text-white hover:dark:bg-gray-500 border rounded-lg shadow-md hover:shadow-lg cursor-pointer ${
                        table ? "w-1/3" : "w-full"
                      }`}
                      onClick={() => setTable(!table)}>
                      {table ? "Learning" : "Forgetting"}
                    </button>
                    <div className={`${table ? "w-2/3" : "w-0"} transition-width duration-200 ease-linear`}>
                      <select
                        value={activeTab}
                        onChange={(e) => setActiveTab(Number(e.target.value))}
                        className="dark:bg-gray-700 dark:text-white w-full border p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                        required>
                        <option value="-1">All</option>
                        {[...new Set(spells.map((spell) => spell.level))]
                          .sort((a, b) => a - b)
                          .map((level) => (
                            <option key={level} value={level}>{`Level ${level}`}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            onContextMenu={(event) => {
              event.preventDefault();
            }}
            className="flex w-[200%] transition-transform flex-grow"
            animate={{ x: table ? "-50%" : "0%" }}
            transition={{ duration: 0.15, ease: "easeInOut" }}>
            <div className="w-1/2 lg:h-[calc(100vh-20rem)] overflow-y-auto">
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
            <div
              className="w-1/2 lg:h-[calc(100vh-20rem)] overflow-y-auto"
              onContextMenu={(event) => {
                event.preventDefault();
              }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 mx-[1px]">
                {availableSpells.map((spell) => (
                  <button onClick={() => handleAddSpell(spell.spell_id)} key={spell.spell_id}>
                    <div className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700w">
                      <h2 className="text-xl font-semibold text-secondary-dark dark:text-secondary-light">{spell.name}</h2>
                      <p className="text-gray-600 dark:text-gray-300 mt-2">{spell.description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Level {spell.level}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SpellBook;

/**
        <div className="w-full h-14">
          <AnimatePresence mode="wait">
            {message !== null ? (
              <motion.div
                key="message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full h-full flex items-center justify-center" // Full height and centered
              >
                <div className={`w-full p-2 text-center rounded ${message?.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>{message?.text}</div>
              </motion.div>
            ) : (
              // Select Dropdown
              <motion.div
                key="dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full h-full flex items-center justify-center" // Full height and centered
              >
                <div className="pb-4 top-0 flex justify-center gap-4 mx-[1px]">
                  <button
                    className={`dark:bg-gray-700 dark:text-white hover:dark:bg-gray-500 border rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
                      table ? "w-1/3" : "w-full"
                    }`}
                    onClick={() => setTable(!table)}>
                    {table ? "Learning" : "Forgetting"}
                  </button>
                  {table && (
                    <select
                      value={activeTab}
                      onChange={(e) => setActiveTab(Number(e.target.value))}
                      className="dark:bg-gray-700 dark:text-white w-full border p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
 */
