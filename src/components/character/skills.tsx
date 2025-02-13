"use client";

import { useEffect, useState } from "react";
import  supabase  from "@/lib/supabase/client";

const SkillsTable = () => {
  const [skills, setSkills] = useState<Record<string, number> | null>(null);
  const [characterId, setCharacterId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndSkills = async () => {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch the user's character ID (assuming it's stored in a "characters" table)
      const { data: characterData, error: characterError } = await supabase
        .from("characters")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (characterError || !characterData) {
        console.error("Error fetching character:", characterError);
        return;
      }

      setCharacterId(characterData.id);

      // Fetch the user's skills
      const { data: skillsData, error: skillsError } = await supabase
        .from("user_skills")
        .select("*")
        .eq("user_id", characterData.id)
        .single();

      if (skillsError) {
        console.error("Error fetching skills:", skillsError);
      } else {
        setSkills(skillsData);
      }
    };

    fetchUserAndSkills();
  }, []);

  const updateSkill = async (skill: string, delta: number) => {
    if (!skills || !characterId) return;

    const newValue = skills[skill] + delta;
    setSkills({ ...skills, [skill]: newValue });

    const { error } = await supabase
      .from("user_skills")
      .update({ [skill]: newValue })
      .eq("user_id", characterId);

    if (error) console.error("Error updating skill:", error);
  };

  if (!skills) return <p>Loading...</p>;

  const skillNames = Object.keys(skills).filter((key) => key !== "user_id" && key !== "id");

  return (
    <table className="min-w-full border border-gray-300 mt-5">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-4 py-2">Skill</th>
          <th className="border px-4 py-2">Decrease</th>
          <th className="border px-4 py-2">Value</th>
          <th className="border px-4 py-2">Increase</th>
        </tr>
      </thead>
      <tbody>
        {skillNames.map((skill) => (
          <tr key={skill} className="text-center">
            <td className="border px-4 py-2 font-semibold">{skill.replace(/_/g, " ")}</td>
            <td className="border px-4 py-2">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => updateSkill(skill, -1)}
              >
                -
              </button>
            </td>
            <td className="border px-4 py-2">{skills[skill]}</td>
            <td className="border px-4 py-2">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => updateSkill(skill, 1)}
              >
                +
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SkillsTable;
