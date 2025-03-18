"use client";

import { useState } from "react";
import { Character, Classes, Races } from "@/lib/tools/types";
import { createClient } from "@/lib/supabase/client";
import { redirect, useRouter } from "next/navigation";

type CharData = Omit<
  Character,
  | "character_id"
  | "created_at"
  | "background"
  | "alignment"
  | "hptmp"
  | "spell_slot_1"
  | "spell_slot_2"
  | "spell_slot_3"
  | "spell_slot_4"
  | "spell_slot_5"
  | "spell_slot_6"
  | "spell_slot_7"
  | "spell_slot_8"
  | "spell_slot_9"
  | "level"
>;

const CharacterCreator = () => {
  const supabase = createClient();
  const router = useRouter();
  const [state, setState] = useState<"ok" | "loading" | "error">();
  const [activeTab, setActiveTab] = useState(0);
  const [charData, setCharData] = useState<CharData>({
    user_id: "",
    player_id: "",
    name: "",
    race: "human",
    class: "barbarian",
    proficiency: 2,
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    hpmax: 10,
    hpnow: 10,
    acrobatics: 0,
    animal_handling: 0,
    arcana: 0,
    athletics: 0,
    deception: 0,
    history: 0,
    insight: 0,
    intimidation: 0,
    investigation: 0,
    medicine: 0,
    nature: 0,
    perception: 0,
    performance: 0,
    persuasion: 0,
    religion: 0,
    sleight_of_hand: 0,
    stealth: 0,
    survival: 0,
  });

  const [selectedSkills, setSelectedSkills] = useState<(keyof CharData)[]>([]);

  const handleChange = (field: keyof CharData, value: string | number | string[]) => {
    setCharData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSkill = (skill: keyof CharData) => {
    setSelectedSkills((prev) => {
      if (prev.includes(skill)) {
        // If skill is already selected, remove it
        return prev.filter((s) => s !== skill);
      } else if (prev.length < 2) {
        // Allow selection if less than 2 are chosen
        return [...prev, skill];
      }
      return prev; // Prevent selecting more than 2
    });
  };

  const validateCharacter = () => {
    // Check if name is provided
    if (!charData.name) {
      alert("Please enter a character name.");
      return false;
    }

    // Check if all attribute points are allocated (total must be 72)
    const attributes = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"] as (keyof CharData)[];
    const totalPoints = attributes.reduce((sum, attr) => sum + (charData[attr] as number), 0);
    if (totalPoints !== 72) {
      alert("Please allocate all 72 attribute points.");
      return false;
    }

    // Check if exactly 2 skills are selected
    if (selectedSkills.length !== 2) {
      alert("Please select exactly 2 skills.");
      return false;
    }

    return true;
  };

  const calculateSkillValue = (skill: keyof CharData, attr: keyof CharData) => {
    const abilityMod = Math.floor((Number(charData[attr]) - 10) / 2);
    const isSelected = selectedSkills.includes(skill);
    const bonus = isSelected ? 3 : 0;
    return abilityMod + Number(charData[skill]) + bonus;
  };

  const createCharacter = async () => {
    if (!validateCharacter()) {
      return;
    }

    setState("loading");
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("Error fetching user:", userError);
        setState("error");
        return;
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
      ] as { name: keyof CharData; attr: keyof CharData }[];

      const updatedSkills = skills.reduce((acc, { name, attr }) => {
        acc[name] = calculateSkillValue(name, attr);
        return acc;
      }, {} as Record<keyof CharData, number>);

      // Create the new character with updated skill values
      const newCharacter = {
        ...charData,
        ...updatedSkills,
        user_id: userData.user.id,
        player_id: userData.user.id,
      };

      const { error } = await supabase.from("characters").insert([newCharacter]);
      if (error) {
        console.error("Error creating character:", error);
        setState("error");
        return;
      }
      setState("ok");
      router.push("/home");
    } catch (err) {
      console.error("Unhandled error:", err);
      setState("error");
    }
  };

  const tabs = [
    {
      id: "basic-info",
      label: "Basic Info",
      content: (
        <div className="space-y-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={charData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="bg-gray-700 text-white p-2 w-full rounded"
            placeholder="Enter character name"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <div className="w-full md:col-span-3">
              <label className="block text-sm font-medium mb-1">Race</label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {Object.entries(Races).map(([key, value]) => (
                  <label
                    key={key}
                    className={`flex items-center justify-center p-2 border rounded-lg cursor-pointer text-sm ${
                      charData.race === value ? "bg-blue-600 text-white border-blue-700" : "bg-gray-700 text-white border-gray-500"
                    }`}>
                    <input type="radio" name="race" value={value} checked={charData.race === value} onChange={() => handleChange("race", value)} className="hidden" required />
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div className="w-full md:col-span-2">
              <label className="block text-sm font-medium mb-1">Class</label>
              <select value={charData.class} onChange={(e) => handleChange("class", e.target.value)} className="bg-gray-700 text-white p-2 w-full rounded" required>
                {Object.entries(Classes).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </option>
                ))}
              </select>
              <div className="flex gap-4 justify-center">
                <button onClick={createCharacter} disabled={state === "loading"} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-500">
                  {state === "loading" ? "Creating..." : "Create Character"}
                </button>
                <button
                  onClick={() => redirect("/home")}
                  disabled={state === "loading"}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-500">
                  Go back
                </button>
              </div>
            </div>
          </div>
          {state === "ok" && <p className="text-green-500">Character created successfully!</p>}
          {state === "error" && <p className="text-red-500">Error creating character. Please try again.</p>}
        </div>
      ),
    },
    {
      id: "attributes",
      label: "Attributes",
      content: (
        <div className="p-4 bg-gray-900 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Attributes</h2>
          <div className="grid grid-cols-2 gap-4">
            {(["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"] as (keyof CharData)[]).map((attr) => (
              <div key={attr} className="space-y-2">
                <label className="block text-sm font-medium">{attr.toUpperCase()}</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={charData[attr]}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    const attributes = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"] as (keyof CharData)[];
                    const currentTotal = attributes.reduce((sum, attr) => sum + (charData[attr] as number), 0);
                    const newTotal = currentTotal - Number(charData[attr]) + newValue;

                    // Check if the new value is within the allowed range and the total points do not exceed 72
                    if (newValue >= 1 && newValue <= 20 && newTotal <= 72) {
                      handleChange(attr, newValue);
                    }
                  }}
                  className="bg-gray-700 text-white p-2 w-full rounded"
                />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-sm">
              Total Points Used:{" "}
              {(["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"] as (keyof CharData)[]).reduce((sum, attr) => sum + (charData[attr] as number), 0)} /
              72
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "skills",
      label: "Skills",
      content: (
        <div className="p-4 bg-gray-900 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Select 2 Skills (+3 Bonus Each)</h2>
          <div className="grid grid-cols-2 gap-4">
            {(
              [
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
              ] as { name: keyof CharData; attr: keyof CharData }[]
            ).map(({ name, attr }) => {
              const skillValue = calculateSkillValue(name, attr);

              return (
                <div
                  key={name}
                  onClick={() => toggleSkill(name)}
                  className={`p-4 rounded-lg cursor-pointer ${
                    selectedSkills.includes(name)
                      ? "bg-blue-600 text-white" // Selected state
                      : "bg-gray-700 text-white" // Default state
                  } ${
                    !selectedSkills.includes(name) && selectedSkills.length >= 2
                      ? "opacity-50 cursor-not-allowed" // Disabled state
                      : "hover:bg-blue-500" // Hover state
                  }`}>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium">{name.replace(/_/g, " ").toUpperCase()}</label>
                    <span className="bg-gray-800 text-white px-3 py-2 rounded">{skillValue >= 0 ? `+${skillValue}` : skillValue}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="h-main overflow-hidden w-full text-white flex">
      <div className="w-56 grid-cols-1 p-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-lg font-semibold w-full ${activeTab === index ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-400"}`}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="w-full h-full p-4">{tabs[activeTab].content}</div>
    </div>
  );
};

export default CharacterCreator;
