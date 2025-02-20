"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle } from "lucide-react";
import { redirect } from "next/navigation";

const LinkCharacter = () => {
    const supabase = createClient();
    const [charId, setCharId] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLinkCharacter = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                throw new Error("User not authenticated.");
            }

            const { error: updateError } = await supabase
                .from("characters")
                .update({ user_id: user.id })
                .eq("id", charId);

            if (updateError) {
                throw new Error(updateError.message);
            }

            setSuccess(true);
            setCharId("");
            setTimeout(() => {
                setSuccess(false);
                redirect("/home");
            }, 3000);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='flex items-center gap-2rounded-lg shadow-lg text-white'>
                <input
                    type='text'
                    value={charId}
                    onChange={(e) => setCharId(e.target.value)}
                    placeholder='Enter Character ID'
                    className='w-full p-2 text-black rounded-md'
                />

                <button
                    onClick={handleLinkCharacter}
                    className='flex items-center justify-center w-1/4 p-2 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition'
                    disabled={loading || !charId}
                >
                    {loading ? (
                        <Loader2 className='animate-spin' size={20} />
                    ) : (
                        "Link"
                    )}
                </button>
                </div>

                {success && (
                    <div className='flex items-center text-green-400'>
                        <CheckCircle size={20} className='mr-2' />
                        Character linked!
                    </div>
                )}

                {error && <p className='text-red-400'>{error}</p>}
        </div>
    );
};

export default LinkCharacter;
