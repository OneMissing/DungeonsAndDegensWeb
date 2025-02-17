import { useEffect, useState } from "react";
import {createClient} from "@/lib/supabase/client"; // Adjust the path if needed

type Champion = {
  id: string;
  name: string;
  user_id: string;
  avatar_url?: string; // Add other fields as needed
};

const useChampions = () => {
  const supabase = createClient();
  const [characters, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChampions = async () => {
      setLoading(true);
      
      // Get authenticated user
      const { data: user, error: authError } = await supabase.auth.getSession();
      if (authError || !user?.session ) {
        console.error("Authentication error:", authError);
        setLoading(false);
        return;
      }

      // Fetch characters owned by the user
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("user_id", user.session.user.id);

      if (error) {
        console.error("Error fetching characters:", error);
      } else {
        setChampions(data || []);
      }

      setLoading(false);
    };

    fetchChampions();
  }, []);

  return { characters, loading };
};

export default useChampions;
