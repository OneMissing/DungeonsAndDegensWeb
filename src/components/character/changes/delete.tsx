"use client";

import { useState } from "react";
import { Trash, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import usePopup from "@/components/ui/popup";
import { Tooltip } from "@heroui/react";

interface DeleteProps {
    charId: string;
}

const Delete: React.FC<DeleteProps> = ({ charId }) => {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showPopup, Popup, closePopup } = usePopup();

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase
                .from("characters")
                .delete()
                .eq("id", charId);
            if (error) throw new Error(error.message);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
            window.location.reload();
        }
    };

    const confirmDelete = async () => {
        const userConfirmed = await showPopup();
        if (userConfirmed) {
            await handleDelete();
        }
    };

    return (
        <>
            <Tooltip
                placement='bottom'
                offset={-7}
                classNames={{
                    base: ["before:bg-neutral-400 dark:before:bg-white"],
                    content: ["py-2 px-4 shadow-xl bg-slate-700 rounded-lg"],
                }}
                content='Delete character'
                showArrow={true}
            >
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete();
                    }}
                    className='flex items-center gap-2 p-2 text-white bg-red-500 rounded-lg shadow-md hover:bg-red-900 transition z-[120]'
                >
                    <motion.div
                        key={loading ? "checked" : "clipboard"}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        {loading ? <Trash2 size={24} /> : <Trash size={24} />}
                    </motion.div>
                </button>
            </Tooltip>

            <Popup
                title='Confirm Deletion'
                buttons={
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                closePopup(false);
                            }}
                            className='px-4 py-2 bg-gray-300 rounded'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                closePopup(true);
                            }}
                            className='px-4 py-2 bg-red-500 text-white rounded'
                        >
                            Delete
                        </button>
                    </>
                }
            >
                <p>Are you sure you want to delete this character?</p>
            </Popup>
        </>
    );
};

export default Delete;
