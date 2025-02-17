import { createClient } from '@/lib/supabase/client';

export interface Structure {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    isSelected: boolean;
    itemPath: string;
    isDragging: boolean;
}


export interface Character {
    class: any;
    id: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    imagePath: string;
    isSelected: boolean;
    isDragging: boolean;
}

const supabase = createClient();

export const loadCanvas = async (
    setStructures: React.Dispatch<React.SetStateAction<Structure[]>>,
    setTiles: React.Dispatch<React.SetStateAction<{ [key: string]: string | null | undefined }>>,
    setCharacters: React.Dispatch<React.SetStateAction<Character[]>>
) => {
    try {
        const user = await supabase.auth.getUser();
        if (!user.data?.user) {
            console.error("User not authenticated");
            return;
        }

        const { data, error } = await supabase
            .from("maps")
            .select("data")
            .eq("user_id", user.data.user.id)
            .order("created_at", { ascending: false })
            .limit(1);

        if (error) {
            console.error("Supabase error:", error);
            return;
        }

        if (!data || data.length === 0) {
            console.warn("No map data found.");
            return;
        }

        const mapData = data[0]?.data;
        if (!mapData || typeof mapData !== "object") {
            console.error("Invalid map data format:", mapData);
            return;
        }

        const structures: Structure[] = Array.isArray(mapData.structures) ? mapData.structures : [];
        const tiles: { [key: string]: string | null } =
            typeof mapData.tiles === "object" && mapData.tiles !== null ? mapData.tiles : {};
        const characters: Character[] = Array.isArray(mapData.characters) ? mapData.characters : [];

        setStructures(structures);
        setTiles(tiles);
        setCharacters(characters.map((char: Character) => ({
            ...char,
            class: char.class ? char.class.toLowerCase() : "warrior",
            imagePath: char.class ? `/characters/${char.class.toLowerCase()}.webp` : "/characters/warrior.webp",
            isDragging: false,
            isSelected: false,
        })));
    } catch (err) {
        console.error("Unexpected error in loadCanvasFromSupabase:", err);
    }
};

export const loadEveryCanvas = async () => {
    try {
        const user = await supabase.auth.getUser();
        if (!user.data?.user) {
            console.error("User not authenticated");
            return [];
        }

        const { data, error } = await supabase
            .from("maps")
            .select("data")
            .eq("user_id", user.data.user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase error:", error);
            return [];
        }

        if (!data || data.length === 0) {
            console.warn("No map data found.");
            return [];
        }

        return data.map(item => item.data);
    } catch (err) {
        console.error("Unexpected error in loadCanvas:", err);
        return [];
    }
};



