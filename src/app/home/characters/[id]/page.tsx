"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SkillsTable from "@/components/character/skills";
import InventorySection from "@/components/character/items/inventoryDisplay";
import CharacterInfo from "@/components/character/characterInfo";

interface Character {
  id: string;
  user_id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  experience: number;
  background: string;
  alignment: string;
  created_at: string;
  strength?: number;
  dexterity?: number;
  constitution?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;
}

const CharacterDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const className = "bg-gray-100 mt-4 p-4 rounded-lg shadow-md min-h-0 max-h-none md:min-h-[calc(100vh-6.5rem)] md:max-h-[calc(100vh-6.5rem)] dark:bg-gray-600";

  const fetchData = async () => {
    if (!id) return <p className="text-center text-red-500">Wrong charcter Link</p>;
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading character...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full pl-4 pr-4">
      <CharacterInfo characterId={id as string} className={className} />
      <SkillsTable characterId={id as string} className={className} />
      <InventorySection characterId={id as string} className={className} />
      <section className={className}>
        <h3 className="text-2xl font-semibold">Spells</h3>
        <p>No spells learned</p>
      </section>
    </div>
  );
};

export default CharacterDetails;
