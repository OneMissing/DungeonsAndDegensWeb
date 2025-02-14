"use client";

import { useState, useEffect } from "react";
import supabase from "@/lib/supabase/client";

interface SkillsGridProps {
  characterId: string;
}

const SkillsGrid = ({ characterId }: SkillsGridProps) => {
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
    <div className="rounded-lg shadow-md min-h-0 md:min-h-[calc(100vh-13rem)] md:h-[calc(100vh-13rem)] overflow-y-visible md:overflow-y-auto mt-4">
      <div className="flex flex-col gap-2">
        {Object.entries(skills).map(([skill, value]) => (
          <div key={skill} className="flex items-center justify-between p-2 bg-gray-100 rounded-lg shadow">
            <span className="font-semibold text-lg">{skill.replace(/_/g, " ")} ({value})</span>
            <div className="flex items-center gap-2">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => updateSkill(skill, value - 1)}
                disabled={value <= 0}
              >
                -
              </button>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => updateSkill(skill, value + 1)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsGrid;
