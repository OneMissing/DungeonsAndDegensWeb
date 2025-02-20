"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Loader2, CheckCircle } from "lucide-react";

interface DeleteCharacterProps {
  charId: string;
}

const DeleteCharacter: React.FC<DeleteCharacterProps> = ({ charId }) => {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); 

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from("characters")
        .delete()
        .eq("id", charId);

      if (error) throw new Error(error.message);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Reset success state
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-800 rounded-lg shadow-lg text-white w-80">
      <h2 className="text-lg font-bold">Delete Character</h2>

      <button
        onClick={handleDelete}
        className="flex items-center justify-center w-full p-2 text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 transition"
        disabled={loading}
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
        {loading ? "Deleting..." : "Delete Character"}
      </button>

      {success && (
        <div className="flex items-center text-green-400">
          <CheckCircle size={20} className="mr-2" />
          Character deleted successfully!
        </div>
      )}

      {error && <p className="text-red-400">{error}</p>}
    </div>
  );
};

export default DeleteCharacter;
