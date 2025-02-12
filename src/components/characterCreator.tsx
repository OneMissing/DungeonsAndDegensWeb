"use client";

import { useState } from "react";
import supabase from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const CreateCharacter = () => {
  const [name, setName] = useState("");
  const [race, setRace] = useState("");
  const [characterClass, setCharacterClass] = useState("");
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name || !race || !characterClass || level < 1) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError || !userData?.user) {
      setError("You must be logged in to create a character.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("characters").insert([
      {
        user_id: userData.user.id,
        name,
        race,
        class: characterClass,
        level,
      },
    ]);

    if (insertError) {
      setError("Failed to create character.");
    } else {
      setName("");
      setRace("");
      setCharacterClass("");
      setLevel(1);
      router.refresh(); // Refresh to update character list
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
