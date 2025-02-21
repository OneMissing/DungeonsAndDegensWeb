"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import CopyToClipboard from "@/components/ui/clipboard";
import Remove from "../ui/remove";

interface Character {
    id: string;
    name: string;
    race: string;
    class: string;
    level: number;
}

const FetchCharacters = ({
    userId,
    dm,
}: {
    userId: string | null;
    dm: boolean;
}) => {
    const supabase = createClient();
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchCharacters = async () => {
            if (!userId) {
                setError("You must be logged in to view characters.");
                setLoading(false);
                return;
            }

            if (dm) {
                try {
                    const { data, error } = await supabase
                        .from("characters")
                        .select("id, name, race, class, level")
                        .eq("user_id", userId)
                        .order("created_at", { ascending: false });

                    if (error) {
                        setError("Failed to load characters.");
                    } else {
                        setCharacters(data || []);
                    }
                } catch (err) {
                    setError("An error occurred while fetching characters.");
                }

                setLoading(false);
            } else {
                try {
                    const { data, error } = await supabase
                        .from("characters")
                        .select("id, name, race, class, level")
                        .eq("player_id", userId)
                        .order("created_at", { ascending: false });

                    if (error) {
                        setError("Failed to load characters.");
                    } else {
                        setCharacters(data || []);
                    }
                } catch (err) {
                    setError("An error occurred while fetching characters.");
                }

                setLoading(false);
            }
        };

        fetchCharacters();
    }, [userId]);

    if (loading)
        return (
            <p className='text-center text-gray-500'>Loading characters...</p>
        );
    if (error) return <p className='text-center text-red-500'>{error}</p>;

    if (dm)
        return (
            <div className='p-4 w-1/2'>
                <div className=''>
                    <h2 className='text-2xl font-bold mb-4 text-center'>
                        DM Characters
                    </h2>
                </div>
                <ul className='space-y-3'>
                    {characters.map((char) => (
                        <li
                            key={char.id}
                            className='border p-3 rounded-lg shadow-md bg-white cursor-pointer hover:bg-gray-100 transition'
                            onClick={() =>
                                router.push(`/home/dm-characters/${char.id}`)
                            }
                        >
                            <div className='flex justify-between items-center'>
                                <div className='flex space-x-2'>
                                    <CopyToClipboard text={char.id} />
                                    <Remove text={char.id} />
                                </div>
                                <div className='flex justify-center w-full'>
                                    <span className='text-center w-full'>{char.name}</span>
                                </div>
                            </div>
                            <p className='text-gray-600'>
                                {char.race} - {char.class} (Level {char.level})
                            </p>
                        </li>
                    ))}
                </ul>
            </div>

        );
    else
        return (
            <div className='p-4 w-1/2'>
                <h2 className='text-2xl font-bold mb-4'>Player Characters</h2>
                <ul className='space-y-3'>
                    {characters.map((char) => (
                        <li
                            key={char.id}
                            className='border p-3 rounded-lg shadow-md bg-white cursor-pointer hover:bg-gray-100 transition'
                            onClick={() =>
                                router.push(
                                    `/home/player-characters/${char.id}`
                                )
                            }
                        >


                            <div className='left-0 top-0 -mt-6'>
                                <CopyToClipboard text={char.id} />
                                <h3 className='top=0 text-lg font-semibold'>
                                    {char.name}
                                </h3>
                            </div>
                            <p className='text-gray-600'>
                                {char.race} - {char.class} (Level {char.level})
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        );
};

export default FetchCharacters;
