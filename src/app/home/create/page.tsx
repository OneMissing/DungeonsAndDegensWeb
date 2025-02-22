"use client";

import { useState } from "react";
import {
    Character,
    Races,
    Classes,
    CharacterAttribute,
    CharacterSkill,
} from "@/lib/tools/types";
import { createClient } from "@/lib/supabase/client";

const CharacterCreator = () => {
    const supabase = createClient();
    const [state, setState] = useState<"ok" | "loading" | "error">();
    const [activeTab, setActiveTab] = useState(0);
    const [charName, setCharName] = useState<string>("");
    const [charRace, setCharRace] = useState<Races>(Races.Human);
    const [charClass, setCharClass] = useState<Classes>(Classes.Wizard);
    const [charAtrib, setCharAtrib] = useState<CharacterAttribute>({
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
    });
    const [charSkill, setCharSkill] = useState<CharacterSkill>({
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

    const handleSkillChange = (skill: keyof CharacterSkill, value: number) => {
        setCharSkill((prev) => ({
            ...prev,
            [skill]: value,
        }));
    };

    const handleAtribChange = (atrib: keyof CharacterAttribute, value: number) => {
        setCharAtrib((prev) => ({
            ...prev,
            [atrib]: value,
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

            const playerId = userData.user.id;

            if (!charName.trim()) {
                console.error("Character name is required");
                setState("error");
                return;
            }

            const isValidAttributes = Object.values(charAtrib).every(
                (value) => value >= 0 && value <= 20
            );
            if (!isValidAttributes) {
                console.error("Attributes must be between 0 and 20");
                setState("error");
                return;
            }

            const { data: charData, error: charError } = await supabase
                .from("characters")
                .insert([
                    {
                        player_id: playerId,
                        name: charName,
                        race: charRace,
                        class: charClass,
                    },
                ])
                .select("id")
                .single();

            if (charError) {
                console.error("Error creating character:", charError);
                setState("error");
                return;
            }

            const characterId = charData.id;

            const { error: attribError } = await supabase
                .from("character_attrib")
                .insert([{ character_id: characterId, ...charAtrib }]);

            if (attribError) {
                console.error("Error inserting attributes:", attribError);
                setState("error");
                return;
            }

            const { error: skillError } = await supabase
                .from("character_skills")
                .insert([{ character_id: characterId, ...charSkill }]);

            if (skillError) {
                console.error("Error inserting skills:", skillError);
                setState("error");
                return;
            }

            const { error: statsError } = await supabase
                .from("character_stats")
                .insert([{character_id: characterId, level: 1, hpnow: 10, hpmax: 10, hptmp: 0, ac: 8 }]);

            if (statsError) {
                console.error("Error inserting skills:", statsError);
                setState("error");
                return;
            }

            console.log("Character created successfully:", characterId);
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
                        value={charName}
                        onChange={(e) => setCharName(e.target.value)}
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
                    {state === "ok" && (
                        <p className="text-green-500">Character created successfully!</p>
                    )}
                    {state === "error" && (
                        <p className="text-red-500">Error creating character. Please try again.</p>
                    )}
                </div>
            ),
        },
        {
            id: "race-selection",
            label: "Race Selection",
            content: (
                <div className="p-4 bg-gray-900 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Race</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {Object.values(Races).map((race) => (
                            <button
                                key={race}
                                className={`p-4 rounded-lg border ${
                                    charRace === race
                                        ? "border-yellow-500"
                                        : "border-gray-500"
                                } hover:border-yellow-400 transition`}
                                onClick={() => setCharRace(race)}
                            >
                                {race}
                            </button>
                        ))}
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
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(charAtrib).map(([atrib, value]) => (
                            <div key={atrib} className="space-y-2">
                                <label className="block text-sm font-medium">
                                    {atrib.toUpperCase()}
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="20"
                                    value={value}
                                    onChange={(e) =>
                                        handleAtribChange(
                                            atrib as keyof CharacterAttribute,
                                            Number(e.target.value)
                                        )
                                    }
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
                        {Object.entries(charSkill).map(([skill, value]) => (
                            <div key={skill} className="space-y-2">
                                <label className="block text-sm font-medium">
                                    {skill.replace(/_/g, " ").toUpperCase()}
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={value}
                                    onChange={(e) =>
                                        handleSkillChange(
                                            skill as keyof CharacterSkill,
                                            Number(e.target.value)
                                        )
                                    }
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
                            activeTab === index
                                ? "text-yellow-400 border-b-2 border-yellow-400"
                                : "text-gray-400"
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