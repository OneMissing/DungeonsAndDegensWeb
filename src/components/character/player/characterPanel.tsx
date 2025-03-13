"use client";

import { useState } from "react";
import { Character, Classes, Races } from "@/lib/tools/types";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const CharacterInfo = ({ character, className }: { character?: Character; className?: string }) => {
  if (character === undefined) return;

  return (
    <div className={`${className}`}>
      <h2 className="text-4xl font-bold text-center">{character.name}</h2>
      <div className="text-lg text-center">
        <span className="inline-block w-20 text-center">{character.race.slice(0, 1).toUpperCase() + character.race.slice(1).toLowerCase()}</span>
        {" - "}
        <span className="inline-block w-20 text-center">{character.class.slice(0, 1).toUpperCase() + character.class.slice(1).toLowerCase()}</span>
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
