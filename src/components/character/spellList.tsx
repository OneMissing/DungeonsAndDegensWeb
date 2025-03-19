"use client";

import { Action, Spell } from "@/lib/tools/types";
import { Tooltip } from "@heroui/react";
import { Anvil, Brain, Hand, Pentagon, Volume2 } from "lucide-react";
import { useState } from "react";
import DecorativeLine from "../ui/decorativeLine";

const SpellList: React.FC<{ character_id: string; spells: Spell[]; actions: Action[] }> = ({ character_id, spells, actions }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState<string | null>(null);

  return (
    <div className="w-full p-4">
      <ul
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        }}>
        {actions.map((action) => {
          const spell = spells.find((spell) => spell.spell_id === action.spell_id);
          return (
            <li key={action.action_id} className="text-center">
              {spell && (
                <Tooltip
                  offset={6}
                  closeDelay={100}
                  delay={150}
                  placement="bottom"
                  className="pointer-events-none transition-opacity duration-300 ease-in-out"
                  onMouseEnter={() => setIsTooltipVisible(spell.spell_id)}
                  onMouseLeave={() => setIsTooltipVisible(null)}
                  content={
                    isTooltipVisible === spell.spell_id && (
                      <div className="min-w-40 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90 p-3 bg-gray-200 dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg w-full max-w-[90vw] sm:max-w-lg">
                        <div className="text-medium font-bold">{spell.name}</div>
                        <div className="-mb-4 -mt-4 w-full">
												<DecorativeLine />
                        </div>
                        <div className="grid gap-1 text-sm">
                          <div className="flex justify-between">
                            <p className="font-semibold">School:</p> <span>{spell.school}</span>
                          </div>
                          <div className="flex justify-between">
                            <p className="font-semibold">Type:</p> <span>{spell.level === 0 ? "Cantrip" : `${spell.level} spell`}</span>
                          </div>
                          <div className="flex justify-between">
                            <p className="font-semibold">Duration:</p> <span>{spell.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <p className="font-semibold">Casting Time:</p> <span>{spell.casting_time}</span>
                          </div>
                          <div className="flex justify-between">
                            <p className="font-semibold">Range:</p> <span>{spell.range}</span>
                          </div>
                          <div className="flex justify-between">
                            {(spell.ritual || spell.concentration) && (
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">Kind:</p>
                                {spell.concentration && <Brain />}
                                {spell.ritual && <Pentagon />}
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">Components:</p>
                              <div className="flex gap-1">
                                {spell.components.includes("V") && <Volume2 />}
                                {spell.components.includes("S") && <Hand />}
                                {spell.components.includes("M") && <Anvil />}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }>
                  <strong className="cursor-pointer hover:text-yellow-500 block w-full" onMouseEnter={() => setIsTooltipVisible(spell.spell_id)}>
                    {spell.name}
                  </strong>
                </Tooltip>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SpellList;
