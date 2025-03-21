"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CopyToClipboard from "@/components/character/changes/clipboard";
import Remove from "./changes/remove";
import Delete from "./changes/delete";
import Link from "next/link";
import { Character } from "@/lib/tools/types";
import { getDmCharacters, getPlayerCharacters } from "@/lib/fetch/fetch";

const CharacterList = ({ userId, dm }: { userId: string; dm: boolean }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function loadCharacters() {
      try {
        setLoading(true);
        const data = dm ? await getDmCharacters(userId) : await getPlayerCharacters(userId);
        setCharacters(data ? data : []);
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

  if (loading) return <p className="text-center text-gray-500">Loading characters...</p>;
  return (
    <div className="p-4 w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">{dm ? "DM Characters" : "Player Characters"}</h2>
      <ul className="space-y-3" key="master-shit">
        {characters.map((char) => (
          <li
            key={char.character_id}
            className="relative border p-4 rounded-lg shadow-md bg-1-light cursor-pointer hover:bg-2-light dark:bg-2-dark dark:hover:bg-3-dark transition-all flex items-center justify-center"
            onClick={() => router.push(`/home/${dm ? "dm-characters" : "player-characters"}/${char.character_id}`)}>
            <div className="absolute top-3 left-3 flex space-x-3">
              <CopyToClipboard text={char.character_id} />
              {dm? (<Remove charId={char.character_id} characters={characters} setCharacters={setCharacters} />):(<Delete charId={char.character_id} characters={characters} setCharacters={setCharacters} />)}
            </div>

            <div className="w-full text-lg font-semibold text-yellow-400 text-end md:text-center -mt-2 pb-2">{char.name}</div>

            <p className="absolute bottom-3 text-gray-500 text-sm w-full text-end md:text-center px-4">
              {char.race} - {char.class}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CharacterList;
