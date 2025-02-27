"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CopyToClipboard from "@/components/character/changes/clipboard";
import Remove from "./changes/remove";
import Delete from "./changes/delete";
import Link from "next/link";
import { Character } from "@/lib/tools/types";
import { getDmCharacters, getPlayerCharacters } from "@/lib/fetch/fetch";

const CharacterList = ({
    userId,
    dm,
}: {
    userId: string;
    dm: boolean;
}) => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        async function loadCharacters() {
            try {
                setLoading(true);
                const data = dm ? await getDmCharacters(userId) : await getPlayerCharacters(userId) ;
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
                <ul className='space-y-3' key="master-shit">
                    {characters.map((char) => (
                        <li
                            key={char.character_id}
                            className='border p-3 rounded-lg shadow-md bg-1-light cursor-pointer hover:bg-2-light dark:bg-2-dark dark:hover:bg-3-dark transition'
                            onClick={() =>
                                router.push(`/home/dm-characters/${char.character_id}`)
                            }
                        >
                            <div className='grid grid-cols-3'>
                                <div className='flex space-x-2'>
                                    <CopyToClipboard text={char.character_id} />
                                    <Remove text={char.character_id} />
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
                                key={char.character_id}
                                className='border p-3 rounded-lg shadow-md bg-1-light cursor-pointer hover:bg-2-light dark:bg-2-dark dark:hover:bg-3-dark transition'
                                onClick={() =>
                                    router.push(
                                        `/home/player-characters/${char.character_id}`
                                    )
                                }
                            >
                                <div
                                    className='grid grid-cols-3'
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <div className='flex space-x-2'>
                                        <CopyToClipboard text={char.character_id} />
                                        <Delete charId={char.character_id} />
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
