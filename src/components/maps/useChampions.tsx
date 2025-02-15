import { useEffect, useState } from "react";
import supabase from "@/lib/supabase/client"; // Adjust the path if needed

type Champion = {
  id: string;
  name: string;
  user_id: string;
  avatar_url?: string; // Add other fields as needed
};

const useChampions = () => {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChampions = async () => {
      setLoading(true);
      
      // Get authenticated user
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (authError || !user?.user) {
        console.error("Authentication error:", authError);
        setLoading(false);
        return;
      }

      // Fetch characters owned by the user
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("user_id", user.user.id);

      if (error) {
        console.error("Error fetching champions:", error);
      } else {
        setChampions(data || []);
      }

      setLoading(false);
    };

    fetchChampions();
  }, []);

  return { champions, loading };
};

export default useChampions;
