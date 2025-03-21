"use client";

import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const CreateChar = ({ className }: { className?: string }) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className={`${className}`}>
      <motion.div
        key={loading ? "sending" : "sended"}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}>
        <div className="w-full h-full flex items-center justify-center">
          {loading ? (
            <button className={`p-2 text-white rounded-lg transition bg-tetriary-dark hover:bg-blue-700 hover:border-white w-full flex justify-center`}>
              <Loader2 color="white" size={24} />
            </button>
          ) : (
            <Link className="p-2 h-full w-full rounded-lg transition bg-tetriary-dark hover:bg-blue-700 hover:border-white" href="/home/create">
              <button
                className={` text-white w-full`}
                onClick={() => {
                  setLoading(true);
                }}>
                Create character
              </button>
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CreateChar;
