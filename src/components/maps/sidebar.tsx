"use client";
import React, { useEffect, useRef, useState } from "react";
import { default as NextImage } from "next/image";
import { Character, Structure } from "@/lib/types/map";
import { PopupSave, PopupLoad } from "./popup";
import {
  Boxes,
  House,
  MousePointerClick,
  Move,
  PersonStanding,
  Settings,
  Square,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SidebarProps {
  activeTab: "tiles" | "characters" | "structures" | "settings";
  setActiveTab: (
    tab: "tiles" | "characters" | "structures" | "settings"
  ) => void;
  tileColors: { [key: string]: string };
  activeTile: string | null;
  setActiveTile: (tile: string | null) => void;
  champions: Character[];
  addCharacter: (char: Character) => void;
  addItem: (itemPath: string, w: number, h: number) => void;
  saveCanvas: (structures: any[], tiles: any, characters: Character[]) => void;
  loadCanvas: (
    setStructures: (structures: any[]) => void,
    setTiles: (tiles: any) => void,
    setCharacters: (characters: Character[]) => void
  ) => void;
  characters: Character[];
  setCharacters: (characters: Character[]) => void;
  structures: any[];
  tiles: any;
  setStructures: (structures: any[]) => void;
  setTiles: (tiles: any) => void;
  selectionMode: string;
  setSelectionMode: (
    SelectionMode: "single" | "rectangle" | "structures"
  ) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  tileColors,
  activeTile,
  setActiveTile,
  champions,
  addCharacter,
  addItem,
  saveCanvas,
  loadCanvas,
  characters,
  setCharacters,
  structures,
  setStructures,
  tiles,
  setTiles,
  selectionMode,
  setSelectionMode,
}) => {
  const tileCategories = {
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

  const [isSavePopupOpen, setIsSavePopupOpen] = useState(false);
  const [isLoadPopupOpen, setIsLoadPopupOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const isResizingRef = useRef(false);
  const [wasLoaded, setWasLoaded] = useState<boolean>(false);
  const imageSize = sidebarWidth <= 250 ? 50 : sidebarWidth >= 400 ? 100 : 75;
  const columns = sidebarWidth >= 400 ? 3 : 2;
  const [structureImages, setStructureImages] = useState<
    { name: string; url: string; width: number; height: number; }[]
  >([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchStructures = async () => {
      try {
        const { data, error } = await supabase
          .from("structures")
          .select("id, name, width, height, image_path");

        if (error) {
          console.error("Error fetching structures:", error);
          return;
        }

        if (!data || !Array.isArray(data)) {
          console.warn("No structures found or invalid response");
          return;
        }

        setStructureImages(
          data.map((structure) => ({
            name: structure.name,
            url: structure.image_path || "", 
            width: structure.width ?? 50,
            height: structure.height ?? 50,
            isSelected: false,
            isDragging: false,
          }))
        );
      } catch (err) {
        console.error("Unexpected error fetching structures:", err);
      }
    };

    fetchStructures();
  }, []);

  const buildMap = (mapData: {
    structures: Structure[];
    tiles: { [key: string]: string | null };
    characters: Character[];
  }) => {
    setStructures(mapData.structures);
    setTiles(mapData.tiles);
    setCharacters(
      mapData.characters.map((char: Character) => ({
        ...char,
        class: char.class ? char.class.toLowerCase() : "warrior",
        imagePath: char.class
          ? `/characters/${char.class.toLowerCase()}.webp`
          : "/characters/warrior.webp",
        isDragging: false,
        isSelected: false,
      }))
    );
  };

  useEffect(() => {
    const savedWidth = localStorage.getItem("sidebarWidth");
    if (savedWidth) {
      setSidebarWidth(parseInt(savedWidth, 10));
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    const startX = e.clientX;
    const startWidth = sidebarWidth;
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizingRef.current) return;
      const newWidth = Math.min(
        430,
        Math.max(225, startWidth + moveEvent.clientX - startX)
      );
      setSidebarWidth(newWidth);
      localStorage.setItem("sidebarWidth", newWidth.toString());
    };
    const handleMouseUp = () => {
      isResizingRef.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="flex">
      <PopupLoad
        buildMap={buildMap}
        popupLoad={false}
        setWasloaded={setWasLoaded}
      />
      {isSavePopupOpen && (
        <PopupSave
          mapData={{ structures, tiles, characters }}
          onClose={() => setIsSavePopupOpen(false)}
        />
      )}
      {isLoadPopupOpen && (
        <PopupLoad
          buildMap={buildMap}
          popupLoad={true}
          setWasloaded={setWasLoaded}
        />
      )}
      <div
        className="relative bg-background-light dark:bg-background-dark border-r border-border-light dark:border-border-dark"
        style={{ width: `${sidebarWidth}px`, minWidth: "200px" }}
      >
        <div
          className="absolute top-0 right-0 w-2 h-full cursor-ew-resize bg-gray-300 dark:bg-gray-700 z-[1000]"
          onMouseDown={handleMouseDown}
        />

        <div className="p-4">
          <div className="flex space-x-2 mb-4">
            {[
              { tab: "tiles", icon: Square, label: "Tiles" },
              { tab: "characters", icon: House, label: "Characters" },
              { tab: "structures", icon: Boxes, label: "Structures" },
              { tab: "settings", icon: Settings, label: "Settings" },
            ].map(({ tab, icon: Icon, label }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex items-center gap-2 p-2 rounded-md text-sm transition-all ${
                  activeTab === tab
                    ? "bg-primary-light dark:bg-primary-dark text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                }`}
              >
                <Icon className="w-5 h-5" />
                {sidebarWidth > 270 &&
                  (activeTab === tab || sidebarWidth > 420) && (
                    <span className="transition-opacity duration-300">
                      {label}
                    </span>
                  )}
              </button>
            ))}
          </div>

          <div className="relative flex flex-col h-[100%-5rem]">
            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === "tiles" && (
                <div className="space-y-4">
                  {Object.entries(tileCategories).map(([category, tiles]) => (
                    <div
                      key={category}
                      className="border-b border-border-light dark:border-border-dark pb-2"
                    >
                      <h3 className="text-center text-lg text-foreground-light dark:text-foreground-dark capitalize">
                        {category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(tiles).map(([tile, src]) => (
                          <button
                            key={tile}
                            className={`w-12 h-12 border rounded-md ${
                              activeTile === tile
                                ? "border-yellow-500"
                                : "border-gray-600 dark:border-gray-500"
                            }`}
                            onClick={() => setActiveTile(tile)}
                          >
                            {src ? (
                              <img
                                src={src}
                                alt={tile}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              "🧽"
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
                            {activeTab === "characters" && (
                <div
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
                >
                  {champions.map((char) => (
                    <button
                      key={char.id}
                      onClick={() => addCharacter(char)}
                      className="p-2 border border-border-light dark:border-border-dark rounded-md"
                    >
                      <NextImage
                        alt={char.name}
                        src={`/characters/${char.class.toLowerCase()}.webp`}
                        className="w-full"
                        width={imageSize}
                        height={imageSize}
                      />
                      <p className="text-center text-sm text-foreground-light dark:text-foreground-dark">
                        {char.name}
                      </p>
                    </button>
                  ))}
                </div>
              )}
              {activeTab === "structures" && (
                <div
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
                >
                  {structureImages.map((structure) => (
                    <button
                      key={structure.name}
                      onClick={() => addItem(structure.url, structure.width, structure.height)}
                      className="p-2 border border-border-light dark:border-border-dark rounded-md"
                    >
                      <NextImage
                        src={structure.url}
                        alt={structure.name}
                        width={imageSize}
                        height={imageSize}
                      />
                      <p className="text-center text-sm text-foreground-light dark:text-foreground-dark">
                        {structure.name.replace(/_/g, " ")}
                      </p>
                    </button>
                  ))}
                </div>
              )}
              {activeTab === "settings" && (
                <div className="space-y-2">
                  <button
                    onClick={() => setIsSavePopupOpen(true)}
                    className="w-full p-2 bg-primary-light dark:bg-primary-dark text-white rounded-md"
                  >
                    Save Map
                  </button>
                  <button
                    onClick={() => setIsLoadPopupOpen(true)}
                    className="w-full p-2 bg-secondary-light dark:bg-secondary-dark text-white rounded-md"
                  >
                    Load Map
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mode Selector - Anchored at the Bottom */}
          <div className="absolute left-0 bottom-0 w-full mr-2 bg-gray-800 p-4 pr-6 border-t border-gray-600">
            <h1 className="text-center text-gray-300 text-sm font-semibold mb-2 -mt-2">
              Mode
            </h1>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectionMode("rectangle")}
                className={`flex flex-col items-center justify-center p-2 rounded-md transition-all
          ${
            selectionMode === "rectangle"
              ? "bg-blue-500 text-white shadow-md shadow-blue-500/50"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
              >
                <Square className="w-5 h-5 mb-1" />
                <span className="text-xs">Rectangle</span>
              </button>
              <button
                onClick={() => setSelectionMode("single")}
                className={`flex flex-col items-center justify-center p-2 rounded-md transition-all
          ${
            selectionMode === "single"
              ? "bg-blue-500 text-white shadow-md shadow-blue-500/50"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
              >
                <MousePointerClick className="w-5 h-5 mb-1" />
                <span className="text-xs">Single</span>
              </button>
              <button
                onClick={() => setSelectionMode("structures")}
                className={`flex flex-col items-center justify-center p-2 rounded-md transition-all
          ${
            selectionMode === "structures"
              ? "bg-blue-500 text-white shadow-md shadow-blue-500/50"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
              >
                <Move className="w-5 h-5 mb-1" />
                <span className="text-xs">Structures</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
