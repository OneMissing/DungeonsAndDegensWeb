'use client';

import Konva from 'konva';
import React, { useRef, useState, useCallback, useMemo, JSX, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Image } from 'react-konva';
import useChampions from './useChampions';
import { Button } from '../ui/cards/button';
import { default as NextImage } from "next/image";

const GRID_SIZE = 50;
const MIN_SCALE = 0.5;
const MAX_SCALE = 2;

const tileColors = {
  wall: 'black',
  sand: 'khaki',
  water: 'lightblue',
  wood: 'sienna',
  floor: 'lightgray',
};

type Champion = {
  id: string;
  name: string;
  // Add other fields if necessary
};

const InfiniteGrid = () => {
  const stageRef = useRef<Konva.Stage | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeTile, setActiveTile] = useState('wall');
  const [activeTab, setActiveTab] = useState<'tiles' | 'champions' | 'items'>('tiles');
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [importedImage, setImportedImage] = useState<HTMLImageElement | null>(null);
  const [imagePosition, setImagePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const imageRef = useRef<Konva.Image | null>(null);

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


  const [selectionRect, setSelectionRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [tiles, setTiles] = useState<{ [key: string]: string | undefined }>({});
  const [selectionMode, setSelectionMode] = useState<'single' | 'rectangle' | 'object'>('single');
  const [isSelecting, setIsSelecting] = useState(false);


const placeTile = useCallback((x: number, y: number) => {
  const gridX = Math.floor(x / GRID_SIZE) * GRID_SIZE;
  const gridY = Math.floor(y / GRID_SIZE) * GRID_SIZE;
  const key = `${gridX},${gridY}`;
  setTiles((prevTiles) => {
    const newTiles = { ...prevTiles };
    if (activeTile === 'eraser') {
      delete newTiles[key]; // Erase tile
    } else {
      newTiles[key] = activeTile; // Place tile
    }
    return newTiles;
  });
}, [activeTile]);



  const handleWheel = useCallback((e: { evt: { preventDefault: () => void; deltaY: number; }; }) => {
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

  const handleDragMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 2) return; 
  
    setPosition({ x: e.target.x(), y: e.target.y() });
    if (selectionMode === 'object' && imageRef.current) {
      const newX = Math.floor(e.target.x() / GRID_SIZE) * GRID_SIZE;
      const newY = Math.floor(e.target.y() / GRID_SIZE) * GRID_SIZE;
      imageRef.current.position({ x: newX, y: newY });
      imageRef.current.getLayer()?.batchDraw();
    }
  }, [selectionMode]);
  
  

  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      e.evt.preventDefault(); // Prevent default right-click menu
  
      const stage = stageRef.current;
      if (!stage) return;
  
      const pointer = stage.getPointerPosition();
      if (!pointer) return;
  
      const absPos = stage.getAbsolutePosition();
      const adjustedPointer = {
        x: (pointer.x - absPos.x) / scale,
        y: (pointer.y - absPos.y) / scale,
      };
  
      if (e.evt.button === 2) { // Right-click (button 2)
        if (selectionMode === 'single') {
          placeTile(adjustedPointer.x, adjustedPointer.y);
          setIsSelecting(true);
        } else if (selectionMode === 'rectangle') {
          setSelectionRect({
            x: adjustedPointer.x,
            y: adjustedPointer.y,
            width: 0,
            height: 0,
          });
          setIsSelecting(true);
        } else if (selectionMode === 'object') {
          handleItemImport('../structures/item_001.webp');
        }
      }
    },
    [scale, selectionMode, placeTile]
  );
  



  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
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
    },
    [isSelecting, selectionMode, selectionRect, scale, placeTile]
  );


  const handleMouseUp = useCallback(() => {
    if (!isSelecting) return;

    if (selectionMode === 'object' && imageRef.current) {
      const newX = Math.floor(imageRef.current.x() / GRID_SIZE) * GRID_SIZE;
      const newY = Math.floor(imageRef.current.y() / GRID_SIZE) * GRID_SIZE;
      imageRef.current.position({ x: newX, y: newY });
      imageRef.current.getLayer()?.batchDraw();
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

  const handleRightClick = useCallback((e: { evt: { preventDefault: () => void; }; }) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const absPos = stage.getAbsolutePosition();
    const adjustedPointer = {
      x: (pointer.x - absPos.x) / scale,
      y: (pointer.y - absPos.y) / scale,
    };

    const gridX = Math.floor(adjustedPointer.x / GRID_SIZE) * GRID_SIZE;
    const gridY = Math.floor(adjustedPointer.y / GRID_SIZE) * GRID_SIZE;
    const key = `${gridX},${gridY}`;
/**const rect = imageRef.current?.getBoundingClientRect();
    if (rect) {
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setIsDragging(true); // Start dragging on right click
  }; */
    if (selectionMode === 'single') {
      setTiles((prevTiles) => {
        const newTiles = { ...prevTiles };
        if (activeTile === 'eraser') {
          delete newTiles[key]; // Erase tile
        } else {
          newTiles[key] = activeTile; // Change tile type
        }
        return newTiles;
      });
    }
  }, [scale, activeTile, selectionMode]); // ✅ Dependency array correctly placed  

  const drawGrid = useMemo(() => {
    const elements: JSX.Element[] = [];
    const stage = stageRef.current;
    if (!stage) return elements;

    // Get viewport dimensions
    const viewWidth = windowSize.width;
    const viewHeight = windowSize.height;

    // Calculate how much extra grid space is needed based on zoom level
    const extraPadding = GRID_SIZE * 5 / scale; // Extend grid beyond viewport when zoomed out

    const width = (viewWidth / scale) + extraPadding * 2;
    const height = (viewHeight / scale) + extraPadding * 2;

    const startX = Math.floor((-position.x - extraPadding) / GRID_SIZE) * GRID_SIZE;
    const endX = Math.ceil((-position.x + width + extraPadding) / GRID_SIZE) * GRID_SIZE;
    const startY = Math.floor((-position.y - extraPadding) / GRID_SIZE) * GRID_SIZE;
    const endY = Math.ceil((-position.y + height + extraPadding) / GRID_SIZE) * GRID_SIZE;

    // Draw vertical grid lines
    for (let x = startX; x <= endX; x += GRID_SIZE) {
      elements.push(<Line key={`v-${x}`} points={[x, startY, x, endY]} stroke="gray" strokeWidth={0.5} />);
    }

    // Draw horizontal grid lines
    for (let y = startY; y <= endY; y += GRID_SIZE) {
      elements.push(<Line key={`h-${y}`} points={[startX, y, endX, y]} stroke="gray" strokeWidth={0.5} />);
    }

    // Draw selection rectangle
    if (selectionRect) {
      elements.push(
        <Rect
          key="selection"
          x={selectionRect.x}
          y={selectionRect.y}
          width={selectionRect.width}
          height={selectionRect.height}
          stroke="blue"
          strokeWidth={1}
          dash={[4, 2]}
        />
      );
    }

    // Draw tiles
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
      );
    });

    return elements;
  }, [position, scale, tiles, selectionRect]); // Ensure selectionRect is included in dependencies

  const { champions, loading } = useChampions();
  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (event) => {
      const fileInput = event.target as HTMLInputElement; // Cast to HTMLInputElement
      const file = fileInput.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);

          // Set the tiles and other data from the imported data
          setTiles(importedData.tiles || {});
          setPosition(importedData.position || { x: 0, y: 0 });
          setScale(importedData.scale || 1);

          // You can add more properties here based on your imported data structure
        } catch (error: unknown) {
          // Type assertion: error is an instance of Error
          if (error instanceof Error) {
            alert('Error importing data: ' + error.message);
          } else {
            alert('An unknown error occurred during import.');
          }
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const [importedItem, setImportedItem] = useState<{ type: string; x: number; y: number } | null>(null);

  const handleItemImport = async (src: string) => {
    const image = new window.Image();
    image.onload = () => {
      // Set the imported image to fit 1 tile
      setImportedImage(image);
      setImagePosition({ x: 0, y: 0 });
    };
    image.src = src;
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
          variant={selectionMode === 'object' ? "default" : "outline"}
          onClick={() => setSelectionMode('object')}
        > Objects </Button>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '300px', padding: '10px', background: '#f0f0f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <button onClick={() => setActiveTab('tiles')} style={{ flex: 1, padding: '8px', background: activeTab === 'tiles' ? '#ddd' : '#fff' }}>Tiles</button>
            <button onClick={() => setActiveTab('champions')} style={{ flex: 1, padding: '8px', background: activeTab === 'champions' ? '#ddd' : '#fff' }}>Champions</button>
            <button onClick={() => setActiveTab('items')} style={{ flex: 1, padding: '8px', background: activeTab === 'items' ? '#ddd' : '#fff' }}>Items</button>
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
          ) : activeTab === 'champions' ? (
            <div>
              <h3>Select Champion</h3>
              {!loading ? champions.map((champion) => (
                <div
                  key={champion.id}
                  draggable
                  style={{
                    padding: '8px',
                    marginBottom: '5px',
                    background: '#fff',
                    border: '1px solid #ccc',
                    cursor: 'grab',
                    textAlign: 'center',
                  }}
                >
                  {champion.name}
                </div>
              )) : (<div> Loading... </div>)}
            </div>
          ) : (<div><button
            onClick={() => handleItemImport('../structures/item_001.webp')}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px',
              marginTop: '10px',
              cursor: 'pointer',
            }}
          >
            <NextImage
              src="structures/item_001.webp"
              alt="Item Image"
              width={100}
              height={100}
            />Chest</button><button
              onClick={() => handleItemImport('../structures/item_002.webp')}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px',
                marginTop: '10px',
                cursor: 'pointer',
              }}
            >
              <NextImage
                src="structures/item_002.webp"
                alt="Item Image"
                width={100}
                height={100}
              />Sword</button></div>)}
        </div>


        <Stage
          width={windowSize.width - 300}
          height={windowSize.height - 65}
          draggable
          onDragMove={handleDragMove}
          onContextMenu={handleRightClick}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          ref={stageRef}
        >
          {/* Grid and Tiles */}
          <Layer>
            {drawGrid.filter((el) => el.type === Rect)}
            {importedImage && (
              <Image
                image={importedImage}
                x={imagePosition.x}
                y={imagePosition.y}
                width={GRID_SIZE}
                height={GRID_SIZE} 
                ref={imageRef}
                onLoad={() => {
                  // Ensuring the image is fully loaded and will render correctly
                  imageRef.current?.getLayer()?.batchDraw();
                }}
              />
            )}
          </Layer>

          {/* Grid Lines Layer (Above tiles) */}
          <Layer>{drawGrid.filter((el) => el.type === Line)}</Layer>

          {/* Selection Outline Layer (Always on top) */}
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

export default InfiniteGrid;