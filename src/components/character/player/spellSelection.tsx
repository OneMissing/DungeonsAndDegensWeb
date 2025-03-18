import React, { useEffect, useState } from "react";
import { Action, Character, Spell, spellSlotTable } from "@/lib/tools/types";

interface SpellSelectionProps {
  character: Character;
  spells: Spell[];
  actions: Action[];
  selectedSpells: string[];
  setSelectedSpells: React.Dispatch<React.SetStateAction<string[]>>;
}

const SpellSelection: React.FC<SpellSelectionProps> = ({
  character,
  spells,
  actions,
  selectedSpells,
  setSelectedSpells,
}) => {
  const knownSpellIds = new Set(actions.map((action) => action.spell_id)); // Spells already known

  // Get spell slot limits for this class and level
  const spellSlots = spellSlotTable[character.class]?.[character.level] || [];
  const highestAvailableSpellLevel = spellSlots.findLastIndex((slots) => slots > 0) + 1;

  // Count selected spells per level
  const selectedCounts = selectedSpells.reduce((acc, spellId) => {
    const spell = spells.find((s) => s.spell_id === spellId);
    if (spell) acc[spell.level] = (acc[spell.level] || 0) + 1;
    return acc;
  }, {} as { [level: number]: number });

  // Get max spells per level
  const maxSpellsByLevel = spellSlots.reduce((acc, slots, i) => {
    if (slots > 0) acc[i + 1] = slots; // Map level (1-based) to slot count
    return acc;
  }, {} as { [level: number]: number });

  useEffect(() => {
    // Ensure selectedSpells never contains known spells
    setSelectedSpells((prev) => prev.filter((spellId) => !knownSpellIds.has(spellId)));
  }, [actions, setSelectedSpells]);

  const handleSelect = (spellId: string, spellLevel: number) => {
    if (knownSpellIds.has(spellId)) return; // Can't deselect known spells

    setSelectedSpells((prev) => {
      if (prev.includes(spellId)) {
        return prev.filter((id) => id !== spellId); // Deselect spell
      } else {
        if ((selectedCounts[spellLevel] || 0) < (maxSpellsByLevel[spellLevel] || 0)) {
          return [...prev, spellId]; // Select spell
        }
      }
      return prev;
    });
  };

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        {spells.map((spell) => {
          const isSelected = selectedSpells.includes(spell.spell_id);
          const isKnown = knownSpellIds.has(spell.spell_id);
          const isAboveMaxLevel = spell.level > highestAvailableSpellLevel;
          const isFull = (selectedCounts[spell.level] || 0) >= (maxSpellsByLevel[spell.level] || 0) && !isSelected;
          if (isKnown || isAboveMaxLevel) return null; 

          return (
            <div
              key={spell.spell_id}
              className={`p-4 border rounded-lg cursor-pointer transition ${
                isSelected ? "bg-blue-500 text-white" : "bg-gray-200"
              } ${isFull ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
              onClick={() => !isFull && handleSelect(spell.spell_id, spell.level)}
            >
              <h3 className="font-bold">{spell.name} (Level {spell.level})</h3>
              <p>{spell.description}</p>
            </div>
          );
        })}
      </div>
  );
};

export default SpellSelection;
