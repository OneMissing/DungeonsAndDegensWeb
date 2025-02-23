import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { createClient } from "@/lib/supabase/client";
import { Divider, Tooltip } from "@heroui/react";
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
    Shirt,
    Sword,
    Trash,
    Utensils,
    Wand,
    Wrench,
    Zap,
} from "lucide-react";
import { ItemEffect } from "@/lib/tools/types";

const supabase = createClient();
const fetchItemEffects = async (itemId: string): Promise<ItemEffect[]> => {
    const { data, error } = await supabase
        .from("item_effects")
        .select("*")
        .eq("item_id", itemId);

    if (error) {
        console.error("Error fetching item effects:", error);
        return [];
    }

    return data as ItemEffect[];
};

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

    const [itemEffects, setItemEffects] = useState<ItemEffect[]>([]);

    useEffect(() => {
        const fetchEffects = async () => {
            const effects = await fetchItemEffects(item.id);
            setItemEffects(effects);
        };

        fetchEffects();
    }, [item.id]);

    const getEffectColor = (effectType: string) => {
        const colorMap: { [key: string]: string } = {
            acid: "text-green-500",
            bludgeoning: "text-gray-700",
            cold: "text-blue-400",
            fire: "text-orange-500",
            force: "text-black-500",
            lightning: "text-yellow-300",
            necrotic: "text-black-900",
            piercing: "text-gray-700",
            poison: "text-lime-500",
            psychic: "text-pink-500",
            radiant: "text-yellow-200",
            slashing: "text-gray-700",
            thunder: "text-purple-600",
            healing: "text-green-300",
            armor_class: "text-gray-500",
        };

        return colorMap[effectType] || "text-white";
    };

    const renderEffect = (effect: ItemEffect) => {
        const effects = [];
        if (effect.acid_dice_count && effect.acid_dice_sides) {
            effects.push({
                type: "acid",
                text: `Acid Damage: ${effect.acid_dice_count}d${effect.acid_dice_sides}`,
            });
        }
        if (effect.bludgeoning_dice_count && effect.bludgeoning_dice_sides) {
            effects.push({
                type: "bludgeoning",
                text: `Bludgeoning Damage: ${effect.bludgeoning_dice_count}d${effect.bludgeoning_dice_sides}`,
            });
        }
        if (effect.cold_dice_count && effect.cold_dice_sides) {
            effects.push({
                type: "cold",
                text: `Cold Damage: ${effect.cold_dice_count}d${effect.cold_dice_sides}`,
            });
        }
        if (effect.fire_dice_count && effect.fire_dice_sides) {
            effects.push({
                type: "fire",
                text: `Fire Damage: ${effect.fire_dice_count}d${effect.fire_dice_sides}`,
            });
        }
        if (effect.force_dice_count && effect.force_dice_sides) {
            effects.push({
                type: "force",
                text: `Force Damage: ${effect.force_dice_count}d${effect.force_dice_sides}`,
            });
        }
        if (effect.lightning_dice_count && effect.lightning_dice_sides) {
            effects.push({
                type: "lightning",
                text: `Lightning Damage: ${effect.lightning_dice_count}d${effect.lightning_dice_sides}`,
            });
        }
        if (effect.necrotic_dice_count && effect.necrotic_dice_sides) {
            effects.push({
                type: "necrotic",
                text: `Necrotic Damage: ${effect.necrotic_dice_count}d${effect.necrotic_dice_sides}`,
            });
        }
        if (effect.piercing_dice_count && effect.piercing_dice_sides) {
            effects.push({
                type: "piercing",
                text: `Piercing Damage: ${effect.piercing_dice_count}d${effect.piercing_dice_sides}`,
            });
        }
        if (effect.poison_dice_count && effect.poison_dice_sides) {
            effects.push({
                type: "poison",
                text: `Poison Damage: ${effect.poison_dice_count}d${effect.poison_dice_sides}`,
            });
        }
        if (effect.psychic_dice_count && effect.psychic_dice_sides) {
            effects.push({
                type: "psychic",
                text: `Psychic Damage: ${effect.psychic_dice_count}d${effect.psychic_dice_sides}`,
            });
        }
        if (effect.radiant_dice_count && effect.radiant_dice_sides) {
            effects.push({
                type: "radiant",
                text: `Radiant Damage: ${effect.radiant_dice_count}d${effect.radiant_dice_sides}`,
            });
        }
        if (effect.slashing_dice_count && effect.slashing_dice_sides) {
            effects.push({
                type: "slashing",
                text: `Slashing Damage: ${effect.slashing_dice_count}d${effect.slashing_dice_sides}`,
            });
        }
        if (effect.thunder_dice_count && effect.thunder_dice_sides) {
            effects.push({
                type: "thunder",
                text: `Thunder Damage: ${effect.thunder_dice_count}d${effect.thunder_dice_sides}`,
            });
        }
        if (effect.healing_dice_count && effect.healing_dice_sides) {
            effects.push({
                type: "healing",
                text: `Healing: ${effect.healing_dice_count}d${effect.healing_dice_sides}`,
            });
        }
        if (effect.armor_class) {
            effects.push({
                type: "armor_class",
                text: `Armor Class: ${effect.armor_class}`,
            });
        }

        return effects.map((effect, index) => (
            <p key={index} className={getEffectColor(effect.type)}>
                {effect.text}
            </p>
        ));
    };

    return (
        <Tooltip
            offset={15}
            closeDelay={0}
            delay={0}
            placement='bottom'
            content={
                <div
                    className={`px-1 py-2 bg-white rounded-lg transition-opacity duration-300 w-full h-full select-none ${
                        isDragging ? "hidden pointer-events-none" : "visible"
                    }`}
                >
                    <div className='text-medium font-bold'>{item.name}</div>
                    <div className='text-small w-full p-2'>
                        <div className='flex justify-center gap-2'>
                            <p className='font-semibold'>Quantity: </p>{" "}
                            {item.quantity}
                        </div>
                        <div className='flex justify-center gap-2'>
                            <p className='font-semibold'>Type: </p> {item.type}
                        </div>
                        <div className='grid grid-cols-3 w-full'>
                            <div className='flex justify-end gap-4'>
                                <p className='font-semibold'>Value: </p>{" "}
                                {item.value}
                            </div>
                            <Divider
                                orientation='vertical'
                                className='w-[0.08rem] rounded bg-gray-400 mx-auto'
                            />
                            <div className='flex justify-start gap-4'>
                                <p className='font-semibold'>Weight: </p>{" "}
                                {item.weight}
                            </div>
                        </div>
                        {itemEffects.length > 0 && (
                            <div className='mt-1'>
                                <p className='font-bold'>Effects:</p>
                                {itemEffects.map((effect, index) => (
                                    <div key={index}>
                                        {renderEffect(effect)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className='group h-5 overflow-hidden transition-all duration-100 ease-in-out hover:h-full -mt-1'>
                        <div className=' font-semibold flex items-center justify-center overflow-hidden whitespace-nowrap'>
                            <p className='text-center font-semibold underline'>
                                Description:
                            </p>
                            <div className='flex space-x-1 group-hover:animate-none'>
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className='animate-fade-in-out font-bold group-hover:animate-none'
                                        style={{
                                            animationDelay: `${i * 0.5}s`,
                                        }}
                                    >
                                        .
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className='transition-opacity duration-300 w-96'>
                            {item.description}
                        </p>
                    </div>
                </div>
            }
        >
            <div
                ref={drag as unknown as React.Ref<HTMLDivElement>}
                className={`relative p-1 bg-gray-700 border border-gray-500 rounded cursor-move w-full h-full  ${
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
                    <Shirt className='w-full h-full' />
                ) : item.type === "cloak" ? (
                    <Feather className='w-full h-full' />
                ) : item.type === "tool" ? (
                    <Wrench className='w-full h-full' />
                ) : item.type === "currency" ? (
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
                {item.type != "weapon" && item.type != "armor" && (
                    <span className='absolute bottom-0 right-0 text-xs bg-black bg-opacity-70 text-white px-1 rounded'>
                        x{item.quantity}
                    </span>
                )}
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
                    ? "bg-red-300 bg-opacity-50 hover:border hover:bg-red-700 rounded-xl text-yellow-300 p-4"
                    : "bg-gray-800"
            } border border-gray-600 flex items-center justify-center`}
        >
            {tile.isTrash ? (
                <Trash className='w-full h-full' />
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
        chestplate: ["chestplate", "armor"],
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
                    throw new Error("Failed to update item position.");
                }
            } else {
                const { error: insertError } = await supabase
                    .from("inventory")
                    .insert({
                        character_id,
                        item_id: itemId,
                        position: updatedPosition,
                    });

                if (insertError) {
                    throw new Error("Failed to insert item.");
                }
            }

            return updatedPosition;
        } catch (err) {
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
        const intervalId = setInterval(loadInventory, 15000);
        return () => clearInterval(intervalId);
    }, [character_id]);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className=' items-center p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-lg w-full'>
                {error && <p className='text-red-500'>{error}</p>}
                <div className=' grid grid-cols-8 gap-4 w-full h-full'>
                    <div className='col-span-6'>
                        <div className='grid grid-cols-8 gap-1 border border-gray-600 p-2 bg-gray-700 rounded flex-grow'>
                            {grid
                                .slice(0, GRID_SIZE * GRID_SIZE)
                                .map((tile) => (
                                    <DroppableTile
                                        key={tile.id}
                                        tile={tile}
                                        moveItem={moveItem}
                                        grid={grid}
                                    />
                                ))}
                        </div>
                    </div>
                    <div className='col-span-2'>
                        <div className=' grid grid-cols-2 gap-1 border border-gray-600 p-2 bg-gray-700 rounded flex-grow'>
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
                            <div className='m-auto col-span-2'>
                                <DroppableTile
                                    tile={grid.find((tile) => tile.isTrash)!}
                                    moveItem={moveItem}
                                    grid={grid}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default Inventory;
