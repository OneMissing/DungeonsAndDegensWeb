"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
    Character,
    Classes,
    Races,
    updateCharacter,
} from "@/lib/character/types";

interface CharacterInfoProps {
    characterId: string;
    className: string;
}

const CharacterInfo = ({ characterId, className }: CharacterInfoProps) => {
    const router = useRouter();
    const supabase = createClient();
    const data = supabase.auth.getUser();
    if (!data) {
        router.push("/login");
    }
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [fieldValue, setFieldValue] = useState<string>("");
    const [isInvalid, setIsInvalid] = useState(false);

    useEffect(() => {
        if (!characterId) return;

        const fetchCharacter = async () => {
            try {
                setLoading(true);

                const { data: characterData, error: characterError } =
                    await supabase
                        .from("characters")
                        .select("*")
                        .eq("id", characterId)
                        .single();

                if (characterError) throw new Error("Character not found.");

                setCharacter({ ...characterData });
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCharacter();
    }, [characterId]);

    useEffect(() => {
        if (!characterId) return;

        const fetchCharacter = async () => {
            try {
                setLoading(true);

                const { data: characterData, error: characterError } =
                    await supabase
                        .from("characters")
                        .select("*")
                        .eq("id", characterId)
                        .single();

                if (characterError) throw new Error("Character not found.");

                setCharacter({ ...characterData });
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCharacter();
    }, [characterId]);

    const handleDoubleClick = (field: keyof Character) => {
        setEditingField(field);
        setFieldValue(character ? character[field].toString() : "");
        setIsInvalid(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldValue(e.target.value);
    };

    const handleBlur = async () => {
      if (character && editingField) {
          let updatedValue: any = fieldValue;
          
          if (editingField === "class" && !(Object.values(Classes).includes(fieldValue as Classes))) {
              setIsInvalid(true);
              return;
          }
          
          if (editingField === "race" && !(Object.values(Races).includes(fieldValue as Races))) {
              setIsInvalid(true);
              return;
          }

          if (!isNaN(Number(fieldValue))) {
              updatedValue = Number(fieldValue);
          }

          const updatedData = {
              [editingField]: updatedValue,
          };

          setCharacter((prev) => (prev ? { ...prev, ...updatedData } : prev));
          setEditingField(null);
          await updateCharacter(character.id, updatedData, supabase);
      }
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
                                {Object.values(Races).map(
                                    (raceOption) => (
                                        <option
                                            key={raceOption}
                                            value={raceOption}
                                        />
                                    )
                                )}
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
                {character.level}
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
                            character.hpnow
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
                            character.hpmax
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
                            character.hptmp
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
                            character.ac
                        )}
                    </span>
                </p>
            </div>
            <h3 className='text-2xl font-semibold'>Attributes</h3>
            <ul className='grid grid-cols-2 gap-4 text-gray-700'>
                {(
                    [
                        "strength",
                        "dexterity",
                        "constitution",
                        "intelligence",
                        "wisdom",
                        "charisma",
                    ] as (keyof Character)[]
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
                            character[attr]
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default CharacterInfo;
