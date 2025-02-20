import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Character, Structure } from "@/lib/map/types";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export const PopupLoad = ({
    buildMap,
    isOpen,
    setIsOpen,
}: {
    buildMap: (mapData: {
        structures: Structure[];
        tiles: { [key: string]: string | null };
        characters: Character[];
    }) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}) => {
    const supabase = createClient();
    const [maps, setMaps] = useState<{ id: string; name: string; data: any }[]>([]);
    const [popupLoad, setPopupLoad] = useState<boolean>(false);

    useEffect(() => {
        const fetchMaps = async () => {
            try {
                const { data: userData, error: authError } = await supabase.auth.getUser();
                if (authError) {
                    console.error("Supabase auth error:", authError);
                    return;
                }
                const user = userData?.user;
                if (!user) {
                    console.error("User not authenticated");
                    return;
                }
                const { data, error } = await supabase
                    .from("maps")
                    .select("id, name, data")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });
                if (error) {
                    console.error("Supabase query error:", error);
                    return;
                }
                setMaps(data || []);
                if(data.length === 0 && !popupLoad){
                    return;
                }
                setIsOpen(true);
                setPopupLoad(true);
            } catch (err) {
                console.error("Unexpected error in fetchMaps:", err);
            }
        };

        fetchMaps();
    }, []);

    const deleteMap = async (mapId: string) => {
        const { error } = await supabase.from("maps").delete().eq("id", mapId);
        if (error) {
            console.error("Error deleting map:", error);
            return;
        }
        setMaps((prevMaps) => prevMaps.filter((map) => map.id !== mapId));
    };

    return (
        <div className="z-[80]">
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Select a Map</h2>
                        <ul className="space-y-2">
                            {maps.length != 0 ? maps.map((map) => (
                                <li key={map.id} className="flex items-center justify-between bg-gray-200 px-4 py-2 rounded">
                                    <button
                                        className="flex-1 text-left"
                                        onClick={() => {
                                            const data = map.data || {};
                                            buildMap({
                                                structures: Array.isArray(data.structures) ? data.structures : [],
                                                tiles: typeof data.tiles === "object" && data.tiles !== null ? data.tiles : {},
                                                characters: Array.isArray(data.characters) ? data.characters : [],
                                            });
                                            setIsOpen(false);
                                        }}
                                    >{map.name}
                                    </button>
                                    <button onClick={() => deleteMap(map.id)} className="text-red-500 hover:text-red-700 ml-2">
                                        <Trash size={20} />
                                    </button>
                                </li>
                            )): <li className="flex items-center text px-4 py-2 rounded"><p className="center m-auto text-red-700">No maps found</p></li> }
                        </ul>
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded w-full" onClick={() => setIsOpen(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const PopupSave = ({ mapData, onClose, }: { mapData: any; onClose: () => void }) => {
    const supabase = createClient();
    const [mapName, setMapName] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data?.user) {
                setError("Authentication failed.");
            } else {
                setUserId(data.user.id);
            }
        };

        fetchUser();
    }, [supabase]);

    const saveMap = async () => {
        if (!mapName.trim() || !userId) return;
        setSaving(true);
        setError(null);
        const { data: existingMap, error: fetchError } = await supabase
            .from("maps")
            .select("id")
            .eq("name", mapName.trim())
            .eq("user_id", userId)
            .single();
        if (fetchError && fetchError.code !== "PGRST116") { 
            setError("Error checking existing maps.");
            console.error("Fetch error:", fetchError);
            setSaving(false);
            return;
        }
        let saveError;
        if (existingMap) {
            ({ error: saveError } = await supabase
                .from("maps")
                .update({ data: mapData })
                .eq("id", existingMap.id));
        } else {
            ({ error: saveError } = await supabase
                .from("maps")
                .insert([{ name: mapName.trim(), user_id: userId, data: mapData }]));
        } if (saveError) {
            setError("Error saving map.");
            console.error("Save error:", saveError);
        } else {
            onClose();
        }
          const router = useRouter();
          router.refresh();
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">Save Map</h2>
                <input
                    type="text"
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Enter map name"
                    value={mapName}
                    onChange={(e) => setMapName(e.target.value)}
                    disabled={saving}
                />
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <div className="flex justify-between">
                    <button
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                        onClick={onClose}
                        disabled={saving}
                    > Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={saveMap}
                        disabled={saving || !mapName.trim()}
                    > {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

