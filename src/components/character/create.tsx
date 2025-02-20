"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const CreateCharacter = ({ userId }: { userId: string | null }) => {
  const supabase = createClient();
  const [name, setName] = useState("");
  const [race, setRace] = useState("");
  const [characterClass, setCharacterClass] = useState("");
  const [level, setLevel] = useState(1);
  const [strength, setStrength] = useState(10);
  const [dexterity, setDexterity] = useState(10);
  const [constitution, setConstitution] = useState(10);
  const [intelligence, setIntelligence] = useState(10);
  const [wisdom, setWisdom] = useState(10);
  const [charisma, setCharisma] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!userId) {
      setError("You must be logged in to create a character.");
      setLoading(false);
      return;
    }

    if (!name || !race || !characterClass || level < 1) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const { data: character, error: insertError } = await supabase
        .from("characters")
        .insert([
          { name, race, class: characterClass, level, player_id: userId, strength, dexterity, constitution, intelligence, wisdom, charisma },
        ])
        .select("id")
        .single();

      if (insertError) throw insertError;
      
      setName("");
      setRace("");
      setCharacterClass("");
      setLevel(1);
      setStrength(10);
      setDexterity(10);
      setConstitution(10);
      setIntelligence(10);
      setWisdom(10);
      setCharisma(10);
      router.push("/home");
      router.refresh();
    } catch (err) {
      setError("Failed to create character.");
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create a Character</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Character Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Race"
          value={race}
          onChange={(e) => setRace(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Class"
          value={characterClass}
          onChange={(e) => setCharacterClass(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Level"
          value={level}
          onChange={(e) => setLevel(parseInt(e.target.value) || 1)}
          className="w-full p-2 border rounded"
          min={1}
          required
        />

        {/* Attribute Inputs */}
        <h3 className="text-lg font-semibold mt-4">Attributes</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Strength"
            value={strength}
            onChange={(e) => setStrength(parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded"
            min={1}
            required
          />
          <input
            type="number"
            placeholder="Dexterity"
            value={dexterity}
            onChange={(e) => setDexterity(parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded"
            min={1}
            required
          />
          <input
            type="number"
            placeholder="Constitution"
            value={constitution}
            onChange={(e) => setConstitution(parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded"
            min={1}
            required
          />
          <input
            type="number"
            placeholder="Intelligence"
            value={intelligence}
            onChange={(e) => setIntelligence(parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded"
            min={1}
            required
          />
          <input
            type="number"
            placeholder="Wisdom"
            value={wisdom}
            onChange={(e) => setWisdom(parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded"
            min={1}
            required
          />
          <input
            type="number"
            placeholder="Charisma"
            value={charisma}
            onChange={(e) => setCharisma(parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded"
            min={1}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Character"}
        </button>
      </form>
    </div>
  );
};

export default CreateCharacter;
