import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { createClient } from "@/lib/supabase/client";
import { Tooltip } from "@heroui/react";

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
};

const GRID_SIZE = 8;
const ADDITIONAL_SLOTS = 6;
const TOTAL_SLOTS = GRID_SIZE * GRID_SIZE + ADDITIONAL_SLOTS; 

const initialGrid: Tile[] = Array.from({ length: TOTAL_SLOTS }, (_, index) => ({
    id: `tile-${index}`,
    item: null,
}));

const ItemTypes = {
    ITEM: "item",
};

// Draggable Item Component
const DraggableItem: React.FC<{ item: Item }> = ({ item }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.ITEM,
        item: item, // Pass the entire item object
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <Tooltip
            content={`Name: ${item.name} \nQuantity: ${item.quantity} \nType: ${
                item.type || "Unknown"
            } \nWeight: ${item.weight || "Unknown"} \nValue: ${
                item.value || "Unknown"
            } \nDescription: ${item.description || "No description available"}`}
        >
            <div
                ref={drag as unknown as React.Ref<HTMLDivElement>}
                className={`relative p-1 bg-gray-700 border border-gray-500 rounded cursor-move ${
                    isDragging ? "opacity-50" : "opacity-100"
                }`}
            >
                <img alt={item.name} className='w-12 h-12' />
                <span className='absolute bottom-0 right-0 text-xs bg-black bg-opacity-70 text-white px-1 rounded'>
                    x{item.quantity}
                </span>
            </div>
        </Tooltip>
    );
};

// Droppable Tile Component
const DroppableTile: React.FC<{
    tile: Tile;
    moveItem: (fromTileId: string, toTileId: string, item: Item) => void;
    grid: Tile[]; 
}> = ({ tile, moveItem, grid }) => {
    const [, drop] = useDrop({
        accept: ItemTypes.ITEM,
        drop: (draggedItem: Item) => {
            const fromTile = grid.find((t) => t.item?.id === draggedItem.id);
            if (fromTile) {
                moveItem(fromTile.id, tile.id, draggedItem); 
            }
        },
    });

    return (
        <div
            ref={drop as unknown as React.Ref<HTMLDivElement>}
            className='w-16 h-16 bg-gray-800 border border-gray-600 flex items-center justify-center'
        >
            {tile.item && <DraggableItem item={tile.item} />}
        </div>
    );
};

const Inventory: React.FC<{ character_id: string }> = ({ character_id }) => {
    const [grid, setGrid] = useState<Tile[]>(initialGrid);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const moveItem = (fromTileId: string, toTileId: string, item: Item) => {
        const fromTile = grid.find((tile) => tile.id === fromTileId);
        const toTile = grid.find((tile) => tile.id === toTileId);
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
    };

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const [
                    { data: inventoryData, error: inventoryError },
                    { data: itemsData, error: itemsError },
                ] = await Promise.all([
                    supabase
                        .from("inventory")
                        .select("*")
                        .eq("character_id", character_id),
                    supabase.from("items").select("*"),
                ]);

                if (inventoryError || itemsError) {
                    setError("Error fetching inventory or items data.");
                    console.error("Errors:", inventoryError, itemsError);
                    return;
                }
                const updatedGrid = initialGrid.map((tile, index) => {
                    const inventoryEntry = inventoryData[index];
                    if (inventoryEntry) {
                        const itemDetails = itemsData.find(
                            (item) => item.id === inventoryEntry.item_id
                        );
                        if (itemDetails) {
                            return {
                                ...tile,
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
                        }
                    }
                    return tile;
                });

                setGrid(updatedGrid);
            } catch (err) {
                setError("Unexpected error fetching data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [character_id]);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className='flex flex-col items-center p-4 bg-gray-900 bg-opacity-80 border border-gray-700 rounded-lg shadow-lg'>
                {loading && <p>Loading...</p>}
                {error && <p className='text-red-500'>{error}</p>}
                <div className='flex gap-4'>
                    <div className='grid grid-cols-8 gap-1 border border-gray-600 p-2 bg-gray-700 rounded'>
                        {grid.slice(0, GRID_SIZE * GRID_SIZE).map((tile) => (
                            <DroppableTile
                                key={tile.id}
                                tile={tile}
                                moveItem={moveItem}
                                grid={grid} 
                            />
                        ))}
                    </div>

                    <div className='grid grid-cols-2 gap-1 border border-gray-600 p-2 bg-gray-700 rounded'>
                        {grid.slice(GRID_SIZE * GRID_SIZE).map((tile) => (
                            <DroppableTile
                                key={tile.id}
                                tile={tile}
                                moveItem={moveItem}
                                grid={grid} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default Inventory;