"use client";
import React, { useRef, useState, useCallback, useMemo, JSX, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Image } from 'react-konva';
import { Button } from '../ui/cards/button';
import { default as NextImage } from "next/image";
import { KonvaEventObject, Node, NodeConfig } from 'konva/lib/Node';
import Konva from 'konva';
import useImage from 'use-image';
import { createClient } from '@/lib/supabase/client';

const GRID_SIZE = 50;
const MIN_SCALE = 0.5;
const MAX_SCALE = 2;
const SNAP_THRESHOLD = GRID_SIZE - 20;

interface Structure {
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


interface Character {
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

const Map = () => {
    const supabase = createClient();
    const [renderTrigger, setRenderTrigger] = useState(0);
    const [imageCache, setImageCache] = useState<{ [key: string]: HTMLImageElement | null }>({});
    const stageRef = useRef<Konva.Stage | null>(null);
    const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
    const [isPanning, setIsPanning] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [selectionMode, setSelectionMode] = useState<'single' | 'rectangle' | 'structures'>('structures');
    const [structures, setStructures] = useState<Structure[]>([]);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [champions, setChampions] = useState<Character[]>([]);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [activeTab, setActiveTab] = useState<'tiles' | 'characters' | 'structures' | 'settings'>('tiles');
    const [selectionRect, setSelectionRect] = useState<{ x: number; y: number; width: number; height: number; } | null>(null);
    const tileColors = { wall: 'black', sand: 'khaki', water: 'lightblue', wood: 'sienna', floor: 'lightgray', };
    const [activeTile, setActiveTile] = useState<string | null>(null);
    const [tiles, setTiles] = useState<{ [key: string]: string | null | undefined }>({});
    const [isSelecting, setIsSelecting] = useState(false);
    const [characterImageCache, setCharacterImageCache] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new window.Image();
        img.src = "/characters/01.webp";
        img.onload = () => setCharacterImageCache(img);
    }, []);
    

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Delete") {
                setStructures((prevStructures) => {
                    const selectedStructures = prevStructures.filter(s => s.isSelected);
                    if (selectedStructures.length === 0) return prevStructures;
                    const lastSelectedId = selectedStructures[selectedStructures.length - 1].id;
                    return prevStructures.filter(s => s.id !== lastSelectedId);
                });
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);


    useEffect(() => {
        const newCache: { [key: string]: HTMLImageElement | null } = {};

        structures.forEach((structure) => {
            if (!imageCache[structure.itemPath]) {
                const img = new window.Image();
                img.src = structure.itemPath;
                img.onload = () => {
                    setImageCache((prevCache) => ({ ...prevCache, [structure.itemPath]: img }));
                };
                newCache[structure.itemPath] = null;
            }
        });

        setImageCache((prevCache) => ({ ...prevCache, ...newCache }));
    }, [structures]);

    useEffect(() => {
        setRenderTrigger((prev) => prev + 1);
    }, [characters]);
    

    useEffect(() => {
        const fetchChampions = async () => {
            try {
                const { data: userData } = await supabase.auth.getUser();
                if (!userData?.user) {
                    console.error("User not authenticated");
                    return;
                }
                const { data, error } = await supabase
                    .from("characters")
                    .select("id, name")
                    .eq("user_id", userData.user.id);
                if (error) {
                    console.error("Error fetching champions:", error);
                    return;
                }
                setChampions(data.map(char => ({
                    id: char.id,
                    name: char.name,
                    x: 0,
                    y: 0,
                    width: GRID_SIZE,
                    height: GRID_SIZE,
                    imagePath: `/characters/01.png`,
                    isSelected: false,
                    isDragging: false,
                })));
            } catch (err) {
                console.error("Unexpected error fetching champions:", err);
            }
        };
        fetchChampions();
    }, []);
    
    

    useEffect(() => {
        const updateSize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    const placeTile = useCallback((x: number, y: number) => {
        const gridX = Math.floor(x / GRID_SIZE) * GRID_SIZE;
        const gridY = Math.floor(y / GRID_SIZE) * GRID_SIZE;
        const key = `${gridX},${gridY}`;
        setTiles((prevTiles) => {
            const newTiles = { ...prevTiles };
            if (activeTile === 'eraser') {
                delete newTiles[key];
            } else {
                newTiles[key] = activeTile;
            }
            return newTiles;
        });
    }, [activeTile]);

    const handleMouseDown = useCallback((e: KonvaEventObject<MouseEvent>) => {
        const { button } = e.evt;
        const stage = stageRef.current;
        if (!stage) return;
        const pointer = stage.getPointerPosition();
        if (!pointer) return;
        const absPos = stage.getAbsolutePosition();
        const adjustedPointer = {
            x: (pointer.x - absPos.x) / scale,
            y: (pointer.y - absPos.y) / scale,
        };
        const clickedOnStructure = structures.some(structure =>
            adjustedPointer.x >= structure.x &&
            adjustedPointer.x <= structure.x + structure.width &&
            adjustedPointer.y >= structure.y &&
            adjustedPointer.y <= structure.y + structure.height
        );

        if (!clickedOnStructure) {
            setStructures(prevStructures =>
                prevStructures.map(s => ({ ...s, isSelected: false }))
            );
        }
        if (button === 0) {
            if (selectionMode === 'rectangle') {
                setSelectionRect({
                    x: adjustedPointer.x,
                    y: adjustedPointer.y,
                    width: 0,
                    height: 0,
                });
                setIsSelecting(true);
            } else if (selectionMode === 'single') {
                placeTile(adjustedPointer.x, adjustedPointer.y);
                setIsSelecting(true);
            } else if (selectionMode === 'structures') {
                // Implement logic for placing structures
            }
        } else if (button === 2) {
            e.evt.preventDefault();
            setIsPanning(true);
            setStartPosition({ x: e.evt.layerX, y: e.evt.layerY });
        }
    },
        [scale, selectionMode, placeTile]
    );

    const handleMouseMove = (e: { evt: { layerX: number; layerY: number; }; }) => {
        if (isPanning) {
            const dx = e.evt.layerX - startPosition.x;
            const dy = e.evt.layerY - startPosition.y;
            setPosition((prev) => ({
                x: prev.x + dx,
                y: prev.y + dy,
            }));
            setStartPosition({ x: e.evt.layerX, y: e.evt.layerY });
        }
        else {
            if (!isSelecting) return;

            const stage = stageRef.current;
            if (!stage) return;

            const pointer = stage.getPointerPosition();
            if (!pointer) return;

            const absPos = stage.getAbsolutePosition();
            const adjustedPointer = {
                x: (pointer.x - absPos.x) / scale,
                y: (pointer.y - absPos.y) / scale,
            };

            if (selectionMode === 'single') {
                placeTile(adjustedPointer.x, adjustedPointer.y);
            } else if (selectionMode === 'rectangle' && selectionRect) {
                setSelectionRect((prevRect) => ({
                    x: prevRect?.x ?? adjustedPointer.x,
                    y: prevRect?.y ?? adjustedPointer.y,
                    width: adjustedPointer.x - (prevRect?.x ?? adjustedPointer.x),
                    height: adjustedPointer.y - (prevRect?.y ?? adjustedPointer.y),
                }));
            }
        }
    };

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
        if (!isSelecting) return;
        if (selectionMode === 'structures') {

        } else if (selectionMode === 'rectangle' && selectionRect) {
            const startX = Math.min(selectionRect.x, selectionRect.x + selectionRect.width);
            const endX = Math.max(selectionRect.x, selectionRect.x + selectionRect.width);
            const startY = Math.min(selectionRect.y, selectionRect.y + selectionRect.height);
            const endY = Math.max(selectionRect.y, selectionRect.y + selectionRect.height);

            setTiles((prevTiles) => {
                const updatedTiles = { ...prevTiles };

                for (let x = startX; x < endX; x += GRID_SIZE) {
                    for (let y = startY; y < endY; y += GRID_SIZE) {
                        const gridX = Math.floor(x / GRID_SIZE) * GRID_SIZE;
                        const gridY = Math.floor(y / GRID_SIZE) * GRID_SIZE;
                        const key = `${gridX},${gridY}`;

                        if (activeTile === 'eraser') delete updatedTiles[key];
                        else updatedTiles[key] = activeTile;
                    }
                }
                return updatedTiles;
            })
        }
        setSelectionRect(null);
        setIsSelecting(false);
    }, [isSelecting, selectionMode, selectionRect, activeTile]);

    const handleWheel = useCallback((e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const stage = stageRef.current;
        if (!stage) return;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();
        if (!pointer) return;
        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };
        let newScale = e.evt.deltaY > 0 ? oldScale * 0.9 : oldScale * 1.1;
        newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        setScale(newScale);
        setPosition(newPos);
    }, []);

    const drawGrid = useMemo(() => {
        const elements: JSX.Element[] = [];
        const stage = stageRef.current;
        if (!stage) return elements;
        const viewWidth = windowSize.width;
        const viewHeight = windowSize.height;
        const extraPadding = GRID_SIZE * 5 / scale;
        const width = (viewWidth / scale) + extraPadding * 2;
        const height = (viewHeight / scale) + extraPadding * 2;
        const startX = Math.floor((-position.x - extraPadding) / GRID_SIZE) * GRID_SIZE;
        const endX = Math.ceil((-position.x + width + extraPadding) / GRID_SIZE) * GRID_SIZE;
        const startY = Math.floor((-position.y - extraPadding) / GRID_SIZE) * GRID_SIZE;
        const endY = Math.ceil((-position.y + height + extraPadding) / GRID_SIZE) * GRID_SIZE;
        for (let x = startX; x <= endX; x += GRID_SIZE)
            elements.push(<Line key={`v-${x}`} points={[x, startY, x, endY]} stroke="gray" strokeWidth={0.5} />);
        for (let y = startY; y <= endY; y += GRID_SIZE)
            elements.push(<Line key={`h-${y}`} points={[startX, y, endX, y]} stroke="gray" strokeWidth={0.5} />);
        Object.entries(tiles).forEach(([key, tileType]) => {
            const [x, y] = key.split(',').map(Number);
            if (!Number.isFinite(x) || !Number.isFinite(y)) return;
            elements.push(
                <Rect
                    key={`tile-${key}`}
                    x={x}
                    y={y}
                    width={GRID_SIZE}
                    height={GRID_SIZE}
                    fill={tileColors[tileType as keyof typeof tileColors] || tileColors.floor}
                />
            )
        });

        return elements;
    }, [position, scale, tiles, renderTrigger]);

    const addCharacter = (champion: Character) => {
        setCharacters((prevCharacters) => [
            ...prevCharacters,
            {
                ...champion,
                id: crypto.randomUUID(), // Ensure unique ID
                x: 100,
                y: 100,
                isSelected: false,
                isDragging: false,
            },
        ]);
    };
    
    

    const addItem = (itemPath: string, w: number, h: number) => {
        setStructures((prevStructures) => [
            ...prevStructures,
            {
                id: (prevStructures.length + 1).toString(),
                x: 100,
                y: 100,
                width: GRID_SIZE * w,
                height: GRID_SIZE * h,
                color: 'blue',
                isSelected: false,
                itemPath,
                isDragging: false,
            }
        ]);
    };

    const loadStructures = (newStructures: Structure[] | ((prev: Structure[]) => Structure[])) => {
        setStructures((prev) => typeof newStructures === "function" ? newStructures(prev) : [...newStructures]);
    };

    const loadCharacters = (newCharacters: Character[] | ((prev: Character[]) => Character[])) => {
        setCharacters((prev) => typeof newCharacters === "function" ? newCharacters(prev) : [...newCharacters]);
    };

    const loadTiles = (newTiles: { [key: string]: string | null | undefined } | ((prev: { [key: string]: string | null | undefined }) => { [key: string]: string | null | undefined })) => {
        setTiles((prev) => {
            const updatedTiles = typeof newTiles === "function" ? newTiles(prev) : newTiles;
            return Object.fromEntries(Object.entries(updatedTiles).map(([key, value]) => [key, value ?? null]));
        });
    };



    const snapToGrid = (x: number, y: number): { x: number; y: number } => {
        return {
            x: Math.floor(x / GRID_SIZE) * GRID_SIZE,
            y: Math.floor(y / GRID_SIZE) * GRID_SIZE,
        };
    };

const loadCanvasFromSupabase = async (
    setStructures: React.Dispatch<React.SetStateAction<Structure[]>>,
    setTiles: React.Dispatch<React.SetStateAction<{ [key: string]: string | null | undefined }>>,
    setCharacters: React.Dispatch<React.SetStateAction<Character[]>>
) => {
    try {
        const user = await supabase.auth.getUser();
        if (!user.data?.user) {
            console.error("User not authenticated");
            return;
        }

        const { data, error } = await supabase
            .from("maps")
            .select("data")
            .eq("user_id", user.data.user.id)
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

        const structures = Array.isArray(mapData.structures) ? mapData.structures : [];
        const tiles =
            typeof mapData.tiles === "object" && mapData.tiles !== null ? mapData.tiles : {};
        const characters = Array.isArray(mapData.characters) ? mapData.characters : [];

        setStructures(structures);
        setTiles(tiles);
        setCharacters(
            characters.map((char) => ({
                ...char,
                isDragging: false,
                isSelected: false, 
            }))
        );
    } catch (err) {
        console.error("Unexpected error in loadCanvasFromSupabase:", err);
    }
};

    const saveCanvasToSupabase = async (
    structures: Structure[],
    tiles: { [key: string]: string | null | undefined },
    characters: Character[]
) => {
    const cleanedTiles: Record<string, string | null> = Object.fromEntries(
        Object.entries(tiles).map(([key, value]) => [key, value ?? null])
    );

    const user = await supabase.auth.getUser();
    if (!user.data?.user) {
        console.error("User not authenticated");
        return;
    }

    const canvasData = {
        structures,
        tiles: cleanedTiles,
        characters: characters.map(({ id, x, y, width, height, name, imagePath }) => ({
            id,
            x,
            y,
            width,
            height,
            name,
            imagePath,
        })),
    };

    const { data, error } = await supabase
        .from("maps")
        .insert([{ user_id: user.data.user.id, data: canvasData }]);

    if (error) {
        console.error("Error saving canvas:", error);
    } else {
        console.log("Canvas saved successfully:", data);
    }
};




    return (
        <div className='relative w-full'>
            <div className='bg-gray-700 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-[calc(100svh-7rem)] z-50 w-96 rounded-lg pb-3 pl-2 pr-2'>
                <h1 className='text-center w-full p-2'>Mode</h1>
                <Button
                    className="w-1/3"
                    variant={selectionMode === 'rectangle' ? "default" : "outline"}
                    onClick={() => setSelectionMode('rectangle')}
                > Rectangle </Button>
                <Button
                    className="w-1/3"
                    variant={selectionMode === 'single' ? "default" : "outline"}
                    onClick={() => setSelectionMode('single')}
                > Single </Button>
                <Button
                    className="w-1/3"
                    variant={selectionMode === 'structures' ? "default" : "outline"}
                    onClick={() => setSelectionMode('structures')}
                > structures </Button>
            </div>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '300px', padding: '10px', background: '#f0f0f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <button onClick={() => setActiveTab('tiles')} style={{ flex: 1, padding: '8px', background: activeTab === 'tiles' ? '#ddd' : '#fff' }}>Tiles</button>
                        <button onClick={() => setActiveTab('characters')} style={{ flex: 1, padding: '8px', background: activeTab === 'characters' ? '#ddd' : '#fff' }}>Characters</button>
                        <button onClick={() => setActiveTab('structures')} style={{ flex: 1, padding: '8px', background: activeTab === 'structures' ? '#ddd' : '#fff' }}>Items</button>
                        <button onClick={() => setActiveTab('settings')} style={{ flex: 1, padding: '8px', background: activeTab === 'settings' ? '#ddd' : '#fff' }}>Items</button>
                    </div>
                    {activeTab === 'tiles' ? (
                        <div>
                            <h3>Select Tile Type</h3>
                            {Object.keys(tileColors).map((tileType) => (
                                <button
                                    key={tileType}
                                    onClick={() => setActiveTile(tileType)}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '10px',
                                        marginBottom: '5px',
                                        background: activeTile === tileType ? '#ddd' : '#fff',
                                        border: '1px solid #ccc',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {tileType.charAt(0).toUpperCase() + tileType.slice(1)}
                                </button>
                            ))}
                            <button
                                onClick={() => setActiveTile('eraser')}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '10px',
                                    marginBottom: '5px',
                                    background: activeTile === 'eraser' ? '#ddd' : '#fff',
                                    border: '1px solid #ccc',
                                    cursor: 'pointer',
                                }}
                            >
                                Eraser
                            </button>
                        </div>
                    ) : activeTab === 'characters' ? (
                        <div>
                            {champions.map((char) => (
                                <button
                                    key={char.id}
                                    onClick={() => addCharacter(char)} 
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        padding: "10px",
                                        marginTop: "10px",
                                        cursor: "pointer",
                                        position: "relative",
                                        height: "100px",
                                        overflow: "hidden",
                                    }}
                                >
                                        <NextImage
                                            alt={char.name}
                                            src="/characters/01.webp"
                                            style={{ objectFit: "cover" }}
                                            width={100}
                                            height={100}
                                        />
                                    {char.name}
                                </button>
                            ))}

                        </div>
                    ) : activeTab === 'structures' ? (
                        <div>
                            <button
                                onClick={() => addItem('/structures/item_001.webp', 1, 1)}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '10px',
                                    marginTop: '10px',
                                    cursor: 'pointer',
                                }}
                            >
                                <NextImage
                                    src="/structures/item_001.webp"
                                    alt="Item Image"
                                    width={100}
                                    height={100}
                                />Chest
                            </button>
                            <button
                                onClick={() => addItem('/structures/item_002.webp', 2, 2)}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '10px',
                                    marginTop: '10px',
                                    cursor: 'pointer',
                                }}
                            >
                                <NextImage
                                    src="/structures/item_002.webp"
                                    alt="Item Image"
                                    width={100}
                                    height={100}
                                />Sword
                            </button>
                        </div>
                    ) : (
                        <div>
                            <button onClick={() => saveCanvasToSupabase(structures, tiles, characters)}>
                                Save Map
                            </button>
                            <button onClick={() => loadCanvasFromSupabase(setStructures, setTiles, setCharacters)}>
                                Load Map
                            </button>
                        </div>
                    )}
                </div>

                <Stage
                    width={windowSize.width - 300}
                    height={windowSize.height - 65}
                    draggable={false}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onContextMenu={(e) => e.evt.preventDefault()}
                    scaleX={scale}
                    scaleY={scale}
                    x={position.x}
                    y={position.y}
                    ref={stageRef}
                >
                    {/* Grid and Tiles */}
                    <Layer>{drawGrid}</Layer>

                    {/* structures */}
                    <Layer>
                        {structures.map((structure) => (
                            <Image
                                key={structure.id}
                                x={structure.x}
                                y={structure.y}
                                width={structure.width}
                                height={structure.height}
                                image={imageCache[structure.itemPath] || undefined} // Use cached image or undefined
                                stroke={structure.isDragging || structure.isSelected ? 'red' : 'transparent'}
                                strokeWidth={structure.isDragging || structure.isSelected ? 3 : 0} // Keep stroke when selected
                                draggable={selectionMode === 'structures'}
                                onClick={() => {
                                    setStructures((prevStructures) =>
                                        prevStructures.map((s) =>
                                            s.id === structure.id
                                                ? { ...s, isSelected: true } // Select this structure
                                                : { ...s, isSelected: false } // Deselect others
                                        )
                                    );
                                }}
                                onDragStart={() => {
                                    setStructures((prevStructures) =>
                                        prevStructures.map((s) =>
                                            s.id === structure.id ? { ...s, isDragging: true, isSelected: true } : { ...s, isDragging: false, isSelected: false }
                                        )
                                    );
                                }}
                                onDragMove={(e) => {
                                    const stage = e.target.getStage();
                                    if (!stage) return;
                                    const pointerPos = stage.getPointerPosition();
                                    if (!pointerPos) return;
                                    const stageTransform = stage.getAbsoluteTransform().copy().invert();
                                    const adjustedPointer = stageTransform.point(pointerPos);
                                    let snappedX = Math.round(adjustedPointer.x / GRID_SIZE) * GRID_SIZE;
                                    let snappedY = Math.round(adjustedPointer.y / GRID_SIZE) * GRID_SIZE;
                                    if (Math.abs(adjustedPointer.x - snappedX) < SNAP_THRESHOLD) {
                                        snappedX = Math.floor(adjustedPointer.x / GRID_SIZE) * GRID_SIZE;
                                    }
                                    if (Math.abs(adjustedPointer.y - snappedY) < SNAP_THRESHOLD) {
                                        snappedY = Math.floor(adjustedPointer.y / GRID_SIZE) * GRID_SIZE;
                                    }
                                    e.target.x(snappedX);
                                    e.target.y(snappedY);
                                }}
                                onDragEnd={(e) => {
                                    const { x: snappedX, y: snappedY } = snapToGrid(e.target.x(), e.target.y());

                                    setStructures((prevStructures) =>
                                        prevStructures.map((s) =>
                                            s.id === structure.id ? { ...s, x: snappedX, y: snappedY, isDragging: false, isSelected: true } : s
                                        )
                                    );
                                }}
                                onContextMenu={(e) => e.evt.preventDefault()}
                            />
                        ))}
                    </Layer>

                    <Layer>
    {characters.map((char) => (
        <Image
            key={char.id}
            x={char.x}
            y={char.y}
            width={char.width}
            height={char.height}
            image={characterImageCache || undefined} // Always use the cached "/characters/01.webp"
            stroke={char.isDragging || char.isSelected ? "red" : "transparent"}
            strokeWidth={char.isDragging || char.isSelected ? 3 : 0}
            draggable
            onClick={() => {
                setCharacters((prevStructures) =>
                    prevStructures.map((s) =>
                        s.id === char.id
                            ? { ...s, isSelected: true } // Select this structure
                            : { ...s, isSelected: false } // Deselect others
                    )
                );
            }}
            onDragStart={() => {
                setCharacters((prevCharacters) =>
                    prevCharacters.map((s) =>
                        s.id === char.id ? { ...s, isDragging: true, isSelected: true } : { ...s, isDragging: false, isSelected: false }
                    )
                );
            }}
            onDragMove={(e) => {
                const stage = e.target.getStage();
                if (!stage) return;
                const pointerPos = stage.getPointerPosition();
                if (!pointerPos) return;
                const stageTransform = stage.getAbsoluteTransform().copy().invert();
                const adjustedPointer = stageTransform.point(pointerPos);
                let snappedX = Math.round(adjustedPointer.x / GRID_SIZE) * GRID_SIZE;
                let snappedY = Math.round(adjustedPointer.y / GRID_SIZE) * GRID_SIZE;
                if (Math.abs(adjustedPointer.x - snappedX) < SNAP_THRESHOLD) {
                    snappedX = Math.floor(adjustedPointer.x / GRID_SIZE) * GRID_SIZE;
                }
                if (Math.abs(adjustedPointer.y - snappedY) < SNAP_THRESHOLD) {
                    snappedY = Math.floor(adjustedPointer.y / GRID_SIZE) * GRID_SIZE;
                }
                e.target.x(snappedX);
                e.target.y(snappedY);
            }}
            onDragEnd={(e) => {
                const { x: snappedX, y: snappedY } = snapToGrid(e.target.x(), e.target.y());

                setStructures((prevCharacters) =>
                    prevCharacters.map((s) =>
                        s.id === char.id ? { ...s, x: snappedX, y: snappedY, isDragging: false, isSelected: true } : s
                    )
                );
            }}
            onContextMenu={(e) => e.evt.preventDefault()}
        />
    ))}
</Layer>



                    {/* Selection Outline Layer */}
                    <Layer>
                        {selectionRect && (
                            <Rect
                                key="selection"
                                x={selectionRect.x}
                                y={selectionRect.y}
                                width={selectionRect.width}
                                height={selectionRect.height}
                                stroke="blue"
                                strokeWidth={2}
                                dash={[4, 2]}
                                listening={false}
                            />
                        )}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
};

export default Map;
