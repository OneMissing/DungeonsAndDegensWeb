"use client";

import { useState } from "react";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";

interface CopyToClipboardProps {
  text: string;
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ text }) => {

  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <button
    onClick={(e) => {
        e.stopPropagation();
        handleCopy();
      }}
      className="flex items-center gap-2 p-2 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition z-[120]" 
    >
      <motion.div
        key={copied ? "checked" : "clipboard"}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        {copied ? <ClipboardCheck size={24} /> : <Clipboard size={24} />}
      </motion.div>
    </button>
  );
};

export default CopyToClipboard;
