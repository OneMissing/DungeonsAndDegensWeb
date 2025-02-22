"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import CopyToClipboard from "@/components/character/changes/clipboard";
import Remove from "./changes/remove";
import Delete from "./changes/delete";
import Link from "next/link";
import { fetchDmCharacters, fetchPlayerCharacters } from "@/lib/tools/fetchTables";
import { Character } from "@/lib/tools/types";

const CharacterList = ({
    userId,
    dm,
}: {
    userId: string | null;
    dm: boolean;
}) => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        async function loadCharacters() {
            try {
                setLoading(true);
                const data = dm ? await fetchDmCharacters() : await fetchPlayerCharacters() ;
                setCharacters(data? data : []);
                
            } catch (error) {
                console.error("Error loading characters:", error);
                setCharacters([]);
            } finally {
                setLoading(false);
            }
        }
        if (userId) {
            loadCharacters();
        }
    }, [dm, userId]);

    if (loading)
        return (
            <p className='text-center text-gray-500'>Loading characters...</p>
        );
    if (dm)
        return (
            <div className='p-4 w-1/2'>
                <h2 className='text-2xl font-bold mb-4 text-center'>
                    DM Characters
                </h2>
                <ul className='space-y-3'>
                    {characters.map((char) => (
                        <li
                            key={char.id}
                            className='border p-3 rounded-lg shadow-md bg-white cursor-pointer hover:bg-gray-100 transition'
                            onClick={() =>
                                router.push(`/home/dm-characters/${char.id}`)
                            }
                        >
                            <div className='grid grid-cols-3'>
                                <div className='flex space-x-2'>
                                    <CopyToClipboard text={char.id} />
                                    <Remove text={char.id} />
                                </div>
                                <div className='col-span-2'>
                                    <div className='text-right md:text-center w-full md:w-1/2 mt-1'>
                                        <span>{char.name}</span>
                                    </div>
                                </div>
                            </div>

                            <p className='text-gray-600'>
                                {char.race} - {char.class}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    else
        return (
            <div className='p-4 w-1/2'>
                <h2 className='text-2xl font-bold mb-4 text-center'>
                    Player Characters
                </h2>
                <ul className='space-y-3'>
                    {characters.length !== 0 ? (
                        characters.map((char) => (
                            <li
                                key={char.id}
                                className='border p-3 rounded-lg shadow-md bg-white cursor-pointer hover:bg-gray-100 transition'
                                onClick={() =>
                                    router.push(
                                        `/home/player-characters/${char.id}`
                                    )
                                }
                            >
                                <div
                                    className='grid grid-cols-3'
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <div className='flex space-x-2'>
                                        <CopyToClipboard text={char.id} />
                                        <Delete charId={char.id} />
                                    </div>
                                    <div className='col-span-2'>
                                        <div className='text-right md:text-center w-full md:w-1/2 mt-1'>
                                            <span>{char.name}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className='text-gray-600'>
                                    {char.race} - {char.class}
                                </p>
                            </li>
                        ))
                    ) : (
                        <Link href={`/home/create`}>Create new character</Link>
                    )}
                </ul>
            </div>
        );
};

export default CharacterList;
