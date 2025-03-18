"use client";

import { createContext, useContext, useState, ReactNode, useEffect, SetStateAction } from "react";
import { Action, cantripSlotTable, Character, Spell, spellSlotTable } from "@/lib/tools/types";
import { createClient } from "@/lib/supabase/client";
import SpellSelection from "./spellSelection";
import CantripSelection from "./cantripSelection";

interface LevelUpContextType {
  openLevelUp: (
    character: Character,
    spells: Spell[],
    actions: Action[],
    onUpdate: (updatedCharacter: Character) => void,
    actionUpdate: (actionsUpdated: Action[]) => void
  ) => void;
}

const skills = [
  { name: "acrobatics", attr: "dexterity" },
  { name: "animal_handling", attr: "wisdom" },
  { name: "arcana", attr: "intelligence" },
  { name: "athletics", attr: "strength" },
  { name: "deception", attr: "charisma" },
  { name: "history", attr: "intelligence" },
  { name: "insight", attr: "wisdom" },
  { name: "intimidation", attr: "charisma" },
  { name: "investigation", attr: "intelligence" },
  { name: "medicine", attr: "wisdom" },
  { name: "nature", attr: "intelligence" },
  { name: "perception", attr: "wisdom" },
  { name: "performance", attr: "charisma" },
  { name: "persuasion", attr: "charisma" },
  { name: "religion", attr: "intelligence" },
  { name: "sleight_of_hand", attr: "dexterity" },
  { name: "stealth", attr: "dexterity" },
  { name: "survival", attr: "wisdom" },
] as { name: keyof Character; attr: keyof Character }[];

const LevelUpContext = createContext<LevelUpContextType | undefined>(undefined);

export const LevelUpProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient();
  const [character, setCharacter] = useState<Character | null>(null);
  const [onUpdate, setOnUpdate] = useState<((updatedCharacter: Character) => void) | null>(null);
  const [onUpdate2, setOnUpdate2] = useState<((updatedActions: Action[]) => void) | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [healthBoost, setHealthBoost] = useState(0);
  const [defTotal, setDefTotal] = useState(0);
  const [defmax, setDefmax] = useState(0);
  const [prevChar, setPrevChar] = useState<Character | null>(null);
  const [spells, setSpells] = useState<Spell[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [selectedSpells, setSelectedSpells] = useState<string[]>([]);
  const [cantripNumber, setCantripNumber] = useState<number>(0);
  const [spellNumber, setSpellNumber] = useState<number>(0);

  const openLevelUp = (
    char: Character,
    spells: Spell[],
    actions: Action[],
    updateFunc: (updatedCharacter: Character) => void,
    updateActions: (updatedActions: Action[]) => void
  ) => {
    setCharacter(char);
    const nextLevel = char.level + 1;
    const currentCantrips = cantripSlotTable[char.class]?.[char.level] || 0;
    const nextCantrips = cantripSlotTable[char.class]?.[nextLevel] || 0;
    setCantripNumber(nextCantrips - currentCantrips);
    setSpellNumber(spellSlotTable[char.class]?.[char.level].reduce((acc, num) => acc + num, 0));
    setSpells(spells);
    setActions(actions);
    setPrevChar(char);
    setSelectedSpells([]);
    setOnUpdate(() => updateFunc);
    setOnUpdate2(() => updateActions);
    setSelectedSkills([]);
    setActiveTab(0);
    setHealthBoost(0);
    setDefTotal(0);
    setDefmax(((char.level + 1) % 4 === 0) ? 2 : 0);
  };

  useEffect(() => {
    if (character != null && character != undefined) setHealthBoost(Math.floor(Math.random() * getHitDie(character?.class as string)) + 1);
  }, [character]);

  useEffect(() => {
    console.log(selectedSpells.length , "/", cantripNumber + spellNumber);
  },[selectedSpells,cantripNumber,spellNumber])

  const handleChange = (key: keyof Character, value: number) => {
    if (!character) return;
    const currentVal = character[key] as number;
    const pointChange = value - currentVal;
    if (defTotal === 0 && value < currentVal) return;
    if (value >= 1 && value <= 20 && Math.abs(defTotal + pointChange) <= defmax) {
      setCharacter({ ...character, [key]: value });
      setDefTotal(defTotal + pointChange);
    }
  };

  const calculateSkillValue = (skill: keyof Character, attr: keyof Character) => {
    const abilityMod = 0 /*Math.floor((Number(character?.[attr]) - 10) / 2)*/;
    const isSelected = selectedSkills.includes(skill);
    const bonus = isSelected ? 3 : 0;
    return abilityMod + Number(character?.[skill]) + bonus;
  };

  const updatedSkills = skills.reduce((acc, { name, attr }) => {
    acc[name] = calculateSkillValue(name, attr);
    return acc;
  }, {} as Record<keyof Character, number>);

  const handleLevelUp = async () => {
    if (!character || !onUpdate) return;

    const newLevel = character.level + 1;
    const newHp = character.hpmax + healthBoost;
    const proficiencyBonus = getProficiencyBonus(newLevel);
    const skillUpdates = Object.fromEntries(Object.entries(updatedSkills).filter(([key]) => skills.some((skill) => skill.name === key)));
    const updatedCharacter: Character = {
      ...character,
      level: newLevel,
      hpmax: newHp,
      hpnow: newHp,
      proficiency: proficiencyBonus,
      ...skillUpdates,
    };
    const character_id = character.character_id;
    const { data: insertData, error: insertError } = await supabase
      .from("actions")
      .insert(selectedSpells.map((spell_id) => ({ character_id, spell_id })))
      .select();
    const { error: charError } = await supabase.from("characters").update(updatedCharacter).eq("character_id", character.character_id);

    if (charError || insertError || !insertData) console.error(charError, insertError);
    onUpdate(updatedCharacter);
    setCharacter(null);
    if (Array.isArray(insertData)) setActions((prev) => [...prev, ...insertData]);
  };

  useEffect(() => {
    if (actions !== null && onUpdate2) {
      onUpdate2(actions);
    }
  }, [actions, onUpdate2]);

  const getHitDie = (charClass: string): number => {
    switch (charClass.toLowerCase()) {
      case "barbarian":
        return 12;
      case "fighter":
      case "paladin":
      case "ranger":
        return 10;
      case "bard":
      case "cleric":
      case "druid":
      case "monk":
      case "rogue":
      case "warlock":
        return 8;
      case "sorcerer":
      case "wizard":
        return 6;
      default:
        return 8;
    }
  };

  const getProficiencyBonus = (level: number): number => {
    if (level >= 17) return 6;
    if (level >= 13) return 5;
    if (level >= 9) return 4;
    if (level >= 5) return 3;
    return 2;
  };

  const getTotalSpellSlots = (className: string, level: number): number => {
    const spellSlots = spellSlotTable[className];
    if (!spellSlots) return 0;
    let total = 0;
    for (let i = 1; i <= level; i++) if (spellSlots[i]) total += spellSlots[i].reduce((sum, num) => sum + num, 0);
    return total;
  };

  const tabs = [
    {
      id: "basic-info",
      label: "Origin",
      content: character && (
        <div className="space-y-4">
          <div className="text-4xl">
            <label className="font-extrabold"></label>Character: <span className="text-2xl font-medium">{character.name}</span>
          </div>
          <div className="text-3xl">
            <label className="font-extrabold"></label>New Level:{" "}
            <span className="text-2xl font-medium">
              {character.level} {">"} {character.level + 1}
            </span>
          </div>
          <div className="text-2xl">
            <label className="font-extrabold"></label>Max HP:{" "}
            <span className="text-2xl font-medium">
              {character.hpmax} {">"} {character.hpmax + healthBoost}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "attributes",
      label: "Attributes",
      content: (
        <div className="p-4 bg-gray-900 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Attributes</h2>
          <div>
            <div className="grid grid-cols-2 gap-4">
              {(["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"] as (keyof Character)[]).map((attr) => (
                <div key={attr} className="space-y-2">
                  <label className="block text-sm font-medium">{attr.toUpperCase()}</label>
                  <input
                    type="number"
                    min={prevChar?.[attr]}
                    max="20"
                    value={character?.[attr] ?? ""}
                    onChange={(e) => {
                      const newValue = Number(e.target.value);
                      if (!character) return;
                      if (defTotal === 0 && newValue < (character[attr] as number)) return;
                      if (newValue >= 1 && newValue <= 20 && Math.abs(defTotal + (newValue - (character[attr] as number))) <= defmax) handleChange(attr, newValue);
                    }}
                    className="bg-gray-700 text-white p-2 w-full rounded outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={defTotal === 0 && (character?.[attr] as number) >= 20}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown" && (character?.[attr] === 1 || character?.[attr] === prevChar?.[attr])) e.preventDefault();
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-sm">
                Total Points Used: {defTotal} / {defmax}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "skills",
      label: "Skills",
      content: (
        <div className="h-[calc(100svh-12rem)] overflow-hidden">
          <h2 className="text-xl font-bold mb-2 text-center">Select 2 Skills</h2>
          <div className="h-[calc(100svh-14rem)]  overflow-y-auto pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              {skills.map(({ name }) => (
                <div
                  key={name}
                  onClick={() => setSelectedSkills((prev) => (prev.includes(name) ? prev.filter((s) => s !== name) : prev.length < 2 ? [...prev, name] : prev))}
                  className={`p-2 sm:p-4 rounded-lg cursor-pointer text-center sm:text-left ${
                    selectedSkills.includes(name) ? `bg-blue-600 text-white` : "bg-gray-700 text-white"
                  } ${!selectedSkills.includes(name) && selectedSkills.length >= 2 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500"}`}>
                  {name.replace(/_/g, " ").toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "spells",
      label: "Spells",
      content: (
        <div className="overflow-hidden">
          <h2 className="text-xl font-bold mb-2 text-center">Select a Spell</h2>
          <div className="h-[calc(100svh-12rem)] overflow-y-auto pt-2">
            <SpellSelection character={character as Character} spells={spells} actions={actions} selectedSpells={selectedSpells} setSelectedSpells={setSelectedSpells} maxSpells={spellNumber} />
          </div>
        </div>
      ),
    },
    {
      id: "cantrips",
      label: "Cantrips",
      content: (
        <div className="overflow-hidden">
          <h2 className="text-xl font-bold mb-2 text-center">Select a Spell</h2>
          <div className="h-[calc(100svh-12rem)] overflow-y-auto pt-2">
            <CantripSelection
              maxCantrips={cantripNumber}
              character={character as Character}
              spells={spells}
              actions={actions}
              selectedSpells={selectedSpells}
              setSelectedSpells={setSelectedSpells}
            />
          </div>
        </div>
      ),
    },
  ];



  return (
    <LevelUpContext.Provider value={{ openLevelUp }}>
      {children}
      {character && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 pt-6 rounded-lg w-full h-full">
            <h2 className="mb-7"></h2>
            <div className="md:flex">
              <div className="w-56 grid-cols-1 p-4 flex md:block">
                <button
                  onClick={() => setActiveTab(0)}
                  className={`py-2 text-lg font-semibold w-full ${activeTab === 0 ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-400"}`}>
                  {tabs[0].label}
                </button>

                {(character.level + 1) % 4 === 0 && (
                  <button
                    onClick={() => setActiveTab(1)}
                    className={`py-2 text-lg font-semibold w-full ${activeTab === 1 ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-400"}`}>
                    {tabs[1].label}
                  </button>
                )}

                {character.level + 1 === 5 &&  (
                  <button
                    onClick={() => setActiveTab(2)}
                    className={`py-2 text-lg font-semibold w-full ${activeTab === 2 ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-400"}`}>
                    {tabs[2].label}
                  </button>
                )}

                {spellNumber !== 0 && (
                  <button
                  id="sandijan"
                    onClick={() => setActiveTab(3)}
                    className={`py-2 text-lg font-semibold w-full ${activeTab === 3 ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-400"}`}>
                    {tabs[3].label}
                  </button>
                )}

                {(cantripSlotTable[character.class]?.[character.level + 1] || 0) !== 0 && (
                  <button
                    onClick={() => setActiveTab(4)}
                    className={`py-2 text-lg font-semibold w-full ${activeTab === 4 ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-400"}`}>
                    {tabs[4].label}
                  </button>
                )}
              </div>
              <div className="flex-1 md:pt-8 overflow-none mr-4 ml-4 md:ml-0">{tabs[activeTab].content}</div>
            </div>
            <div className="absolute right-0 bottom-0">
              <div className="p-4 flex gap-4 w-[100svw] md:w-fit">
                <button onClick={() => setCharacter(null)} className="flex-1 md:flex-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Close
                </button>
                <button
                  onClick={handleLevelUp}
                  disabled={(((character.level + 1) % 4 === 0) && defTotal !== defmax) || (selectedSkills.length < 2 && character.level + 1 === 5) || (selectedSpells.length < (spellNumber + cantripNumber))}
                  
                  className={`flex-1 md:flex-auto px-4 py-2 text-white rounded-lg ${
                    (((character.level + 1) % 4 === 0) && defTotal !== defmax) || (selectedSkills.length < 2 && character.level + 1 === 5) || (selectedSpells.length < (spellNumber + cantripNumber))
                      ? "bg-gray-600"
                      : "bg-green-600 hover:bg-green-700"
                  }`}>
                  Level Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </LevelUpContext.Provider>
  );
};

export const useLevelUp = () => {
  const context = useContext(LevelUpContext);
  if (!context) throw new Error("useLevelUp must be used within a LevelUpProvider");
  return context;
};