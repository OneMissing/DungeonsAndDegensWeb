"use client";

import { useState } from "react";
import { Action, Character, Classes, Races, Spell } from "@/lib/tools/types";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { BookPlus } from "lucide-react";
import { useLevelUp } from "./levelUp";
import DecorativeLine from "@/components/ui/decorativeLine";


const CharacterInfo = ({ character, setCharacter, spells, actions, setActions, className }: { character?: Character; setCharacter: (character: Character) => void; setActions: (actions: Action[]) => void; spells: Spell[]; actions: Action[];className?: string }) => {
  if (character === undefined) return;
  const { openLevelUp } = useLevelUp();

  return (
    <div className={`${className}`}>
      <div className="flex">
      {character.level < 20 && <div className="mt-1"><button onClick={() => openLevelUp(character, spells, actions, setCharacter, setActions)}><BookPlus size={30} /></button></div>}
      <h2 className="text-4xl font-bold text-center m-auto">{character.name}</h2>
      {character.level < 20 && (<div className="w-[30px]"></div>)}
      </div>
      <div className="text-lg text-center">
        <span className="inline-block text-end">{character.race.slice(0, 1).toUpperCase() + character.race.slice(1).toLowerCase()}</span>
        {" - "}
        <span className="inline-block text-start">{character.class.slice(0, 1).toUpperCase() + character.class.slice(1).toLowerCase()}</span>
        {" (Level "}
        {character.level}
        {")"}
      </div>
      <div className="text-center">
        <p>
          HP:
          <span className="inline-block w-12 text-center">{character.hpnow}</span> /<span className="inline-block w-12 text-center appearance-none">{character.hpmax}</span> +
          <span  className="inline-block w-12 text-center appearance-none">
            
              {character.hptmp}
          </span>
        </p>
      </div>
      <h3 className="text-2xl font-semibold">Attributes</h3>
      <ul className="grid grid-cols-2 gap-4 text-gray-700">
        {(["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"] as (keyof Character)[]).map((attr) => (
          <li key={attr} >
            <strong>{attr.toUpperCase().slice(0, 3)}:</strong>{" "}
              {character[attr] ?? "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CharacterInfo;
