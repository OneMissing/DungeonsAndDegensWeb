"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLevelUpPoints, Classes, Character, updateCharacter } from "@/lib/character/types";
import { createClient } from "@/lib/supabase/client";

const LevelUpPage = () => {
    const supabase = createClient();
    const { id } = useParams();
    const router = useRouter();
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [allocatedPoints, setAllocatedPoints] = useState({
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
    });
    const [availablePoints, setAvailablePoints] = useState(2);

    useEffect(() => {
        const fetchCharacter = async () => {
            setLoading(true);
            setError(null);

            try {
                const { data, error } = await supabase
                    .from("characters")
                    .select("*")
                    .eq("id", id)
                    .single();
                if (error) throw new Error(error.message);

                setCharacter(data);

                const characterClass = data.class as Classes;
                const characterLevel = data.level ?? 1;
                const pointsPerLevel = getLevelUpPoints(characterClass, characterLevel);

                setAvailablePoints(pointsPerLevel);

                setAllocatedPoints({
                    strength: data.strength,
                    dexterity: data.dexterity,
                    constitution: data.constitution,
                    intelligence: data.intelligence,
                    wisdom: data.wisdom,
                    charisma: data.charisma,
                });
            } catch (err) {
                setError((err as Error).message || "Failed to fetch character.");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchCharacter();
    }, [id, supabase]);

    const handleAllocatePoint = (stat: keyof typeof allocatedPoints) => {
        if (availablePoints > 0) {
            setAllocatedPoints((prev) => ({
                ...prev,
                [stat]: prev[stat] + 1,
            }));
            setAvailablePoints((prev) => prev - 1);
        }
    };

    const handleDeallocatePoint = (stat: keyof typeof allocatedPoints) => {
        if (allocatedPoints[stat] > 0) {
            setAllocatedPoints((prev) => ({
                ...prev,
                [stat]: prev[stat] - 1,
            }));
            setAvailablePoints((prev) => prev + 1);
        }
    };

    const handleConfirmLevelUp = async () => {
        if (!character) return;

        const updatedCharacter = {
            ...character,
            level: character.level + 1,
            ...allocatedPoints,
        };

        try {
            await updateCharacter(character.id, updatedCharacter, supabase);
            setCharacter(updatedCharacter);
            setAvailablePoints(0);
            router.replace(`/home/player-characters/${id}`);
        } catch (error) {
            alert("Failed to update character.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!character) return <p>No character found.</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-4">Level Up: {character?.name}</h1>
            <p className="text-center text-lg mb-4">Current Level: {character?.level}</p>
            <p className="text-center text-lg mb-4">Available Points: {availablePoints}</p>
            <div className="grid grid-cols-2 gap-4">
                {Object.entries(allocatedPoints).map(([stat, value]) => {
                    const statKey = stat as keyof typeof allocatedPoints;
                    return (
                        <div key={stat} className="flex justify-between items-center">
                            <span className="capitalize">{stat}</span>
                            <div className="flex items-center">
                                <button
                                    onClick={() => handleDeallocatePoint(statKey)}
                                    className="px-2 py-1 bg-red-500 text-white rounded-l"
                                    disabled={value === 0}
                                >
                                    -
                                </button>
                                <span className="px-4 py-1 bg-gray-700">
                                    {character ? character[statKey] + value : 0}
                                </span>
                                <button
                                    onClick={() => handleAllocatePoint(statKey)}
                                    className="px-2 py-1 bg-green-500 text-white rounded-r"
                                    disabled={availablePoints === 0}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <button
                onClick={handleConfirmLevelUp}
                className="w-1/2 mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={availablePoints > 0}
            >
                Confirm Level Up
            </button>
            <button
                className="w-1/2 mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                onClick={() => router.replace(`/home/player-characters/${id}`)}
            >
                Cancel
            </button>
        </div>
    );
};

export default LevelUpPage;
