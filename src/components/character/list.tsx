"use client";

import { useEffect, useState } from "react";
import {createClient} from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
}

const FetchCharacters = ({ userId }: { userId: string | null }) => {
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
    };

    fetchCharacters();
  }, [userId]);

  if (loading) return <p className="text-center text-gray-500">Loading characters...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (characters.length === 0) return <p className="text-center text-gray-500">No characters found.</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Characters</h2>
      <ul className="space-y-3">
        {characters.map((char) => (
          <li
            key={char.id}
            className="border p-3 rounded-lg shadow-md bg-white cursor-pointer hover:bg-gray-100 transition"
            onClick={() => router.push(`/home/characters/${char.id}`)} // Navigate to character details
          >
            <h3 className="text-lg font-semibold">{char.name}</h3>
            <p className="text-gray-600">{char.race} - {char.class} (Level {char.level})</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FetchCharacters;
