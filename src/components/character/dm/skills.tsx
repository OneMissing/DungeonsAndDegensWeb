"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface SkillsGridProps {
  characterId: string;
  className: string;
}

function formatSkill(skill: string): string {
  return skill.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const SkillsGrid = ({ characterId, className }: SkillsGridProps) => {
  const supabase = createClient();
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
  
      try {
        const [{ data: userData, error: userError }, { data, error }] = await Promise.all([
          supabase.auth.getUser(),
          supabase
            .from("character_skills")
            .select(
              "acrobatics, animal_handling, arcana, athletics, deception, history, insight, intimidation, investigation, medicine, nature, perception, performance, persuasion, religion, sleight_of_hand, stealth, survival"
            )
            .eq("character_id", characterId)
            .single()
        ]);

        if (userError || !userData?.user?.id) {
          throw new Error("Failed to retrieve user.");
        }
        if (error) throw new Error(error.message);

        const { ...skillsData } = data;
        setSkills(skillsData as { [key: string]: number });
      } catch (err) {
        setError((err as Error).message || "Failed to fetch skills.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchSkills();
  }, [characterId]);

  const updateSkill = async (skill: string, newValue: number) => {
    const previousSkills = { ...skills };
    setSkills((prev) => ({ ...prev, [skill]: newValue }));

    try {
      const { error } = await supabase
        .from("character_skills")
        .update({ [skill]: newValue })
        .eq("character_id", characterId);

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      console.error("Error updating skill:", err);
      setError("Failed to update skill.");
      setSkills(previousSkills);
    }
  };

  if (loading) return <p>Loading skills...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section className={className}>
      <h3 className="text-2xl font-semibold">Skills</h3>
      <ul className="shadow-md min-h-0 lg:min-h-[calc(100vh-12rem)] lg:h-[calc(100vh-12rem)] overflow-y-visible lg:overflow-y-auto mt-4 w-full rounded-lg">
        {Object.entries(skills).map(([skill, value]) => (
          <li
            key={skill}
            className="flex items-center justify-between p-2 border-b bg-white rounded-lg shadow-sm"
          >
            <span className="font-semibold text-lg">
              {formatSkill(skill)} ({value})
            </span>
            <div className="flex items-center gap-2">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded-full disabled:opacity-50"
                onClick={() => updateSkill(skill, Math.max(0, value - 1))}
                disabled={value <= 0}
              >
                -
              </button>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded-full"
                onClick={() => updateSkill(skill, value + 1)}
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SkillsGrid;