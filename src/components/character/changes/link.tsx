"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LinkCharacter = ({ className }: { className?: string }) => {
  const supabase = createClient();
  const [charId, setCharId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleLinkCharacter = async () => {
    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("User not authenticated.");
      const { error: updateError } = await supabase.from("characters").update({ player_id: user.id }).eq("character_id", charId);
      if (updateError) throw new Error(updateError.message);
      showMessage("Gained control over character", "success");
    } catch (err) {
      showMessage("Failed to gain control.", "error");
    } finally {
      setLoading(false);
      setCharId("");
    }
  };

  return (
    <div className={`${className}`}>
      <div className="w-full h-14">
        <AnimatePresence mode="wait">
          {message !== null ? (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full h-full flex items-center justify-center">
              <div className={`w-full p-2 text-center rounded ${message?.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>{message?.text}</div>
            </motion.div>
          ) : (
            <motion.div
              key="dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full h-full flex items-center justify-center gap-x-2.5">
              <input
                type="text"
                value={charId}
                onChange={(e) => setCharId(e.target.value)}
                placeholder="Enter Character ID:"
                className="w-full p-2 text-1-dark dark:text-1-light rounded-md"
                onContextMenu={(e) => { e.preventDefault(); setCharId(""); }}
              />

              <button
                onClick={handleLinkCharacter}
                className={`py-2 px-4 text-white rounded-lg transition flex justify-center ${
                  charId.length >= 36 ? "bg-tetriary-dark hover:bg-blue-700 hover:border-white" : "bg-red-400 border-red-700 border cursor-not-allowed"
                }`}
                disabled={charId.length < 36}>
                <motion.div
                  key={loading ? "sending" : "sended"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}>
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Link"}
                </motion.div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LinkCharacter;
