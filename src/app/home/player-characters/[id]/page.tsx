"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Inventory from "@/components/character/player/inventory";
import CharacterInfo from "@/components/character/dm/characterInfo";
import Link from "next/link";
import DeleteCharacter from "@/components/character/deleteCharacter";

const CharacterDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const className = "bg-gray-100 mt-4 p-4 rounded-lg shadow-md min-h-0 max-h-none md:min-h-[calc(100vh-6.5rem)] md:max-h-[calc(100vh-6.5rem)] dark:bg-gray-600 select-none";

  const fetchData = async () => {
    if (!id) return <p className="text-center text-red-500">Wrong character Link</p>;
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading character...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full pl-4 pr-4 select-none">
      <CharacterInfo characterId={id as string} className={className} />
      <section className={className}>
        <Link href={`/home/level-up/${id}`}>level Up</Link>
        <DeleteCharacter charId={id as string} />
      </section>
      <section className={`${className} col-span-2`}>
      <Inventory character_id={id as string} />
      </section>
    </div>
  );
};

export default CharacterDetails;
