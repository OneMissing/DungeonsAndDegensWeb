import { use } from "react";
import { supabase, user } from "../tools/types";

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
        const currentUser = await user();
        if (!currentUser) {
            console.error("User not authenticated");
            return;
        }

        const { data, error } = await supabase
            .from("maps")
            .select("data")
            .eq("user_id", currentUser?.id)
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
                class: char.class ? char.class.toLowerCase() : "warrior",
                imagePath: char.class ? `/characters/${char.class.toLowerCase()}.webp` : "/characters/warrior.webp",
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