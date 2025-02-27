import { createClient } from "../supabase/client";

const supabase = createClient();

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
    class: string;
    character_id: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    imagePath: string;
    isSelected: boolean;
    isDragging: boolean;
}

export const structureData = [
    { id: "1b477e13-4e77-434e-ba52-6ab1e60ded1d", name: "Item 001", width: 1, height: 2, image_path: "/structures/item_001.png" },
    { id: "1be303f0-f077-4a6d-bc2b-1e10f48e1221", name: "Item 002", width: 1, height: 2, image_path: "/structures/item_002.png" },
    { id: "1063d70a-ca23-48e7-a7fd-8949249c02cc", name: "Item 003", width: 1, height: 1, image_path: "/structures/item_003.png" },
    { id: "da72794d-86b8-45b2-9541-87539eb6fadf", name: "Item 004", width: 2, height: 2, image_path: "/structures/item_004.png" },
    { id: "95feed38-57f8-43e5-a603-56258494f03c", name: "Item 005", width: 1, height: 1, image_path: "/structures/item_005.png" },
    { id: "53a759a2-32e0-47aa-882f-d2c8ac2eb5c5", name: "Item 006", width: 1, height: 1, image_path: "/structures/item_006.png" },
];

export interface SidebarProps {
    activeTab: "tiles" | "characters" | "structures" | "settings";
    setActiveTab: (tab: SidebarProps["activeTab"]) => void;
    tileColors: { [key: string]: string };
    activeTile: string | null;
    setActiveTile: (tile: string | null) => void;
    champions: Character[];
    addCharacter: (char: Character) => void;
    addItem: (itemPath: string, w: number, h: number) => void;
    saveCanvas: (structures: Structure[], tiles: any, characters: Character[]) => void;
    loadCanvas: (
        setStructures: (structures: Structure[]) => void,
        setTiles: (tiles: any) => void,
        setCharacters: (characters: Character[]) => void
    ) => void;
    characters: Character[];
    setCharacters: (characters: Character[]) => void;
    structures: Structure[];
    tiles: any;
    setStructures: (structures: Structure[]) => void;
    setTiles: (tiles: any) => void;
    selectionMode: "single" | "rectangle" | "structures";
    setSelectionMode: (selectionMode: SidebarProps["selectionMode"]) => void;
}

export const tileCategories = {
    walls: {
        wall: "/tiles/wall.webp",
        stonewall: "/tiles/stonewall.webp",
    },
    other: {
        grass: "/tiles/grass.webp",
        water: "/tiles/water.webp",
        sand: "/tiles/sand.webp",
        floor: "/tiles/floor.webp",
    },
    tools: {
        eraser: "",
    },
};

export const loadCanvas = async (
    setStructures: React.Dispatch<React.SetStateAction<Structure[]>>,
    setTiles: React.Dispatch<React.SetStateAction<{ [key: string]: string | null | undefined }>>,
    setCharacters: React.Dispatch<React.SetStateAction<Character[]>>
) => {
    try {
        const currentUser = await supabase.auth.getUser();
        if (!currentUser) {
            console.error("User not authenticated");
            return;
        }

        const { data, error } = await supabase
            .from("maps")
            .select("data")
            .eq("user_id", currentUser.data.user?.id)
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

        setStructures(Array.isArray(mapData.structures) ? mapData.structures : []);
        setTiles(typeof mapData.tiles === "object" && mapData.tiles !== null ? mapData.tiles : {});
        setCharacters(
            (Array.isArray(mapData.characters) ? mapData.characters : []).map((char: Character) => ({
                ...char,
                class: char.class ? char.class.toLowerCase() : "fighter",
                imagePath: char.class ? `/characters/${char.class.toLowerCase()}.webp` : "/characters/fighter.webp",
                isDragging: false,
                isSelected: false,
            }))
        );
    } catch (err) {
        console.error("Unexpected error in loadCanvas:", err);
    }
};

export const loadEveryCanvas = async () => {
    try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
            console.error("User not authenticated");
            return [];
        }

        const { data, error } = await supabase
            .from("maps")
            .select("data")
            .eq("user_id", userData.user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase error:", error);
            return [];
        }

        if (!data || data.length === 0) {
            console.warn("No map data found.");
            return [];
        }

        return data.map((item) => item.data);
    } catch (err) {
        console.error("Unexpected error in loadEveryCanvas:", err);
        return [];
    }
};