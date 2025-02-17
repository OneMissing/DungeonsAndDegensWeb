"use client"
import React, { useState } from "react";
import { default as NextImage } from "next/image";
import { Character, Structure } from "@/lib/types/map";
import { PopupSave, PopupLoad } from "./popup";


interface SidebarProps {
  activeTab: "tiles" | "characters" | "structures" | "settings";
  setActiveTab: (tab: "tiles" | "characters" | "structures" | "settings") => void;
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
  wasLoaded: boolean;
  setWasLoaded: (loaded: boolean) => void;
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
  wasLoaded,
  setWasLoaded,
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
        floor: "/tiles/floor.webp"
    },
    tools: {
        eraser: "", 
    }
};

  const [isSavePopupOpen, setIsSavePopupOpen] = useState(false);
  const [isLoadPopupOpen, setIsLoadPopupOpen] = useState(false);
      const buildMap = (mapData: { structures: Structure[]; tiles: { [key: string]: string | null }; characters: Character[] }) => {
          setStructures(mapData.structures);
          setTiles(mapData.tiles);
          setCharacters(
              mapData.characters.map((char: Character) => ({
                  ...char,
                  class: char.class ? char.class.toLowerCase() : "warrior",
                  imagePath: char.class ? `/characters/${char.class.toLowerCase()}.webp` : "/characters/warrior.webp",
                  isDragging: false,
                  isSelected: false,
              }))
          );
      };
  return (

    <div style={{ width: "300px", padding: "10px", background: "#f0f0f0" }}>
      {isSavePopupOpen && (
        <PopupSave
          mapData={{ structures, tiles, characters }}
          onClose={() => setIsSavePopupOpen(false)}
        />
      )}
      {isLoadPopupOpen && (
        <PopupLoad buildMap={buildMap} popupLoad={true} setWasloaded={setWasLoaded} />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <button onClick={() => setActiveTab("tiles")} style={{ flex: 1, padding: "8px", background: activeTab === "tiles" ? "#ddd" : "#fff" }}>Tiles</button>
        <button onClick={() => setActiveTab("characters")} style={{ flex: 1, padding: "8px", background: activeTab === "characters" ? "#ddd" : "#fff" }}>Characters</button>
        <button onClick={() => setActiveTab("structures")} style={{ flex: 1, padding: "8px", background: activeTab === "structures" ? "#ddd" : "#fff" }}>Items</button>
        <button onClick={() => setActiveTab("settings")} style={{ flex: 1, padding: "8px", background: activeTab === "settings" ? "#ddd" : "#fff" }}>Settings</button>
      </div>
      {activeTab === "tiles" && (
         <div className="w-48 bg-gray-800 text-white flex flex-col p-2 space-y-4">
         {/* Walls Section */}
         <div className="border-b border-gray-600 pb-2">
             <h3 className="text-center text-lg">Walls</h3>
             <div className="grid grid-cols-3 gap-1">
                 {Object.entries(tileCategories.walls).map(([tile, src]) => (
                     <button
                         key={tile}
                         className={`w-12 h-12 border ${activeTile === tile ? "border-yellow-500" : "border-gray-600"}`}
                         onClick={() => setActiveTile(tile)}
                     >
                         <img src={src} alt={tile} className="w-full h-full object-cover" />
                     </button>
                 ))}
             </div>
         </div>

         {/* Other Tiles Section */}
         <div className="border-b border-gray-600 pb-2">
             <h3 className="text-center text-lg">Other</h3>
             <div className="grid grid-cols-3 gap-1">
                 {Object.entries(tileCategories.other).map(([tile, src]) => (
                     <button
                         key={tile}
                         className={`w-12 h-12 border ${activeTile === tile ? "border-yellow-500" : "border-gray-600"}`}
                         onClick={() => setActiveTile(tile)}
                     >
                         <img src={src} alt={tile} className="w-full h-full object-cover" />
                     </button>
                 ))}
             </div>
         </div>

         {/* Eraser Section */}
         <div>
             <h3 className="text-center text-lg">Tools</h3>
             <div className="flex justify-center">
                 <button
                     className={`w-12 h-12 border ${activeTile === "eraser" ? "border-yellow-500" : "border-gray-600"}`}
                     onClick={() => setActiveTile("eraser")}
                 >
                     🧽
                 </button>
             </div>
         </div>
     </div>
      )}
      {activeTab === "characters" && (
        <div className="flex">
          {champions.map((char) => (
            <button key={char.id} onClick={() => addCharacter(char)} style={{ display: "block", width: "50%", padding: "10px", marginTop: "10px", cursor: "pointer" }}>
              <NextImage alt={char.name} src={`/characters/${char.class.toLowerCase()}.webp`} style={{ objectFit: "cover" }} width={100} height={100} />
              {char.name}
            </button>
          ))}
        </div>
      )}
      {activeTab === "structures" && (
        <div className="flex">
          <button onClick={() => addItem("/structures/item_001.webp", 1, 1)} style={{ display: "block", width: "50%", padding: "10px", marginTop: "10px", cursor: "pointer" }}>
            <NextImage src="/structures/item_001.webp" alt="Item Image" width={100} height={100} />Chest
          </button>
          <button onClick={() => addItem("/structures/item_002.webp", 2, 2)} style={{ display: "block", width: "50%", padding: "10px", marginTop: "10px", cursor: "pointer" }}>
            <NextImage src="/structures/item_002.webp" alt="Item Image" width={100} height={100} />Sword
          </button>
        </div>
      )}
      {activeTab === "settings" && (
        <div>
          <button
            onClick={() => setIsSavePopupOpen(true)}
          >
            Save Map
          </button>
          <button onClick={() => setIsLoadPopupOpen(true)}>Load Map</button>

        </div>
      )}
    </div>
  );
};

export default Sidebar;
