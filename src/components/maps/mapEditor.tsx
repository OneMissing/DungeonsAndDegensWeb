'use client';

import Konva from 'konva';
import React, { useRef, useState, useCallback, useMemo, JSX } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';
import useChampions from './useChampions';

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
  const [activeTab, setActiveTab] = useState<'tiles' | 'champions'>('tiles');

  const [selectionRect, setSelectionRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [tiles, setTiles] = useState<{ [key: string]: string | undefined }>({});
  const [selectionMode, setSelectionMode] = useState<'single' | 'rectangle'>('single');
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
  
  const handleChampionDragStart = (e: React.DragEvent<HTMLDivElement>, champion: Champion) => {
    e.dataTransfer.setData('championId', String(champion.id));
  };
  

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

  const handleDragMove = useCallback((e: { target: { x: () => any; y: () => any; }; }) => {
    setPosition({ x: e.target.x(), y: e.target.y() });
  }, []);

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
  
      if (e.evt.button === 2) { // ✅ Right-click only
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
    
    if (selectionMode === 'rectangle' && selectionRect) {
      const startX = Math.min(selectionRect.x, selectionRect.x + selectionRect.width);
      const endX = Math.max(selectionRect.x, selectionRect.x + selectionRect.width);
      const startY = Math.min(selectionRect.y, selectionRect.y + selectionRect.height);
      const endY = Math.max(selectionRect.y, selectionRect.y + selectionRect.height);
  
      setTiles((prevTiles) => {
        const updatedTiles = { ...prevTiles }; // Copy previous tiles
  
        for (let x = startX; x < endX; x += GRID_SIZE) {
          for (let y = startY; y < endY; y += GRID_SIZE) {
            const gridX = Math.floor(x / GRID_SIZE) * GRID_SIZE;
            const gridY = Math.floor(y / GRID_SIZE) * GRID_SIZE;
            const key = `${gridX},${gridY}`;
  
            if (activeTile === 'eraser') {
              delete updatedTiles[key]; // ✅ Erase tile
            } else {
              updatedTiles[key] = activeTile; // ✅ Place tile
            }
          }
        }
        
        return updatedTiles; // Return modified tiles
      });
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
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
  
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
  
  return (
    <div style={{ display: 'flex' }}>
<div style={{ width: '200px', padding: '10px', background: '#f0f0f0' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
    <button onClick={() => setActiveTab('tiles')} style={{ flex: 1, padding: '8px', background: activeTab === 'tiles' ? '#ddd' : '#fff' }}>Tiles</button>
    <button onClick={() => setActiveTab('champions')} style={{ flex: 1, padding: '8px', background: activeTab === 'champions' ? '#ddd' : '#fff' }}>Champions</button>
  </div>

  {activeTab === 'tiles' ? (
    <>
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
      <div>
        <button onClick={() => setSelectionMode('single')}>Single Tile</button>
        <button onClick={() => setSelectionMode('rectangle')}>Rectangle Select</button>
      </div>
    </>
  ) : (
    <>
      <h3>Select Champion</h3>
      {champions.map((champion) => (
        <div
          key={champion.id}
          draggable
          onDragStart={(e) => handleChampionDragStart(e, champion)}
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
      ))}
    </>
  )}
</div>

  
      <Stage
  width={window.innerWidth - 200} // Adjust for sidebar width
  height={window.innerHeight}
  draggable
  onWheel={handleWheel}
  onDragMove={handleDragMove}
  onContextMenu={handleRightClick}
  onMouseDown={handleMouseDown}
  onMouseMove={handleMouseMove}
  onMouseUp={handleMouseUp}
  scaleX={scale}
  scaleY={scale}
  x={position.x}
  y={position.y}
  ref={stageRef}
>
  {/* Tiles Layer (Below everything) */}
  <Layer>{drawGrid.filter((el) => el.type === Rect)}</Layer>

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
  );
  
};

export default InfiniteGrid;
