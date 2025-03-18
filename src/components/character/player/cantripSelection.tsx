import React, { useEffect, useState } from "react";
import { Action, Character, Spell, cantripSlotTable } from "@/lib/tools/types";

interface SpellSelectionProps {
    character: Character;
    spells: Spell[];
    actions: Action[];
    selectedSpells: string[];
    setSelectedSpells: React.Dispatch<React.SetStateAction<string[]>>;
}

const CantripSelection: React.FC<SpellSelectionProps> = ({
    character,
    spells,
    actions,
    selectedSpells,
    setSelectedSpells,
}) => {
    const knownSpellIds = new Set(actions.map((action) => action.spell_id)); // Spells already known

    const selectedCounts = selectedSpells.reduce((acc, spellId) => {
        const spell = spells.find((s) => s.spell_id === spellId);
        if (spell) acc[spell.level] = 0;
        return acc;
    }, {} as { [level: number]: number });

    // Get spell slot limits for this class and level
    const spellSlots = cantripSlotTable[character.class]?.[character.level] || [];


    useEffect(() => {
        setSelectedSpells((prev) => prev.filter((spellId) => !knownSpellIds.has(spellId)));
    }, [actions, setSelectedSpells]);

    const handleSelect = (spellId: string, spellLevel: number) => {
        if (knownSpellIds.has(spellId)) return;

        setSelectedSpells((prev) => {
            if (prev.includes(spellId)) {
                return prev.filter((id) => id !== spellId);
            } else {
                if ((selectedCounts[spellLevel] || 0) < 3) {
                    return [...prev, spellId];
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
                const isFull = (selectedCounts[0] || 0) >= 3 && !isSelected;
                if (isKnown || spell.level !== 0) return null;

                return (
                    <div
                        key={spell.spell_id}
                        className={`p-4 border rounded-lg cursor-pointer transition ${isSelected ? "bg-blue-500 text-white" : "bg-gray-200"
                            } ${isFull ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                        onClick={() => !isFull && handleSelect(spell.spell_id, spell.level)}
                    >
                        <h3 className="font-bold">{spell.name}</h3>
                        <p>{spell.description}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default CantripSelection;
