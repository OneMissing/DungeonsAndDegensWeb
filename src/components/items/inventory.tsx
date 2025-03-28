"use client";

import { useEffect, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { createClient } from "@/lib/supabase/client";
import { Item, Tile, InventoryItem, itemFilter, uniqueInstanceTypes } from "@/lib/tools/types";
import { Amphora, ArrowRightFromLine, Book, Circle, Coins, FileQuestion, Ham, Heart, Key, Scroll, Shield, Shirt, Sword, SwordIcon, Trash, Wand, Wrench } from "lucide-react";
import { Divider, Tooltip } from "@heroui/react";
import Slider from "../ui/slider";
import { weaponRoll } from "@/lib/rolling/damageRoll";
import { usePopup } from "@/components/dices/dicePopup";
import DecorativeLine from "../ui/decorativeLine";

const supabase = createClient();

const GRID_SIZE = 8;
const ADDITIONAL_SLOTS = 10;
const TOTAL_SLOTS = GRID_SIZE * GRID_SIZE + ADDITIONAL_SLOTS;

const shitCat = (item: string): string => {
  const categories: Record<string, string[]> = {
    helmet: ["helmet", "hat", "cap", "light helmet", "light hat", "light cap", "heavy helmet", "heavy hat", "heavy cap"],
    chestplate: ["light chestplate", "chestplate", "armor", "heavy chestplate", "heavy armor"],
    gauntlets: ["light gauntlets", "gauntlets", "heavy gauntlets"],
    boots: ["light boots", "boots", "heavy boots"],
    weapon: ["weapon", "sword", "bow", "knife", "polearm", "axe", "staff", "wand", "shield", "dagger", "scythe"],
    potion: ["potion"],
    food: ["food", "meal"],
    currency: ["currency", "gem"],
    tool: ["tool"],
    book: ["book", "spellbook"],
    misc: ["misc"],
  };

  for (const category in categories) {
    if (categories[category].includes(item)) return category;
  }

  return "misc";
};

const isValidItemTypeForSlot = (slotType: string | undefined, itemType: string | undefined): boolean => {
  if (!slotType || !itemType) return false;

  const validItemTypes: { [key: string]: string[] } = {
    helmet: ["helmet", "hat", "cap", "light helmet", "light hat", "light cap", "heavy helmet", "heavy hat", "heavy cap"],
    chestplate: ["light chestplate", "chestplate", "armor", "heavy chestplate", "heavy armor"],
    gauntlets: ["light gauntlets", "gauntlets", "heavy gauntlets"],
    boots: ["light boots", "boots", "heavy boots"],
    weapon: ["weapon", "sword", "bow", "knife", "polearm", "axe", "staff", "wand", "shield"],
  };

  return validItemTypes[slotType]?.includes(itemType) || false;
};

const getSlotType = (index: number): string => {
  const slotTypes = ["helmet", "chestplate", "gauntlets", "boots", "cape", "amulet", "ring", "ring", "weapon", "weapon"];
  return slotTypes[index] || "weapon";
};

const initialGrid: Tile[] = Array.from({ length: TOTAL_SLOTS }, (_, index) => ({
  id: `tile-${index}`,
  position: index,
  item: undefined,
  isSideSlot: index >= GRID_SIZE * GRID_SIZE,
  slotType: index >= GRID_SIZE * GRID_SIZE ? getSlotType(index - GRID_SIZE * GRID_SIZE) : undefined,
}));

initialGrid.push({ id: "trash-tile", position: TOTAL_SLOTS, item: undefined, isTrash: true });

const ContextMenu: React.FC<{
  currentItemInfo: Item;
  item: InventoryItem;
  position: { x: number; y: number };
  onClose: () => void;
  onAction: (action: string) => void;
}> = ({ item, position, onClose, onAction, currentItemInfo }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleAction = (action: string) => {
    onAction(action);
    onClose();
  };

  const [dropSliderValue, setDropSliderValue] = useState<number>(1);
  const [addSliderValue, setAddSliderValue] = useState<number>(1);
  return (
    <div id="contextMenu" ref={menuRef} className={`fixed z-[40000] pointer-events-none`} style={{ left: position.x - 80, top: position.y }}>
      <div className="pointer-events-auto relative bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg w-40 p-2 z-[40001]">
        <div className={`grid ${uniqueInstanceTypes.includes(currentItemInfo.type) ? "grid-rows-6" : "grid-rows-8"}`}>
          <button className="text-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-1" onClick={() => handleAction("use 1")}>
            Use
          </button>
          <Divider className="my-2" />
          <Slider min={1} max={item.quantity} value={dropSliderValue} onChange={setDropSliderValue} />
          <button className="text-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-1 mt-1" onClick={() => handleAction(`drop ${dropSliderValue}`)}>
            Drop {dropSliderValue}
          </button>
          <Divider className="my-2" />
          {!uniqueInstanceTypes.includes(currentItemInfo.type) && <Slider min={1} max={99} value={addSliderValue} onChange={setAddSliderValue} />}
          {!uniqueInstanceTypes.includes(currentItemInfo.type) && (
            <button className="text-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-1 mt-1" onClick={() => handleAction(`add ${addSliderValue}`)}>
              Add {addSliderValue}
            </button>
          )}
          {!uniqueInstanceTypes.includes(currentItemInfo.type) && <Divider className="my-2" />}
          <button className="text-center text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-1 -mt-1" onClick={() => handleAction(`close`)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DraggableItem: React.FC<{
  item: InventoryItem;
  onItemRemoved: (itemId: string) => void;
  onQuantityChanged: (itemId: string, newQuantity: number) => void;
  fromTileId: string;
  items: Item[];
  character_id: string;
}> = ({ item, onItemRemoved, onQuantityChanged, fromTileId, items, character_id }) => {
  const { showPopup } = usePopup();
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ show: boolean; position: { x: number; y: number } }>({
    show: false,
    position: { x: 0, y: 0 },
  });
  const [{ isDragging }, drag] = useDrag({
    type: "ITEM",
    item: { ...item, fromTileId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const currentItemInfo = itemFilter(items, item.item_id);
  let typeSpecificContent;
  if (!currentItemInfo) return <></>;
  switch (shitCat(currentItemInfo.type)) {
    case "weapon":
    case "sword":
      typeSpecificContent = <Sword className="w-full h-full" />;
      break;
    case "wand":
      typeSpecificContent = <Wand className="w-full h-full" />;
      break;
    case "chestplate":
      typeSpecificContent = <Shirt className="w-full h-full" />;
      break;
    case "potion":
      typeSpecificContent = <Amphora className="w-full h-full" />;
      break;
    case "shield":
      typeSpecificContent = <Shield className="w-full h-full" />;
      break;
    case "bow":
      typeSpecificContent = <ArrowRightFromLine className="w-full h-full" />;
      break;
    case "ring":
      typeSpecificContent = <Circle className="w-full h-full" />;
      break;
    case "necklece":
      typeSpecificContent = <Heart className="w-full h-full" />;
      break;
    case "scroll":
      typeSpecificContent = <Scroll className="w-full h-full" />;
      break;
    case "book":
      typeSpecificContent = <Book className="w-full h-full" />;
      break;
    case "food":
      typeSpecificContent = <Ham className="w-full h-full" />;
      break;
    case "key":
      typeSpecificContent = <Key className="w-full h-full" />;
      break;
    case "tool":
      typeSpecificContent = <Wrench className="w-full h-full" />;
      break;
    case "currency":
      typeSpecificContent = <Coins className="w-full h-full" />;
      break;
    default:
      typeSpecificContent = <FileQuestion className="w-full h-full" />;
      break;
  }

  const handleContextMenu = (event: { preventDefault: () => void; clientX: any; clientY: any }) => {
    event.preventDefault();
    setContextMenu({
      show: true,
      position: { x: event.clientX, y: event.clientY },
    });
  };

  const handleContextMenuAction = async (action: any) => {
    const result = action.trim().split(/\s+/).slice(0, 2);
    const amount = parseInt(result[1], 10);

    if (result[0] === "drop") {
      const newQuantity = item.quantity - amount;
      if (newQuantity === 0) {
        await supabase.from("inventory").delete().eq("character_id", character_id).eq("inventory_id", item.inventory_id);
        onItemRemoved(item.inventory_id);
      } else {
        await supabase.from("inventory").update({ quantity: newQuantity }).eq("inventory_id", item.inventory_id);
        onQuantityChanged(item.inventory_id, newQuantity);
      }
    } else if (result[0] === "add") {
      const newQuantity = item.quantity + amount;
      await supabase.from("inventory").update({ quantity: newQuantity }).eq("inventory_id", item.inventory_id);
      onQuantityChanged(item.inventory_id, newQuantity);
    } else if (result[0] === "use" && (currentItemInfo.type === "weapon" || currentItemInfo.type === "potion")) {
      showPopup(weaponRoll(currentItemInfo));
    }
  };

  const effectsMap = new Map([
    ["Acid", currentItemInfo.damage_acid],
    ["Bludgeoning", currentItemInfo.damage_bludgeoning],
    ["Cold", currentItemInfo.damage_cold],
    ["Fire", currentItemInfo.damage_fire],
    ["Force", currentItemInfo.damage_force],
    ["Lightning", currentItemInfo.damage_lightning],
    ["Necrotic", currentItemInfo.damage_necrotic],
    ["Piercing", currentItemInfo.damage_piercing],
    ["Poison", currentItemInfo.damage_poison],
    ["Psychic", currentItemInfo.damage_psychic],
    ["Radiant", currentItemInfo.damage_radiant],
    ["Slashing", currentItemInfo.damage_slashing],
    ["Thunder", currentItemInfo.damage_thunder],
    ["Heal", currentItemInfo.heal],
    ["AC", currentItemInfo.armor_class],
  ]);

  return (
    <>
      <Tooltip
        offset={4}
        closeDelay={0}
        delay={0}
        placement="bottom"
        className="pointer-events-none transition-all duration-500 ease-in-out"
        onMouseEnter={() => setIsTooltipVisible(false)}
        content={
          isTooltipVisible && (
            <div
              className={`backdrop-blur-sm bg-opacity-90  dark:bg-opacity-90 px-1 py-2 bg-2-light dark:bg-slate-700 border border-bg1-dark dark:border-bg1-light rounded-lg w-full h-full select-none ${
                isDragging ? "hidden" : "visible"
              }`}>
              <div className="text-medium font-bold">{currentItemInfo.name}</div>
              <div className="-mb-4 -mt-4 px-4">
                <DecorativeLine />
              </div>
              <div className="text-small w-full p-2">

                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    {!uniqueInstanceTypes.includes(currentItemInfo.type) ? 
                    (<><p className="font-semibold">Quantity:</p> <span>{item.quantity}</span> </>) : 
                    <span className="italic font-semibold">Unique Item</span>}
                  </div>

                  <div className="flex items-center gap-2 justify-center">
                    <p className="font-semibold">Type:</p>
                    <span>{shitCat(currentItemInfo.type)}</span>
                  </div>

                  <div className="flex items-center gap-2 justify-center">
                    <p className="font-semibold">Value:</p>
                    <span>{currentItemInfo.value}</span>
                  </div>

                  <div className="flex items-center gap-2 justify-center">
                    <p className="font-semibold">Weight:</p>
                    <span>{currentItemInfo.weight}</span>
                  </div>
                </div>
              </div>
              <div className="group overflow-hidden transition-all duration-100 ease-in-out -mt-1">
                <div className=" font-semibold flex items-center justify-center overflow-hidden whitespace-nowrap">
                  <p className="text-center font-semibold">Description:</p>
                </div>
                <p className="transition-opacity duration-300 w-96">{currentItemInfo.description}</p>
              </div>

              <div>
                {![...effectsMap.values()].every((value) => !value) && <p className="text-center font-semibold mb-2">Effects:</p>}
                <div className="grid grid-cols-6 gap-2">
                  {(() => {
                    const effects: React.ReactNode[] = [];
                    let effectCount = 0;

                    effectsMap.forEach((value) => {
                      if (value) effectCount++;
                    });

                    let currentIndex = 0;
                    effectsMap.forEach((value, key) => {
                      if (value) {
                        currentIndex++;
                        let colSpanClass = "";
                        if (effectCount === 1) colSpanClass = "col-span-6 justify-self-center";
                        else {
                          const remainder = effectCount % 3;
                          if (remainder === 1 && currentIndex === effectCount) colSpanClass = "col-span-6 justify-self-center";
                          else if (remainder === 2 && currentIndex >= effectCount - 1) colSpanClass = "col-span-3 justify-self-center";
                          else colSpanClass = "col-span-2 justify-self-center";
                        }

                        effects.push(
                          <div key={key} className={`flex justify-between gap-2 px-2 ${colSpanClass}`}>
                            <p className="font-semibold">{key}:</p>
                            <p>{value}</p>
                          </div>
                        );
                      }
                    });

                    return effects;
                  })()}
                </div>
              </div>
            </div>
          )
        }>
        <div
          ref={drag as unknown as React.Ref<HTMLDivElement>}
          className={`relative p-1 bg-3-light dark:bg-3-dark border border-gray-500 rounded cursor-move w-full h-full ${isDragging ? "opacity-50" : "opacity-100"}`}
          onMouseEnter={() => setIsTooltipVisible(true)}
          onContextMenu={handleContextMenu}>
          {typeSpecificContent}
          {!uniqueInstanceTypes.includes(currentItemInfo.type) && (
            <span className="absolute bottom-0 right-0 text-xs bg-black bg-opacity-70 text-white px-1 rounded">x{item.quantity}</span>
          )}
        </div>
      </Tooltip>
      {contextMenu.show && (
        <ContextMenu
          item={item}
          position={contextMenu.position}
          onClose={() => setContextMenu({ show: false, position: { x: 0, y: 0 } })}
          onAction={handleContextMenuAction}
          currentItemInfo={currentItemInfo}
        />
      )}
    </>
  );
};

const DroppableTile: React.FC<{
  tile: Tile;
  moveItem: (fromTileId: string, toTileId: string, item: InventoryItem) => void;
  onItemRemoved: (itemId: string) => void;
  onQuantityChanged: (itemId: string, newQuantity: number) => void;
  items: Item[];
  character_id: string;
}> = ({ tile, moveItem, onItemRemoved, onQuantityChanged, items, character_id }) => {
  const [{ isOver, canDrop }, drop] = useDrop<InventoryItem & { fromTileId: string }, void, { isOver: boolean; canDrop: boolean }>({
    accept: "ITEM",
    drop: (draggedItem) => {
      if (!draggedItem.fromTileId || !tile.id) {
        console.error("Missing tile ID or fromTileId:", { draggedItem, tile });
        return;
      }
      moveItem(draggedItem.fromTileId, tile.id, draggedItem);
    },
    canDrop: (draggedItem) => {
      return tile.id !== String(draggedItem.position) && !tile.item;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <div
      onContextMenu={(event) => {
        event.preventDefault();
      }}
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className={`aspect-square ${
        tile.isTrash
          ? "align-middle bg-red-400 bg-opacity-80 dark:bg-opacity-80 hover:border rounded-xl text-yellow-300 p-4"
          : "bg-2-light dark:bg-2-dark shadow-xs shadow-3-dark dark:shadow-3-light rounded"
      } border border-gray-600 flex items-center justify-center`}>
      {tile.item && (
        <DraggableItem item={tile.item} onItemRemoved={onItemRemoved} onQuantityChanged={onQuantityChanged} fromTileId={tile.id} items={items} character_id={character_id} />
      )}
      {tile.isTrash && <Trash />}
    </div>
  );
};

const Inventory: React.FC<{
  character_id: string;
  grid: Tile[];
  setGrid: (grid: Tile[]) => void;
  items: Item[];
}> = ({ character_id, grid, setGrid, items }) => {
  const [error, setError] = useState<string | null>(null);

  const handleItemRemoved = (itemId: string) => {
    const updatedGrid = grid.map((tile) => {
      if (tile.item?.inventory_id === itemId) {
        return { ...tile, item: undefined };
      }
      return tile;
    });
    setGrid(updatedGrid);
  };

  const handleQuantityChanged = (itemId: string, newQuantity: number) => {
    const updatedGrid = grid.map((tile) => {
      if (tile.item?.inventory_id === itemId) {
        return { ...tile, item: { ...tile.item, quantity: newQuantity } };
      }
      return tile;
    });
    setGrid(updatedGrid);
  };

  const moveItem = async (fromTileId: string, toTileId: string, item: InventoryItem) => {
    const fromTile = grid.find((tile) => tile.id === fromTileId);
    const toTile = grid.find((tile) => tile.id === toTileId);
    const currentItemInfo = itemFilter(items, item.item_id);
    if (!fromTile || !toTile || !currentItemInfo) return;
    if (toTile.isSideSlot && !isValidItemTypeForSlot(toTile.slotType, currentItemInfo.type)) return;
    if (toTile.isTrash) {
      try {
        await supabase.from("inventory").delete().eq("character_id", character_id).eq("inventory_id", item.inventory_id);
        setGrid(
          grid.map((tile) => {
            if (tile.id === fromTileId) return { ...tile, item: null };
            return tile;
          })
        );
      } catch (err) {
        setError("Failed to delete item from inventory.");
        console.error(err);
      }
      return;
    }

    if (toTile.item) {
      const updatedGrid = [...grid];
      const fromIndex = grid.findIndex((tile) => tile.id === fromTileId);
      const toIndex = grid.findIndex((tile) => tile.id === toTileId);
      [updatedGrid[fromIndex].item, updatedGrid[toIndex].item] = [updatedGrid[toIndex].item, updatedGrid[fromIndex].item];
      setGrid([...updatedGrid]);
      await supabase.from("inventory").update({ position: toTile.position }).eq("inventory_id", item.inventory_id);
      await supabase.from("inventory").update({ position: fromTile.position }).eq("inventory_id", toTile.item.inventory_id);
      return;
    }

    setGrid(
      grid.map((tile) => {
        if (tile.id === fromTileId) return { ...tile, item: undefined };
        if (tile.id === toTileId) return { ...tile, item };
        return tile;
      })
    );
    await supabase.from("inventory").update({ position: toTile.position }).eq("character_id", character_id).eq("inventory_id", item.inventory_id);
  };

  return (
<DndProvider backend={HTML5Backend}>
      <div
        className="rounded-lg w-full lg:h-full flex flex-col sm:flex-row gap-2 sm:gap-4"
        onContextMenu={(event) => {
          event.preventDefault();
        }}>
        {error && <p className="text-red-500">{error}</p>}
        {/* Main Grid */}
        <div className="flex-grow ">
          <div className="grid grid-cols-8  gap-0 sm:gap-0.5 md:gap-1 xl:gap-2 aspect-square rounded sm:p-2 bg-3-light dark:bg-3-dark">
            {grid.slice(0, GRID_SIZE * GRID_SIZE).map((tile) => (
              <DroppableTile
                key={tile.id}
                tile={tile}
                character_id={character_id}
                moveItem={moveItem}
                onItemRemoved={handleItemRemoved}
                onQuantityChanged={handleQuantityChanged}
                items={items}
              />
            ))}
          </div>
        </div>

        {/* Side Slots */}
        <div className="sm:w-1/4 w-full">
          <div className="grid grid-cols-5 sm:grid-cols-2 gap-0 sm:gap-2 bg-3-light  dark:bg-3-dark h-fit border border-gray-600 rounded p-2">
            {grid.slice(GRID_SIZE * GRID_SIZE, TOTAL_SLOTS).map((tile) => (
              <DroppableTile
                key={tile.id}
                tile={tile}
                character_id={character_id}
                moveItem={moveItem}
                onItemRemoved={handleItemRemoved}
                onQuantityChanged={handleQuantityChanged}
                items={items}
              />
            ))}
            <div className="col-span-1">
              <DroppableTile
                tile={grid.find((tile) => tile.isTrash)!}
                moveItem={moveItem}
                onItemRemoved={handleItemRemoved}
                onQuantityChanged={handleQuantityChanged}
                items={items}
                character_id={character_id}
              />
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Inventory;
