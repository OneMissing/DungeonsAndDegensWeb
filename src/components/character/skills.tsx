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
    <div className="rounded-lg bg-white shadow-md min-h-0 md:min-h-[calc(100vh-13rem)] md:h-[calc(100vh-13rem)] overflow-y-visible md:overflow-y-auto mt-4">
      <table className="min-w-full border    rounded-lg bg-white">
        <tbody>
          {Object.entries(skills).map(([skill, value]) => (
            <tr key={skill} className="text-center">
              <td className=" px-4 py-2 font-semibold">{skill.replace(/_/g, " ")}</td>
              <td className=" px-4 py-2">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => updateSkill(skill, value - 1)}
                  disabled={value <= 0}
                >
                  -
                </button>
              </td>
              <td className=" px-4 py-2">{value}</td>
              <td className=" px-4 py-2">
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
