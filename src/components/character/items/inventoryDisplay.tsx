"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/cards/button";
import { Card } from "@/components/ui/cards/card";
import { CardContent } from "@/components/ui/cards/cardContent";
import ItemEffectsTooltip from "@/components/character/items/ItemEffectsTooltip";
import ItemEffectsDisplay from "@/components/character/items/itemsEffectDisplay";

interface InventoryItem {
    id: string;
    name: string;
    description?: string;
    type: string;
    weight: number;
    value: number;
    quantity: number;
    inventoryId: string;
}

interface Item {
    id: string;
    name: string;
}

interface InventorySectionProps {
    characterId: string;
    className: string;
}

const InventorySection: React.FC<InventorySectionProps> = ({
    characterId,
    className,
}) => {
    const supabase = createClient();
    const [items, setItems] = useState<Item[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [inventory, setInventory] = useState<InventoryItem[]>(() => {
        if (typeof window !== "undefined") {
            const storedInventory = localStorage.getItem(
                `inventory_${characterId}`
            );
            return storedInventory ? JSON.parse(storedInventory) : [];
        }
        return [];
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeButton, setActiveButton] = useState<"Inventory" | "Items">(
        "Inventory"
    );
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const [addedMessage, setAddedMessage] = useState<string | null>(null);
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const { data, error } = await supabase
                    .from("inventory")
                    .select("*, items(*)")
                    .eq("character_id", characterId);
                if (error) throw new Error("Failed to load inventory.");

                const formattedInventory = data.map((entry: any) => ({
                    id: entry.items.id,
                    name: entry.items.name,
                    description: entry.items.description,
                    type: entry.items.type,
                    weight: entry.items.weight,
                    value: entry.items.value,
                    quantity: entry.quantity,
                    inventoryId: entry.id,
                }));
                setInventory(formattedInventory);
                localStorage.setItem(
                    `inventory_${characterId}`,
                    JSON.stringify(formattedInventory)
                );
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred."
                );
            } finally {
                setLoading(false);
            }
        };
        if (!inventory.length) fetchInventory();
    }, [characterId]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const { data, error } = await supabase
                    .from("items")
                    .select("id, name");
                if (error) throw new Error("Failed to fetch items.");
                setItems(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchItems();
    }, []);

    const updateInventory = async (
        updatedInventory: InventoryItem[],
        updateDB: boolean = false
    ) => {
        setInventory(updatedInventory);
        localStorage.setItem(
            `inventory_${characterId}`,
            JSON.stringify(updatedInventory)
        );
        if (updateDB) {
            for (const item of updatedInventory) {
                await supabase
                    .from("inventory")
                    .update({ quantity: item.quantity })
                    .eq("id", item.inventoryId);
            }
        }
    };

    const addItem = async (itemId: string) => {
        const item = inventory.find((i) => i.id === itemId);
        if (!item) return;
        const updatedInventory = inventory.map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
        );
        await updateInventory(updatedInventory, true);
    };

    const removeItem = async (itemId: string) => {
        const item = inventory.find((i) => i.id === itemId);
        if (!item || item.quantity <= 0) return;
        let updatedInventory;
        if (item.quantity === 1) {
            updatedInventory = inventory.filter((i) => i.id !== itemId);
            await supabase
                .from("inventory")
                .delete()
                .eq("id", item.inventoryId);
        } else {
            updatedInventory = inventory.map((i) =>
                i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
            );
            await updateInventory(updatedInventory, true);
        }
    };

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from("inventory")
                    .select("*, items(*)")
                    .eq("character_id", characterId);
                if (error) throw new Error("Failed to load inventory.");

                setInventory(
                    data.map((entry: any) => ({
                        id: entry.items.id,
                        name: entry.items.name,
                        description: entry.items.description,
                        type: entry.items.type,
                        weight: entry.items.weight,
                        value: entry.items.value,
                        quantity: entry.quantity,
                        inventoryId: entry.id,
                    }))
                );
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred."
                );
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, [characterId]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const { data, error } = await supabase
                    .from("items")
                    .select("id, name");
                if (error) throw new Error("Failed to fetch items.");
                setItems(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchItems();
    }, []);

    const toggleExpand = (itemId: string) => {
        setExpandedItem(expandedItem === itemId ? null : itemId);
    };

    const handleAddItem = async () => {
        if (!selectedItem || quantity < 1) return;

        const existingItem = inventory.find(
            (entry) => entry.id === selectedItem.id
        );

        setInventory((prev) => {
            if (existingItem) {
                return prev.map((item) =>
                    item.id === selectedItem.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [
                    ...prev,
                    {
                        id: selectedItem.id,
                        name: selectedItem.name,
                        description: "",
                        type: "",
                        weight: 0,
                        value: 0,
                        quantity,
                        inventoryId: "temp-id",
                    },
                ];
            }
        });

        setAddedMessage(`${selectedItem.name} added!`);
        setTimeout(() => setAddedMessage(""), 2500);
        setTimeout(() => setAddedMessage(null), 3000); 

        // Sync with database in the background
        try {
            if (existingItem) {
                await supabase
                    .from("inventory")
                    .update({ quantity: existingItem.quantity + quantity })
                    .eq("id", existingItem.inventoryId);
            } else {
                const { data, error } = await supabase
                    .from("inventory")
                    .insert([
                        {
                            character_id: characterId,
                            item_id: selectedItem.id,
                            quantity,
                        },
                    ])
                    .select("*, items(*)");

                if (error) throw new Error("Failed to add item.");
                if (data) {
                    setInventory((prev) =>
                        prev.map((item) =>
                            item.id === selectedItem.id
                                ? { ...item, inventoryId: data[0].id }
                                : item
                        )
                    );
                }
            }
        } catch (err) {
            console.error("Error adding item:", err);
            setError("Failed to add item.");
        }
    };

    if (loading)
        return (
            <p className='text-center text-gray-500'>Loading inventory...</p>
        );
    if (error) return <p className='text-center text-red-500'>{error}</p>;

    return (
        <section className={className}>
            <div className='flex gap-4'>
                <Button
                    className='w-1/2'
                    variant={
                        activeButton === "Inventory" ? "default" : "outline"
                    }
                    onClick={() => setActiveButton("Inventory")}
                >
                    Inventory
                </Button>
                <Button
                    className='w-1/2'
                    variant={activeButton === "Items" ? "default" : "outline"}
                    onClick={() => setActiveButton("Items")}
                >
                    Items
                </Button>
            </div>
            <Card>
                <CardContent className='pt-1'>
                    {activeButton === "Inventory" ? (
                        inventory.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">
                                No items in inventory.
                            </p>
                        ) : (
                            <ul className='border rounded bg-white dark:bg-slate-800 overflow-y-auto min-h-[calc(100vh-14rem)]'>
                                {inventory.map((item) => (
                                    <li
                                        key={item.id}
                                        className='border p-2 rounded-lg shadow-sm bg-white'
                                    >
                                        {expandedItem === item.id ? (
                                            <div>
                                                <div
                                                    className='grid grid-cols-2 items-center'
                                                    onClick={() =>
                                                        toggleExpand(item.id)
                                                    }
                                                >
                                                    <h4 className='text-lg font-semibold cursor-pointer text-yellow-600'>
                                                        {item.name}
                                                    </h4>
                                                    <h6 className='text-lg font-semibold cursor-pointer text-yellow-600'>
                                                        {item.quantity}×
                                                    </h6>
                                                </div>
                                                <div>
                                                    {item.description && (
                                                        <p className='text-gray-600'>
                                                            {item.description}
                                                        </p>
                                                    )}
                                                    <p className='text-sm text-gray-500'>
                                                        Type: {item.type}
                                                    </p>
                                                    <p className='text-sm text-gray-500'>
                                                        Weight: {item.weight} |
                                                        Value: {item.value} gp
                                                    </p>
                                                    <ItemEffectsDisplay
                                                        itemId={item.id}
                                                    />
                                                    <div className='mt-2 grid grid-cols-2 gap-2'>
                                                        <button
                                                            className='bg-green-500 text-white py-2 rounded-lg hover:bg-green-700'
                                                            onClick={() =>
                                                                addItem(item.id)
                                                            }
                                                        >
                                                            Add
                                                        </button>
                                                        <button
                                                            className='bg-red-400 text-white py-2 rounded-lg hover:bg-red-700'
                                                            onClick={() =>
                                                                removeItem(
                                                                    item.id
                                                                )
                                                            }
                                                        >
                                                            Use
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <ItemEffectsTooltip
                                                itemId={item.id}
                                            >
                                                <div
                                                    className='grid grid-cols-2 items-center'
                                                    onClick={() => {
                                                        toggleExpand(item.id);
                                                    }}
                                                >
                                                    <h4 className='text-lg font-semibold cursor-pointer text-yellow-600'>
                                                        {item.name}
                                                    </h4>
                                                    <h6 className='text-lg font-semibold cursor-pointer text-yellow-600'>
                                                        {item.quantity}×
                                                    </h6>
                                                </div>
                                            </ItemEffectsTooltip>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )
                    ) : (
                        <div className='p-4 border rounded-lg bg-white shadow-md'>
                            <h3 className='text-lg font-semibold mb-2'>
                                Add Item
                            </h3>

                            {error && (
                                <p className='text-red-500 text-sm'>{error}</p>
                            )}

                            <div className='flex items-center gap-2 mb-2'>
                                <input
                                    type='number'
                                    className='p-2 border rounded w-20'
                                    min='1'
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(
                                            Math.max(
                                                1,
                                                parseInt(e.target.value) || 1
                                            )
                                        )
                                    }
                                />
                                <button
                                    className={`p-2 w-full text-white rounded transition ${
                                        selectedItem
                                            ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                                            : "bg-gray-400 cursor-not-allowed opacity-50"
                                    }`}
                                    onClick={handleAddItem}
                                    disabled={!selectedItem || loading}
                                >
                                    {loading ? "Adding..." : "Add Item"}
                                </button>
                            </div>

                            <input
                                type='text'
                                placeholder='Search item...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full p-2 border rounded mb-2'
                                disabled={!!selectedItem}
                            />

                            {searchTerm && !selectedItem && (
                                <ul className='rounded-lg shadow-md min-h-0 md:min-h-[calc(100vh-13rem)] md:h-[calc(100vh-13rem)] overflow-y-visible md:overflow-y-auto mt-4'>
                                    {items
                                        .filter((item) =>
                                            item.name
                                                .toLowerCase()
                                                .includes(
                                                    searchTerm.toLowerCase()
                                                )
                                        )
                                        .map((item) => (
                                            <li
                                                key={item.id}
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setSearchTerm(item.name);
                                                }}
                                                className='p-2 cursor-pointer hover:bg-gray-200'
                                            >
                                                {item.name}
                                            </li>
                                        ))}
                                </ul>
                            )}

                            {selectedItem && (
                                <div className='flex justify-between items-center mt-2'>
                                    <button
                                        className='text-sm text-red-500 hover:underline'
                                        onClick={() => {
                                            setSelectedItem(null);
                                            setSearchTerm("");
                                        }}
                                    >
                                        Deselect
                                    </button>
                                    {addedMessage && (
                                        <span className='text-sm text-green-500 custom-animate-fade-in'>
                                            {addedMessage}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
};

export default InventorySection;
