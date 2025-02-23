"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Inventory from "@/components/character/player/inventory";
import CharacterInfo from "@/components/character/dm/characterInfo";
import Link from "next/link";

const CharacterDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const className = "bg-2-light dark:bg-2-dark mt-4 p-4 rounded-lg shadow-md h-full lg:min-h-[calc(100vh-6.5rem)] lg:max-h-[calc(100vh-6.5rem)] select-none";

  const fetchData = async () => {
    if (!id) {
      setError("Wrong character Link");
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading character...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full px-4 select-none">
      <CharacterInfo characterId={id as string} className={className} />
      <section className={className}>
        <Link href={`/home/level-up/${id}`}>Level Up</Link>
      </section>
      <section className={`${className} md:col-span-2 min-h-fill max-h-full`}>
        <Inventory character_id={id as string} />
      </section>
    </div>
  );
};

export default CharacterDetails;
