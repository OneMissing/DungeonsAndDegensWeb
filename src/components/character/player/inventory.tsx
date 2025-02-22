import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { createClient } from "@/lib/supabase/client";
import { Tooltip } from "@heroui/react";
import {
    Amphora,
    ArrowUp,
    BookOpen,
    Circle,
    Coins,
    Feather,
    Gem,
    Heart,
    Key,
    Lightbulb,
    Map,
    Scroll,
    Shield,
    Sword,
    Trash,
    Utensils,
    Wand,
    Wrench,
    Zap,
} from "lucide-react";

const supabase = createClient();

type Item = {
    id: string;
    name: string;
    quantity: number;
    description?: string;
    type?: string;
    weight?: number;
    value?: number;
};

type Tile = {
    id: string;
    item: Item | null;
    isTrash?: boolean;
    isSideSlot?: boolean;
    slotType?: string;
};

const GRID_SIZE = 8;
const ADDITIONAL_SLOTS = 6;
const TOTAL_SLOTS = GRID_SIZE * GRID_SIZE + ADDITIONAL_SLOTS;

const getSlotType = (index: number): string => {
    const slotTypes = [
        "helmet",
        "chestplate",
        "gauntlets",
        "boots",
        "weapon",
        "weapon",
    ];
    return slotTypes[index] || "weapon";
};

const initialGrid: Tile[] = Array.from({ length: TOTAL_SLOTS }, (_, index) => ({
    id: `tile-${index}`,
    item: null,
    isSideSlot: index >= GRID_SIZE * GRID_SIZE,
    slotType:
        index >= GRID_SIZE * GRID_SIZE
            ? getSlotType(index - GRID_SIZE * GRID_SIZE)
            : undefined,
}));

initialGrid.push({ id: "trash-tile", item: null, isTrash: true });

const ItemTypes = {
    ITEM: "item",
};

const DraggableItem: React.FC<{ item: Item }> = ({ item }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.ITEM,
        item: item,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <Tooltip
            offset={15}
            closeDelay={0}
            delay={0}
            placement='bottom'
            content={
                <div
                    className={`px-1 py-2 bg-white rounded-lg transition-opacity duration-300 ${
                        isDragging
                            ? "hidden pointer-events-none"
                            : "visible"
                    }`}
                >
                    <div className='text-small font-bold'>{item.name}</div>
                    <div className='text-tiny grid grid-cols-1 p-2'>
                        <p>Type: {item.type}</p>
                        <p>Description: {item.description}</p>
                        <p>
                            Value: {item.value} - Weight: {item.weight}
                        </p>
                    </div>
                </div>
            }
        >
            <div
                ref={drag as unknown as React.Ref<HTMLDivElement>}
                className={`relative p-1 bg-gray-700 border border-gray-500 rounded cursor-move ${
                    isDragging ? "opacity-50" : "opacity-100"
                }`}
            >
                {item.type === "weapon" || item.type === "sword" ? (
                    <Sword className='w-full h-full' />
                ) : item.type === "staff" || item.type === "wand" ? (
                    <Wand className='w-full h-full' />
                ) : item.type === "potion" ? (
                    <Amphora className='w-full h-full' />
                ) : item.type === "shield" ? (
                    <Shield className='w-full h-full' />
                ) : item.type === "bow" ? (
                    <ArrowUp className='w-full h-full' />
                ) : item.type === "ring" ? (
                    <Circle className='w-full h-full' />
                ) : item.type === "amulet" ? (
                    <Heart className='w-full h-full' />
                ) : item.type === "scroll" ? (
                    <Scroll className='w-full h-full' />
                ) : item.type === "book" ? (
                    <BookOpen className='w-full h-full' />
                ) : item.type === "food" ? (
                    <Utensils className='w-full h-full' />
                ) : item.type === "key" ? (
                    <Key className='w-full h-full' />
                ) : item.type === "gem" ? (
                    <Gem className='w-full h-full' />
                ) : item.type === "armor" ? (
                    <Shield className='w-full h-full' />
                ) : item.type === "cloak" ? (
                    <Feather className='w-full h-full' />
                ) : item.type === "tool" ? (
                    <Wrench className='w-full h-full' />
                ) : item.type === "coin" ? (
                    <Coins className='w-full h-full' />
                ) : item.type === "map" ? (
                    <Map className='w-full h-full' />
                ) : item.type === "lantern" ? (
                    <Lightbulb className='w-full h-full' />
                ) : item.type === "rune" ? (
                    <Zap className='w-full h-full' />
                ) : (
                    <img alt={item.name} className='w-full h-full' />
                )}
                <span className='absolute bottom-0 right-0 text-xs bg-black bg-opacity-70 text-white px-1 rounded'>
                    x{item.quantity}
                </span>
            </div>
        </Tooltip>
    );
};

const DroppableTile: React.FC<{
    tile: Tile;
    moveItem: (fromTileId: string, toTileId: string, item: Item) => void;
    grid: Tile[];
}> = ({ tile, moveItem, grid }) => {
    const [, drop] = useDrop({
        accept: ItemTypes.ITEM,
        drop: (draggedItem: Item) => {
            if (
                tile.isSideSlot &&
                !isValidItemTypeForSlot(tile.slotType, draggedItem.type)
            ) {
                return;
            }

            const fromTile = grid.find((t) => t.item?.id === draggedItem.id);
            if (fromTile) {
                moveItem(fromTile.id, tile.id, draggedItem);
            }
        },
    });

    return (
        <div
            ref={drop as unknown as React.Ref<HTMLDivElement>}
            className={`aspect-square ${
                tile.isTrash
                    ? "border-0 bg-red-300 bg-opacity-50 hover:border hover:bg-red-700 rounded-xl text-yellow-300"
                    : "bg-gray-800"
            } border border-gray-600 flex items-center justify-center`}
        >
            {tile.isTrash ? (
                <Trash className='w-1/2 h-1/2' />
            ) : (
                tile.item && <DraggableItem item={tile.item} />
            )}
        </div>
    );
};

const isValidItemTypeForSlot = (
    slotType: string | undefined,
    itemType: string | undefined
): boolean => {
    if (!slotType || !itemType) return false;

    const validItemTypes: { [key: string]: string[] } = {
        helmet: ["helmet"],
        chestplate: ["chestplate"],
        gauntlets: ["gauntlets"],
        boots: ["boots"],
        weapon: [
            "weapon",
            "sword",
            "bow",
            "knife",
            "polearm",
            "axe",
            "staff",
            "wand",
        ],
    };

    return validItemTypes[slotType]?.includes(itemType) || false;
};

const Inventory: React.FC<{ character_id: string }> = ({ character_id }) => {
    const [grid, setGrid] = useState<Tile[]>(initialGrid);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const findFirstAvailableTile = () => {
        for (let i = 0; i < grid.length; i++) {
            if (!grid[i].item && !grid[i].isTrash) {
                return i;
            }
        }
        return null;
    };

    const saveItemPosition = async (
        itemId: string,
        position: number | null
    ) => {
        let updatedPosition = position;

        if (updatedPosition === null) {
            updatedPosition = findFirstAvailableTile();
            if (updatedPosition === null) {
                throw new Error("No available slots in the inventory.");
            }
        }

        console.log("Saving item position:", {
            character_id,
            item_id: itemId,
            position: updatedPosition,
        });

        try {
            const { data: existingItem, error: fetchError } = await supabase
                .from("inventory")
                .select("*")
                .eq("character_id", character_id)
                .eq("item_id", itemId)
                .single();

            if (fetchError && fetchError.code !== "PGRST116") {
                console.error("Error fetching inventory item:", fetchError);
                throw new Error("Failed to fetch inventory item.");
            }

            if (existingItem) {
                const { error: updateError } = await supabase
                    .from("inventory")
                    .update({ position: updatedPosition })
                    .eq("character_id", character_id)
                    .eq("item_id", itemId);

                if (updateError) {
                    console.error("Error updating item position:", updateError);
                    throw new Error("Failed to update item position.");
                }

                console.log("Item position updated successfully.");
            } else {
                const { error: insertError } = await supabase
                    .from("inventory")
                    .insert({
                        character_id,
                        item_id: itemId,
                        position: updatedPosition,
                    });

                if (insertError) {
                    console.error("Error inserting item:", insertError);
                    throw new Error("Failed to insert item.");
                }

                console.log("Item inserted successfully.");
            }

            return updatedPosition;
        } catch (err) {
            console.error("Error in saveItemPosition:", err);
            throw new Error("Failed to save item position.");
        }
    };

    const loadInventory = async () => {
        setLoading(true);
        try {
            const { data: inventoryData, error: inventoryError } =
                await supabase
                    .from("inventory")
                    .select("*")
                    .eq("character_id", character_id);

            const { data: itemsData, error: itemsError } = await supabase
                .from("items")
                .select("*");

            if (inventoryError || itemsError) {
                setError("Error fetching inventory or items data.");
                console.error("Errors:", inventoryError, itemsError);
                return;
            }

            const updatedGrid = [...initialGrid];
            const usedPositions = new Set<number>();

            inventoryData.forEach((inventoryEntry) => {
                if (inventoryEntry.position !== null) {
                    const itemDetails = itemsData.find(
                        (item) => item.id === inventoryEntry.item_id
                    );
                    if (itemDetails) {
                        updatedGrid[inventoryEntry.position] = {
                            ...updatedGrid[inventoryEntry.position],
                            item: {
                                id: itemDetails.id,
                                name: itemDetails.name,
                                quantity: inventoryEntry.quantity,
                                description: itemDetails.description,
                                type: itemDetails.type,
                                weight: itemDetails.weight,
                                value: itemDetails.value,
                            },
                        };
                        usedPositions.add(inventoryEntry.position);
                    }
                }
            });

            inventoryData.forEach((inventoryEntry) => {
                if (inventoryEntry.position === null) {
                    const itemDetails = itemsData.find(
                        (item) => item.id === inventoryEntry.item_id
                    );
                    if (itemDetails) {
                        for (let i = 0; i < updatedGrid.length; i++) {
                            if (
                                !updatedGrid[i].item &&
                                !updatedGrid[i].isTrash &&
                                !usedPositions.has(i)
                            ) {
                                updatedGrid[i] = {
                                    ...updatedGrid[i],
                                    item: {
                                        id: itemDetails.id,
                                        name: itemDetails.name,
                                        quantity: inventoryEntry.quantity,
                                        description: itemDetails.description,
                                        type: itemDetails.type,
                                        weight: itemDetails.weight,
                                        value: itemDetails.value,
                                    },
                                };
                                usedPositions.add(i);
                                break;
                            }
                        }
                    }
                }
            });

            setGrid(updatedGrid);
        } catch (err) {
            setError("Unexpected error fetching data.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const moveItem = async (
        fromTileId: string,
        toTileId: string,
        item: Item
    ) => {
        const fromTile = grid.find((tile) => tile.id === fromTileId);
        const toTile = grid.find((tile) => tile.id === toTileId);

        if (toTile?.isTrash) {
            try {
                const { error: deleteError } = await supabase
                    .from("inventory")
                    .delete()
                    .eq("character_id", character_id)
                    .eq("item_id", item.id);

                if (deleteError) {
                    throw new Error("Failed to delete item from the database.");
                }

                const updatedGrid = grid.map((tile) => {
                    if (tile.id === fromTileId) {
                        return { ...tile, item: null };
                    }
                    return tile;
                });

                setGrid(updatedGrid);
                console.log("Item deleted successfully.");
            } catch (err) {
                setError("Failed to delete item from inventory.");
                console.error(err);
            }
            return;
        }

        if (toTile?.item) {
            return;
        }

        const updatedGrid = grid.map((tile) => {
            if (tile.id === fromTileId) {
                return { ...tile, item: null };
            }
            if (tile.id === toTileId) {
                return { ...tile, item };
            }
            return tile;
        });

        setGrid(updatedGrid);

        const toTileIndex = grid.findIndex((tile) => tile.id === toTileId);
        await saveItemPosition(item.id, toTileIndex);
    };

    useEffect(() => {
        loadInventory();
    }, [character_id]);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className='flex flex-col items-center p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-lg w-full'>
                {loading && <p>Loading...</p>}
                {error && <p className='text-red-500'>{error}</p>}
                <div className='flex gap-4 w-full h-full'>
                    <div className='grid grid-cols-8 gap-1 border border-gray-600 p-2 bg-gray-700 rounded flex-grow'>
                        {grid.slice(0, GRID_SIZE * GRID_SIZE).map((tile) => (
                            <DroppableTile
                                key={tile.id}
                                tile={tile}
                                moveItem={moveItem}
                                grid={grid}
                            />
                        ))}
                    </div>

                    <div className='grid grid-cols-2 gap-1 border border-gray-600 p-2 bg-gray-700 rounded h-full -auto'>
                        {grid
                            .slice(GRID_SIZE * GRID_SIZE, TOTAL_SLOTS)
                            .map((tile) => (
                                <DroppableTile
                                    key={tile.id}
                                    tile={tile}
                                    moveItem={moveItem}
                                    grid={grid}
                                />
                            ))}
                        <div className='mt-20 m-auto col-span-2'>
                            <DroppableTile
                                tile={grid.find((tile) => tile.isTrash)!}
                                moveItem={moveItem}
                                grid={grid}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default Inventory;