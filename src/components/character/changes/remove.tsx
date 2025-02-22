"use client";

import { useState } from "react";
import { Eraser, Trash, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Tooltip } from "@heroui/react";

interface CopyToClipboardProps {
    text: string;
}

const Remove: React.FC<CopyToClipboardProps> = ({ text }) => {
    const supabase = createClient();
    const [copied, setCopied] = useState(false);
    const handleRemove = async () => {
        try {
            const { error } = await supabase
                .from("characters")
                .update({ user_id: null })
                .eq("id", text);
            window.location.reload();
        } catch (error) {
            console.error("Failed to copy text:", error);
        }
    };

    return (
        <Tooltip
            placement='bottom'
            offset={-7}
            classNames={{
              base: [
                "before:bg-neutral-400 dark:before:bg-white",
              ],
              content: ["py-2 px-4 shadow-xl bg-slate-700 rounded-lg"],
            }}
            content="Remove from control"
            showArrow={true}
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                }}
                className='flex items-center gap-2 p-2 text-white bg-red-500 rounded-lg shadow-md hover:bg-red-900 transition z-[120]'
            >
                <motion.div
                    key={copied ? "checked" : "clipboard"}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                >
                    {copied ? <Trash2 size={24} /> : <Eraser size={24} />}
                </motion.div>
            </button>
        </Tooltip>
    );
};

export default Remove;
