"use client";

import { useState, useEffect } from "react";
import  supabase  from "@/lib/supabase/client";

interface SkillsTableProps {
  characterId: string;
}

const SkillsTable = ({ characterId }: SkillsTableProps) => {
  const [skills, setSkills] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!characterId) {
      setError("Character ID is missing.");
      return;
    }

    const fetchSkills = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("character_skills")
        .select("*")
        .eq("character_id", characterId)
        .single();

      if (error) {
        setError("Failed to fetch skills.");
      } else {
        // Remove character_id from the object to keep only skill values
        const { character_id, ...skillsData } = data;
        setSkills(skillsData);
      }

      setLoading(false);
    };

    fetchSkills();
  }, [characterId]);

  const updateSkill = async (skill: string, newValue: number) => {
    setSkills((prev) => ({ ...prev, [skill]: newValue }));

    const { error } = await supabase
      .from("character_skills")
      .update({ [skill]: newValue })
      .eq("character_id", characterId);

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
          {Object.entries(skills).map(([skill, value]) => (
            <tr key={skill} className="text-center">
              <td className="border px-4 py-2 font-semibold">{skill.replace(/_/g, " ")}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => updateSkill(skill, value - 1)}
                  disabled={value <= 0}
                >
                  -
                </button>
              </td>
              <td className="border px-4 py-2">{value}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => updateSkill(skill, value + 1)}
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
