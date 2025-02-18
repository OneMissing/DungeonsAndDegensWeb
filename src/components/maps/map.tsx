"use client";
import React, { useRef, useState, useCallback, useMemo, JSX, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Image } from 'react-konva';
import { Button } from '../ui/cards/button';
import { KonvaEventObject } from 'konva/lib/Node';
import Konva from 'konva';
import { createClient } from '@/lib/supabase/client';
import Sidebar from './sidebar';
import { Character, Structure } from '@/lib/types/map';
import { loadCanvas } from '@/lib/types/map';
import { PopupLoad } from './popup';

const GRID_SIZE = 50;
const MIN_SCALE = 0.5;
const MAX_SCALE = 2;
const SNAP_THRESHOLD = GRID_SIZE - 20;

const Map = () => {
    const supabase = createClient();
    const [renderTrigger, setRenderTrigger] = useState(0);
    const [imageCache, setImageCache] = useState<{ [key: string]: HTMLImageElement | null }>({});
    const stageRef = useRef<Konva.Stage | null>(null);
    const [windowSize, setWindowSize] = useState({ width: 400, height: 300 });
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
    const [activeTile, setActiveTile] = useState<string | null>("eraser");
    const [tiles, setTiles] = useState<{ [key: string]: string | null | undefined }>({});
    const [isSelecting, setIsSelecting] = useState(false);
    const tileColors = {
        wall: 'black',
        stonewall: 'darkgray',  
        sand: 'khaki',
        water: 'lightblue',
        floor: 'lightgray',
        grass: 'green',
    };

    const tileImages = useMemo(() => {
        if (typeof window === "undefined") return {};
        const images: Record<string, HTMLImageElement | null> = {};
        Object.entries(tileColors).forEach(([tileType, src]) => {
            if (!src) return;
            const img = new window.Image();
            img.src = `/tiles/${tileType}.webp`;
            img.onload = () => {
                images[tileType] = img;
            };
            images[tileType] = null; 
        });
        return images;
    }, []);
    
    useEffect(() => {
        const newCache: { [key: string]: HTMLImageElement | null } = {};

        characters.forEach((char) => {
            const className = char.class.toLowerCase();
            const imagePath = `/characters/${className}.webp`;
            if (!imageCache[imagePath]) {
                const img = new window.Image();
                img.src = imagePath;
                img.onload = () => { setImageCache((prevCache) => ({ ...prevCache, [imagePath]: img })) };
                newCache[imagePath] = null;
            }
        });
        setImageCache((prevCache) => ({ ...prevCache, ...newCache }));
    }, [characters]);




    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Delete") {
                setCharacters(prevCharacters => prevCharacters.filter(c => !c.isSelected));
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
                } const { data, error } = await supabase
                    .from("characters")
                    .select("id, name, class")
                    .eq("user_id", userData.user.id);
                if (error) {
                    console.error("Error fetching champions:", error);
                    return;
                } setChampions(data.map(char => ({
                    id: char.id,
                    name: char.name,
                    class: char.class.toLowerCase(),
                    x: Math.floor(windowSize.width / 2),
                    y: Math.floor(windowSize.width / 2),
                    width: GRID_SIZE,
                    height: GRID_SIZE,
                    imagePath: `/characters/${char.class.toLowerCase()}.webp`, 
                    isSelected: false,
                    isDragging: false,
                })));
            } catch (err) {
                console.error("Unexpected error fetching champions:", err);
        }};
        fetchChampions();
    }, []);



    useEffect(() => {
        const updateSize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }; updateSize();
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
        }; const clickedOnStructure = structures.some(structure =>
            adjustedPointer.x >= structure.x &&
            adjustedPointer.x <= structure.x + structure.width &&
            adjustedPointer.y >= structure.y &&
            adjustedPointer.y <= structure.y + structure.height
        ); const clickedOnCharacter = characters.some(char =>
            adjustedPointer.x >= char.x &&
            adjustedPointer.x <= char.x + char.width &&
            adjustedPointer.y >= char.y &&
            adjustedPointer.y <= char.y + char.height
        ); if (!clickedOnCharacter) {
            setCharacters(prevCharacters => prevCharacters.map(c => ({ ...c, isSelected: false })));
        }

        if (!clickedOnStructure) {
            setStructures(prevStructures =>
                prevStructures.map(s => ({ ...s, isSelected: false }))
        )} if (button === 0) {
            if (selectionMode === 'rectangle') {
                setSelectionRect({
                    x: adjustedPointer.x,
                    y: adjustedPointer.y,
                    width: 0,
                    height: 0,
                });
                setIsSelecting(true);
            } else if (selectionMode === 'single') {
                setIsSelecting(true);
            }
        } else if (button === 2) {
            e.evt.preventDefault();
            setIsPanning(true);
            setStartPosition({ x: e.evt.layerX, y: e.evt.layerY });
        }
    },
        [scale, selectionMode, placeTile, characters]
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
            }; if (selectionMode === 'single') {
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
        const extraPadding = (GRID_SIZE * 10) / scale;
        const width = (viewWidth / scale) + extraPadding * 2;
        const height = (viewHeight / scale) + extraPadding * 2;
        const startX = Math.floor((-position.x - extraPadding * 5) / GRID_SIZE) * GRID_SIZE;
        const endX = Math.ceil((-position.x + width + extraPadding) / GRID_SIZE) * GRID_SIZE;
        const startY = Math.floor((-position.y - extraPadding * 5) / GRID_SIZE) * GRID_SIZE;
        const endY = Math.ceil((-position.y + height + extraPadding) / GRID_SIZE) * GRID_SIZE;
        for (let x = startX; x <= endX; x += GRID_SIZE) {
            elements.push(<Line key={`v-${x}`} points={[x, startY, x, endY]} stroke="gray" strokeWidth={0.5} />);
        } for (let y = startY; y <= endY; y += GRID_SIZE) {
            elements.push(<Line key={`h-${y}`} points={[startX, y, endX, y]} stroke="gray" strokeWidth={0.5} />);
        }
        Object.entries(tiles).forEach(([key, tileType]) => {
            const [x, y] = key.split(',').map(Number);
            if (!Number.isFinite(x) || !Number.isFinite(y)) return;
            if (!tileType || typeof tileType !== 'string') {
                console.warn(`🚨 Invalid tileType at (${x}, ${y}):`, tileType);
                return;
            } const image = tileImages[tileType];
            if (image) {
                elements.push(
                    <Image
                        key={`tile-${key}`}
                        x={x}
                        y={y}
                        width={GRID_SIZE}
                        height={GRID_SIZE}
                        image={image}
                    />
                );
            } else {
                console.warn(`🚨 Tile image not loaded yet for: ${tileType}`);
            }
        });
    
        return elements;
    }, [position, scale, tiles, renderTrigger, tileImages]);
    
    
    

    const addCharacter = (champion: Character) => {
        if (!stageRef.current) return;
        const stage = stageRef.current;
        const stageScale = stage.scaleX();
        const stagePos = stage.position();
        const centerX = (-stagePos.x + (windowSize.width / 2) - 250) / stageScale;
        const centerY = (-stagePos.y + (windowSize.height / 2) - 50) / stageScale;
        const snappedPosition = snapToGrid(centerX, centerY);
        setCharacters((prevCharacters) => {
            if (prevCharacters.some(char => char.name === champion.name)) {
                return prevCharacters; 
            } return [
                ...prevCharacters,
                {
                    ...champion,
                    id: crypto.randomUUID(),
                    x: snappedPosition.x,
                    y: snappedPosition.y,
                    isSelected: false,
                    isDragging: false,
                },
            ];
        });
    };

    const addItem = (itemPath: string, w: number, h: number) => {
        if (!stageRef.current) return;
        const stage = stageRef.current;
        const stageScale = stage.scaleX();
        const stagePos = stage.position();
        const centerX = (-stagePos.x + (windowSize.width / 2) - 250) / stageScale;
        const centerY = (-stagePos.y + (windowSize.height / 2) - 50) / stageScale;
        const snappedPosition = snapToGrid(centerX, centerY);
        setStructures((prevStructures) => [
            ...prevStructures,
            {
                id: crypto.randomUUID(),
                x: snappedPosition.x,
                y: snappedPosition.y,
                width: GRID_SIZE * w,
                height: GRID_SIZE * h,
                color: "blue",
                isSelected: false,
                itemPath,
                isDragging: false,
            }
        ]);
    };
    

    const snapToGrid = (x: number, y: number): { x: number; y: number } => {
        return {
            x: Math.floor(x / GRID_SIZE) * GRID_SIZE,
            y: Math.floor(y / GRID_SIZE) * GRID_SIZE,
        };
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
            characters: characters.map(({ id, x, y, width, height, name, class: characterClass, imagePath }) => ({
                id,
                x,
                y,
                width,
                height,
                name,
                class: characterClass,
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
        <div className="absolute w-screen h-main overflow-hidden">

            {/* ModeSelect */}


            {/* Sidebar */}
            <div className="flex overflow-hidden h-main dark:bg-gray-600   ">
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    tileColors={tileColors}
                    activeTile={activeTile}
                    setActiveTile={setActiveTile}
                    champions={champions}
                    addCharacter={addCharacter}
                    addItem={addItem}
                    saveCanvas={() => saveCanvasToSupabase(structures, tiles, characters)}
                    loadCanvas={() => loadCanvas(setStructures, setTiles, setCharacters)}
                    characters={characters}
                    setCharacters={setCharacters}
                    structures={structures}
                    tiles={tiles}
                    setStructures={setStructures}
                    setTiles={setTiles}
                    selectionMode={selectionMode}
                    setSelectionMode={setSelectionMode}
                />

                {/* Stage initial */}
                <Stage
                    width={windowSize.width}
                    height={windowSize.height}
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
                                image={structure.itemPath ? imageCache[structure.itemPath] || undefined : undefined}
                                stroke={structure.isDragging || structure.isSelected ? 'red' : 'transparent'}
                                strokeWidth={structure.isDragging || structure.isSelected ? 3 : 0}
                                draggable={selectionMode === 'structures'}
                                onClick={() => {
                                    setStructures((prevStructures) => {
                                        const updatedStructures = prevStructures.map((s) => s.id === structure.id ? { ...s, isSelected: true } : { ...s, isSelected: false });
                                        const selectedStructure = updatedStructures.find(s => s.id === structure.id);
                                        const otherStructures = updatedStructures.filter(s => s.id !== structure.id);
                                        return selectedStructure ? [...otherStructures, selectedStructure] : updatedStructures;
                                    });
                                }}
                                onDragStart={() => {
                                    setStructures((prevStructures) => {
                                        const updatedStructures = prevStructures.map((s) => s.id === structure.id ? { ...s, isDragging: true, isSelected: true } : { ...s, isDragging: false, isSelected: false });
                                        const draggedStructure = updatedStructures.find(s => s.id === structure.id);
                                        const otherStructures = updatedStructures.filter(s => s.id !== structure.id);
                                        return draggedStructure ? [...otherStructures, draggedStructure] : updatedStructures;
                                    });
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
                                    } if (Math.abs(adjustedPointer.y - snappedY) < SNAP_THRESHOLD) {
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

                    {/* Characters */}
                    <Layer>
                        {characters.map((char) => (
                            <Image
                                key={char.id}
                                x={char.x}
                                y={char.y}
                                width={char.width}
                                height={char.height}
                                image={imageCache[`/characters/${char.class.toLowerCase()}.webp`] || undefined}
                                stroke={char.isDragging || char.isSelected ? "red" : "transparent"}
                                strokeWidth={char.isDragging || char.isSelected ? 3 : 0}
                                draggable={selectionMode === 'structures'}
                                onClick={() => {
                                    setCharacters((prevCharacters) =>
                                        prevCharacters.map((s) =>
                                            s.id === char.id ? { ...s, isSelected: true } : { ...s, isSelected: false }
                                        )
                                    );
                                }} onDragStart={() => {
                                    setCharacters((prevCharacters) =>
                                        prevCharacters.map((s) =>
                                            s.id === char.id ? { ...s, isDragging: true, isSelected: true } : { ...s, isDragging: false, isSelected: false }
                                        )
                                    );
                                }} onDragMove={(e) => {
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
                                    } if (Math.abs(adjustedPointer.y - snappedY) < SNAP_THRESHOLD) {
                                        snappedY = Math.floor(adjustedPointer.y / GRID_SIZE) * GRID_SIZE;
                                    } const isTileOccupied = (x: number, y: number) => {
                                        const occupiedByCharacter = characters.some(
                                            (otherChar) => otherChar.x === x && otherChar.y === y && otherChar.id !== char.id 
                                        );
                                        return occupiedByCharacter;
                                    }; if (isTileOccupied(snappedX, snappedY)) {
                                        const offsets = [
                                            { dx: GRID_SIZE, dy: 0 },  
                                            { dx: -GRID_SIZE, dy: 0 }, 
                                            { dx: 0, dy: GRID_SIZE },  
                                            { dx: 0, dy: -GRID_SIZE }  
                                        ];
                                        for (const { dx, dy } of offsets) {
                                            const newX = snappedX + dx;
                                            const newY = snappedY + dy;
                                            if (!isTileOccupied(newX, newY)) {
                                                snappedX = newX; snappedY = newY; break;
                                            }
                                        }
                                    }
                                    e.target.x(snappedX);
                                    e.target.y(snappedY);
                                }} onDragEnd={(e) => {
                                    const { x: snappedX, y: snappedY } = snapToGrid(e.target.x(), e.target.y());
                                    setCharacters((prevCharacters) => prevCharacters.map((s) => s.id === char.id ? { ...s, x: snappedX, y: snappedY, isDragging: false, isSelected: true } : s))}
                                } onContextMenu={(e) => e.evt.preventDefault()}
                        />))}
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
