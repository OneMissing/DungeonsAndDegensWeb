"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
    Character,
    CharacterStat,
    Classes,
    Races,
    CharacterAttribute,
} from "@/lib/tools/types";
import { updateCharacter } from "@/lib/tools/updateCharacter"


interface CharacterInfoProps {
    characterId: string;
    className: string;
}

const CharacterInfo = ({ characterId, className }: CharacterInfoProps) => {
    const router = useRouter();
    const supabase = createClient();
    const [character, setCharacter] = useState<Character | null>(null);
    const [attributes, setAttributes] = useState<CharacterAttribute | null>(
        null
    );
    const [stats, setStats] = useState<CharacterStat | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [fieldValue, setFieldValue] = useState<string>("");
    const [isInvalid, setIsInvalid] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [{ data: charData, error: charError }, { data: attrData, error: attrError }, { data: statsData, error: statsError }] = await Promise.all([
                    supabase.from("characters").select("*").eq("id", characterId).single(),
                    supabase.from("character_attrib").select("*").eq("character_id", characterId).single(),
                    supabase.from("character_stats").select("*").eq("character_id", characterId).single(),
                ]);
    
                if (charError || attrError || statsError) {
                    setError("Error loading character data.");
                    console.error("Errors:", charError, attrError, statsError);
                    return;
                }
    
                setCharacter(charData);
                setAttributes(attrData);
                setStats(statsData);
            } catch (err) {
                setError("Unexpected error fetching data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [characterId]);
    

    if (!character || !attributes || !stats) return <p>Loading...</p>;

    const handleDoubleClick = (
        field: keyof Character | keyof CharacterAttribute | keyof CharacterStat
    ) => {
        if (!character || !attributes) return;
        if (field in character) {
            setFieldValue(
                character[field as keyof Character]?.toString() ?? ""
            );
        } else if (field in attributes) {
            setFieldValue(
                attributes[field as keyof CharacterAttribute]?.toString() ?? ""
            );
        }
        setEditingField(field);
        setIsInvalid(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldValue(e.target.value);
    };

    const handleBlur = async () => {
        if (!editingField) return;
    
        let updatedValue: any = fieldValue;
        if (!isNaN(Number(fieldValue))) {
            updatedValue = Number(fieldValue);
        }
    
        if (editingField in character!) {
            setCharacter((prev) =>
                prev ? { ...prev, [editingField]: updatedValue } : prev
            );
            await updateCharacter(character!.id, {
                [editingField]: updatedValue,
            });
        } else if (editingField in attributes!) {
            setAttributes((prev) =>
                prev ? { ...prev, [editingField]: updatedValue } : prev
            );
            await supabase
                .from("character_attrib")
                .update({ [editingField]: updatedValue })
                .eq("character_id", characterId);
        } else if (editingField in stats!) {
            setStats((prev) =>
                prev ? { ...prev, [editingField]: updatedValue } : prev
            );
            await supabase
                .from("character_stats")
                .update({ [editingField]: updatedValue })
                .eq("character_id", characterId);
        }
    
        setEditingField(null);
    };
    

    if (loading)
        return (
            <p className='text-center text-gray-500'>Loading character...</p>
        );
    if (error) return <p className='text-center text-red-500'>{error}</p>;
    if (!character)
        return (
            <p className='text-center text-gray-500'>Character not found.</p>
        );

    if (loading)
        return (
            <p className='text-center text-gray-500'>Loading character...</p>
        );
    if (error) return <p className='text-center text-red-500'>{error}</p>;
    if (!character)
        return (
            <p className='text-center text-gray-500'>Character not found.</p>
        );

    const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (
            !/^\d$/.test(e.key) &&
            e.key !== "Backspace" &&
            e.key !== "ArrowLeft" &&
            e.key !== "ArrowRight" &&
            e.key !== "Tab"
        ) {
            e.preventDefault();
        }
    };

    return (
        <section className={className}>
            <h2
                className='text-4xl font-bold text-center'
                onDoubleClick={() => handleDoubleClick("name")}
            >
                {editingField === "name" ? (
                    <input
                        type='text'
                        value={fieldValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full text-center ${
                            isInvalid ? "border-red-500" : ""
                        }`}
                        autoFocus
                    />
                ) : (
                    character.name
                )}
            </h2>
            <div className='text-lg text-center'>
                <span
                    onDoubleClick={() => handleDoubleClick("race")}
                    className='inline-block w-20 text-center'
                >
                    {editingField === "race" ? (
                        <div>
                            <input
                                type='text'
                                value={fieldValue}
                                onChange={handleChange}
                                list='race-options'
                                onBlur={handleBlur}
                                className={`w-full text-center ${
                                    isInvalid ? "border-red-500" : ""
                                }`}
                                autoFocus
                            />
                            <datalist id='race-options'>
                                {Object.values(Races).map((raceOption) => (
                                    <option
                                        key={raceOption}
                                        value={raceOption}
                                    />
                                ))}
                            </datalist>
                        </div>
                    ) : (
                        character.race
                    )}
                </span>
                {" - "}
                <span
                    onDoubleClick={() => handleDoubleClick("class")}
                    className='inline-block w-20 text-center'
                >
                    {editingField === "class" ? (
                        <div>
                            <input
                                type='text'
                                value={fieldValue}
                                onChange={handleChange}
                                list='class-options'
                                onBlur={handleBlur}
                                className={`w-full text-center ${
                                    isInvalid ? "border-red-500" : ""
                                }`}
                                autoFocus
                            />
                            <datalist id='class-options'>
                                {Object.values(Classes).map((classOption) => (
                                    <option
                                        key={classOption}
                                        value={classOption}
                                    />
                                ))}
                            </datalist>
                        </div>
                    ) : (
                        character.class
                    )}
                </span>
                {" (Level "}
                {stats.level}
                {")"}
            </div>
            <div className='text-center'>
                <p>
                    HP:
                    <span
                        onDoubleClick={() => handleDoubleClick("hpnow")}
                        className='inline-block w-12 text-center'
                    >
                        {editingField === "hpnow" ? (
                            <input
                                type='text'
                                pattern='[0-9]*'
                                value={fieldValue}
                                onChange={handleChange}
                                onKeyDown={handleNumberKeyDown}
                                onBlur={handleBlur}
                                className='w-full text-center appearance-none'
                                autoFocus
                            />
                        ) : (
                            stats.hpnow
                        )}
                    </span>{" "}
                    /
                    <span
                        onDoubleClick={() => handleDoubleClick("hpmax")}
                        className='inline-block w-12 text-center appearance-none'
                    >
                        {editingField === "hpmax" ? (
                            <input
                                type='text'
                                pattern='[0-9]*'
                                value={fieldValue}
                                onChange={handleChange}
                                onKeyDown={handleNumberKeyDown}
                                onBlur={handleBlur}
                                className='w-full text-center appearance-none'
                                autoFocus
                            />
                        ) : (
                            stats.hpmax
                        )}
                    </span>{" "}
                    +
                    <span
                        onDoubleClick={() => handleDoubleClick("hptmp")}
                        className='inline-block w-12 text-center appearance-none'
                    >
                        {editingField === "hptmp" ? (
                            <input
                                type='text'
                                pattern='[0-9]*'
                                value={fieldValue}
                                onChange={handleChange}
                                onKeyDown={handleNumberKeyDown}
                                onBlur={handleBlur}
                                className='w-full text-center appearance-none'
                                autoFocus
                            />
                        ) : (
                            stats.hptmp
                        )}
                    </span>
                </p>
                <p>
                    AC:{" "}
                    <span
                        onDoubleClick={() => handleDoubleClick("ac")}
                        className='inline-block w-12 text-center'
                    >
                        {editingField === "ac" ? (
                            <input
                                type='text'
                                pattern='[0-9]*'
                                value={fieldValue}
                                onChange={handleChange}
                                onKeyDown={handleNumberKeyDown}
                                onBlur={handleBlur}
                                className='w-full text-center appearance-none'
                                autoFocus
                            />
                        ) : (
                            stats.ac
                        )}
                    </span>
                </p>
            </div>
            <h3 className='text-2xl font-semibold'>Attributes</h3>
            <ul className='grid grid-cols-2 gap-4 text-gray-700'>
                {attributes &&
                    (
                        [
                            "strength",
                            "dexterity",
                            "constitution",
                            "intelligence",
                            "wisdom",
                            "charisma",
                        ] as (keyof CharacterAttribute)[]
                    ).map((attr) => (
                        <li
                            key={attr}
                            onDoubleClick={() => handleDoubleClick(attr)}
                        >
                            <strong>{attr.toUpperCase().slice(0, 3)}:</strong>{" "}
                            {editingField === attr ? (
                                <input
                                    type='text'
                                    pattern='[0-9]*'
                                    value={fieldValue}
                                    onChange={handleChange}
                                    onKeyDown={handleNumberKeyDown}
                                    onBlur={handleBlur}
                                    className='w-8 appearance-none'
                                    autoFocus
                                />
                            ) : (
                                attributes[attr] ?? "N/A"
                            )}
                        </li>
                    ))}
            </ul>
        </section>
    );
};

export default CharacterInfo;
