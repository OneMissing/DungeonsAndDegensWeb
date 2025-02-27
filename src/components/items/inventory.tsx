"use client";

import { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const GRID_SIZE = 8; // 8x8 grid
const ADDITIONAL_SLOTS = 6; // Additional slots for side panel
const TOTAL_SLOTS = GRID_SIZE * GRID_SIZE + ADDITIONAL_SLOTS; // Total slots including side panel

interface Item {
	item_id: string;
	name: string;
	type: string;
	weight: number;
	value: number;
	damage_acid?: string;
	damage_fire?: string;
	damage_ice?: string;
	damage_piercing?: string;
	heal?: string;
	armor_class?: string;
}

interface InventoryItem {
	inventory_id: string;
	character_id: string;
	item_id: string;
	quantity: number;
	position: number;
	item: Item;
}

interface Tile {
	id: string;
	position: number;
	item?: InventoryItem; // item is either InventoryItem or undefined
	isSideSlot?: boolean;
	isTrash?: boolean;
	slotType?: string;
}

const ItemTypes = {
	ITEM: "item",
};

const initialGrid: Tile[] = Array.from({ length: TOTAL_SLOTS }, (_, index) => ({
	id: `tile-${index}`,
	position: index,
	item: undefined, // Initialize item as undefined instead of null
	isSideSlot: index >= GRID_SIZE * GRID_SIZE,
}));

initialGrid.push({ id: "trash-tile", position: TOTAL_SLOTS, item: undefined, isTrash: true });

const DraggableItem: React.FC<{ item: InventoryItem; onItemRemoved: (itemId: string) => void; onQuantityChanged: (itemId: string, newQuantity: number) => void; fromTileId: string }> = ({
	item,
	onItemRemoved,
	onQuantityChanged,
	fromTileId ,
}) => {
	const [{ isDragging }, drag] = useDrag({
        type: "ITEM", 
        item: { ...item, fromTileId  },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });


	return (
		<div
			ref={drag as unknown as React.Ref<HTMLDivElement>}
			className={`relative p-1 bg-3-light dark:bg-3-dark border border-gray-500 rounded cursor-move w-full h-full ${isDragging ? "opacity-50" : "opacity-100"}`}
		>
			<span className="absolute bottom-0 right-0 text-xs bg-black bg-opacity-70 text-white px-1 rounded">x{item.quantity}</span>
		</div>
	);
};

const DroppableTile: React.FC<{
	tile: Tile;
	moveItem: (fromTileId: string, toTileId: string, item: InventoryItem) => void;
	onItemRemoved: (itemId: string) => void;
	onQuantityChanged: (itemId: string, newQuantity: number) => void;
}> = ({ tile, moveItem, onItemRemoved, onQuantityChanged }) => {
	const [{ isOver, canDrop }, drop] = useDrop<InventoryItem & { fromTileId: string }, void, { isOver: boolean; canDrop: boolean }>({
		accept: "ITEM",
		drop: (draggedItem) => {
			console.log("Dropped item:", draggedItem, "on tile:", tile);
	
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
			ref={drop as unknown as React.Ref<HTMLDivElement>}
			className={`aspect-square ${tile.isTrash ? "bg-red-400 bg-opacity-80 dark:bg-opacity-80 hover:border rounded-xl text-yellow-300 p-4" : "bg-2-light dark:bg-2-dark shadow-xs shadow-3-dark dark:shadow-3-light"} border border-gray-600 flex items-center justify-center rounded-lg`}
		>
			{tile.item && <DraggableItem item={tile.item} onItemRemoved={onItemRemoved} onQuantityChanged={onQuantityChanged} fromTileId={tile.id} />}
		</div>
	);
};

const Inventory: React.FC<{ character_id: string }> = ({ character_id }) => {
	const [grid, setGrid] = useState<Tile[]>(initialGrid);
	const [error, setError] = useState<string | null>(null);

	const loadInventory = async () => {
		try {
			const { data: inventoryData, error: inventoryError } = await supabase.from("inventory").select("*").eq("character_id", character_id);

			if (inventoryError) {
				setError("Error fetching inventory data.");
				return;
			}

			const updatedGrid = [...initialGrid];
			inventoryData.forEach((inventoryEntry) => {
				const tile = updatedGrid.find((tile) => tile.position === inventoryEntry.position);
				if (tile) {
					tile.item = inventoryEntry; 
				}
			});

			setGrid(updatedGrid);
		} catch (err) {
			setError("Unexpected error fetching data.");
			console.error(err);
		}
	};

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
		if (!fromTile || !toTile) return;

		if (toTile.isTrash) {
			try {
				await supabase.from("inventory").delete().eq("character_id", character_id).eq("inventory_id", item.inventory_id);
				setGrid((prevGrid) =>
					prevGrid.map((tile) => (tile.item?.inventory_id === item.inventory_id ? { ...tile, item: undefined } : tile))
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
		
			await supabase
				.from("inventory")
				.update({ position: toTile.position })
				.eq("inventory_id", item.inventory_id);
		
			await supabase
				.from("inventory")
				.update({ position: fromTile.position })
				.eq("inventory_id", toTile.item.inventory_id);
		
			return;
		}
		

		const updatedGrid = grid.map((tile) => {
			if (tile.id === fromTileId) {
				return { ...tile, item: undefined }; 
			}
			if (tile.id === toTileId) {
				return { ...tile, item }; 
			}
			return tile;
		});

		console.log(updatedGrid)

		setGrid(updatedGrid);

		await supabase
			.from("inventory")
			.update({ position: toTile.position })
			.eq("character_id", character_id)
			.eq("inventory_id", item.inventory_id);
	};

	useEffect(() => {
		loadInventory();
	}, [character_id]);

	return (
		<DndProvider backend={HTML5Backend}>
			<div className="rounded-lg w-full h-auto">
				{error && <p className="text-red-500">{error}</p>}
				<div className="grid grid-cols-8 gap-4 sm:gap-0 w-full h-full">
					<div className="col-span-6 h-full">
						<div className="grid grid-cols-8 gap-1 md:gap-2 border border-gray-600 p-0 md:p-2 bg-3-light dark:bg-3-dark rounded flex-grow h-full">
							{grid.slice(0, GRID_SIZE * GRID_SIZE).map((tile) => (
								<DroppableTile
									key={tile.id}
									tile={tile}
									moveItem={moveItem}
									onItemRemoved={handleItemRemoved}
									onQuantityChanged={handleQuantityChanged}
								/>
							))}
						</div>
					</div>
					<div className="col-span-2 h-full bg-3-light dark:bg-3-dark border border-gray-600 ml-0 sm:ml-3 rounded">
						<div className="grid grid-cols-2 gap-1 md:gap-2 p-0 md:p-2 rounded flex-grow">
							{grid.slice(GRID_SIZE * GRID_SIZE, TOTAL_SLOTS).map((tile) => (
								<DroppableTile
									key={tile.id}
									tile={tile}
									moveItem={moveItem}
									onItemRemoved={handleItemRemoved}
									onQuantityChanged={handleQuantityChanged}
								/>
							))}
							<div className="m-auto col-span-2">
								<DroppableTile
									tile={grid.find((tile) => tile.isTrash)!}
									moveItem={moveItem}
									onItemRemoved={handleItemRemoved}
									onQuantityChanged={handleQuantityChanged}
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