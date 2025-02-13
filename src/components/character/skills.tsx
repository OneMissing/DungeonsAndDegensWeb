"use client";

import { useState, useEffect } from "react";
import  supabase  from "@/lib/supabase/client";

interface Skill {
  id: string;
  name: string;
  value: number;
}

const SkillsTable = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [characterId, setCharacterId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacterAndSkills = async () => {
      setLoading(true);
      setError(null);

      // Get the authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError("User not found.");
        setLoading(false);
        return;
      }

      // Fetch the user's character ID
      const { data: characterData, error: characterError } = await supabase
        .from("characters")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (characterError || !characterData) {
        setError("Character not found.");
        setLoading(false);
        return;
      }

      setCharacterId(characterData.id);

      // Fetch character's skills
      const { data: skillsData, error: skillsError } = await supabase
        .from("user_skills")
        .select("id, name, value")
        .eq("user_id", characterData.id);

      if (skillsError) {
        setError("Failed to fetch skills.");
      } else {
        setSkills(skillsData);
      }

      setLoading(false);
    };

    fetchCharacterAndSkills();
  }, []);

  const updateSkill = async (skillId: string, newValue: number) => {
    if (!characterId) return;

    // Update state first for better UI responsiveness
    setSkills((prev) =>
      prev.map((s) => (s.id === skillId ? { ...s, value: newValue } : s))
    );

    // Update the database
    const { error } = await supabase
      .from("user_skills")
      .update({ value: newValue })
      .eq("id", skillId)
      .eq("user_id", characterId);

    if (error) {
      console.error("Error updating skill:", error);
      setError("Failed to update skill.");
    }
  };

  if (loading) return <p>Loading skills...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-4">Character Skills</h3>

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Skill</th>
            <th className="border px-4 py-2">Decrease</th>
            <th className="border px-4 py-2">Value</th>
            <th className="border px-4 py-2">Increase</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill) => (
            <tr key={skill.id} className="text-center">
              <td className="border px-4 py-2 font-semibold">{skill.name}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => updateSkill(skill.id, skill.value - 1)}
                  disabled={skill.value <= 0}
                >
                  -
                </button>
              </td>
              <td className="border px-4 py-2">{skill.value}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => updateSkill(skill.id, skill.value + 1)}
                >
                  +
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkillsTable;
