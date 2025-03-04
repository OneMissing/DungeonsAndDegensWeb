"use client";

import { useState } from "react";
import { Character } from "@/lib/tools/types";
import { createClient } from "@/lib/supabase/client";

type CharData = Omit<Character, "character_id" | "created_at">;

const CharacterCreator = () => {
    const supabase = createClient();
    const [state, setState] = useState<"ok" | "loading" | "error">();
    const [activeTab, setActiveTab] = useState(0);
    const [charData, setCharData] = useState<CharData>({
        user_id: "",
        player_id: "",
        name: "",
        race: "",
        class:   "", 
        background: "",
        alignment: "",
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
        level: 1,
        hpmax: 10,
        hpnow: 10,
        hptmp: 0,
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
        spell_slot_1: 0,
        spell_slot_2: 0,
        spell_slot_3: 0,
        spell_slot_4: 0,
        spell_slot_5: 0,
        spell_slot_6: 0,
        spell_slot_7: 0,
        spell_slot_8: 0,
        spell_slot_9: 0,
    });

    const handleChange = (field: keyof CharData, value: string | number | string[]) => {
        setCharData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const createCharacter = async () => {
        setState("loading");

        try {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData?.user) {
                console.error("Error fetching user:", userError);
                setState("error");
                return;
            }

            const userId = userData.user.id;
            const newCharacter = { ...charData, user_id: userId};

            const { error } = await supabase.from("characters").insert([newCharacter]);

            if (error) {
                console.error("Error creating character:", error);
                setState("error");
                return;
            }

            setState("ok");
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
                    />
                    <button
                        onClick={createCharacter}
                        disabled={state === "loading"}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-500"
                    >
                        {state === "loading" ? "Creating..." : "Create Character"}
                    </button>
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
                                    onChange={(e) => handleChange(attr, Number(e.target.value))}
                                    className="bg-gray-700 text-white p-2 w-full rounded"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            id: "skills",
            label: "Skills",
            content: (
                <div className="p-4 bg-gray-900 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Skills</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {([
                            "acrobatics",
                            "animal_handling",
                            "arcana",
                            "athletics",
                            "deception",
                            "history",
                            "insight",
                            "intimidation",
                            "investigation",
                            "medicine",
                            "nature",
                            "perception",
                            "performance",
                            "persuasion",
                            "religion",
                            "sleight_of_hand",
                            "stealth",
                            "survival",
                        ] as (keyof CharData)[]).map((skill) => (
                            <div key={skill} className="space-y-2">
                                <label className="block text-sm font-medium">{skill.replace(/_/g, " ").toUpperCase()}</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={charData[skill]}
                                    onChange={(e) => handleChange(skill, Number(e.target.value))}
                                    className="bg-gray-700 text-white p-2 w-full rounded"
                                />
                            </div>
                        ))}
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
                        className={`px-4 py-2 text-lg font-semibold w-full ${
                            activeTab === index ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-400"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="w-full h-full p-4">{tabs[activeTab].content}</div>
        </div>
    );
};

export default CharacterCreator;