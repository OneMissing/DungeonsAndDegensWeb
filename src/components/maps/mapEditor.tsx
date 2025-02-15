'use client';

import Konva from 'konva';
import React, { useRef, useState, useCallback, useMemo, JSX } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';

const GRID_SIZE = 50;
const MIN_SCALE = 0.5;
const MAX_SCALE = 2;

const tileColors = {
  wall: 'black',
  sand: 'khaki',
  water: 'lightblue',
  wood: 'sienna',
  floor: 'lightgray', // Color representing an empty tile
};

const InfiniteGrid = () => {
  const stageRef = useRef<Konva.Stage | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeTile, setActiveTile] = useState('wall');
  const [selectionRect, setSelectionRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [tiles, setTiles] = useState<{ [key: string]: string | undefined }>({});
  const [selectionMode, setSelectionMode] = useState<'single' | 'rectangle'>('single');
  const [isSelecting, setIsSelecting] = useState(false);


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
      if (selectionMode === 'rectangle' && e.evt.button === 2) { // Right-click only
        e.evt.preventDefault(); // Prevent context menu from appearing
  
        const stage = stageRef.current;
        if (!stage) return;
  
        const pointer = stage.getPointerPosition();
        if (!pointer) return;
  
        const absPos = stage.getAbsolutePosition();
        const adjustedPointer = {
          x: (pointer.x - absPos.x) / scale,
          y: (pointer.y - absPos.y) / scale,
        };
  
        setSelectionRect({
          x: adjustedPointer.x,
          y: adjustedPointer.y,
          width: 0,
          height: 0,
        });
        setIsSelecting(true);
      }
    },
    [selectionMode, scale]
  );
  

  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!isSelecting || !selectionRect) return;
  
      const stage = stageRef.current;
      if (!stage) return;
  
      const pointer = stage.getPointerPosition();
      if (!pointer) return;
  
      const absPos = stage.getAbsolutePosition();
      const adjustedPointer = {
        x: (pointer.x - absPos.x) / scale,
        y: (pointer.y - absPos.y) / scale,
      };
  
      setSelectionRect((prevRect) => {
        if (!prevRect) return null;
  
        return {
          x: Math.min(prevRect.x, adjustedPointer.x),
          y: Math.min(prevRect.y, adjustedPointer.y),
          width: Math.abs(adjustedPointer.x - prevRect.x),
          height: Math.abs(adjustedPointer.y - prevRect.y),
        };
      });
    },
    [isSelecting, selectionRect, scale]
  );

  const handleMouseUp = useCallback(() => {
    if (!isSelecting || !selectionRect) return;
  
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
  
          if (activeTile === 'eraser') {
            delete updatedTiles[key]; // Erase tiles
          } else {
            updatedTiles[key] = activeTile; // Place selected tile type
          }
        }
      }
  
      return updatedTiles;
    });
  
    setSelectionRect(null);
    setIsSelecting(false);
  }, [isSelecting, selectionRect, activeTile, setTiles]);
  
    
    
  
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
  
    const width = stage.width() / scale;
    const height = stage.height() / scale;
  
    const startX = Math.floor(-position.x / GRID_SIZE) * GRID_SIZE;
    const endX = Math.ceil((-position.x + width) / GRID_SIZE) * GRID_SIZE;
    const startY = Math.floor(-position.y / GRID_SIZE) * GRID_SIZE;
    const endY = Math.ceil((-position.y + height) / GRID_SIZE) * GRID_SIZE;
  
    // Draw vertical grid lines
    for (let x = startX; x < endX; x += GRID_SIZE) {
      elements.push(<Line key={`v-${x}`} points={[x, startY, x, endY]} stroke="gray" strokeWidth={0.5} />);
    }
    // Draw horizontal grid lines
    for (let y = startY; y < endY; y += GRID_SIZE) {
      elements.push(<Line key={`h-${y}`} points={[startX, y, endX, y]} stroke="gray" strokeWidth={0.5} />);
    }
  
    // Ensure selectionRect is not null before using its properties
    if (selectionRect) {
      elements.push(
        <Rect
          key="selection" // Added a key to avoid React warnings
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
  
    // Iterate over tiles safely
    Object.entries(tiles).forEach(([key, tileType]) => {
      const [x, y] = key.split(',').map(Number);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return; // Avoid NaN errors
  
      elements.push(
        <Rect
          key={`tile-${key}`}
          x={x}
          y={y}
          width={GRID_SIZE}
          height={GRID_SIZE}
          fill={tileColors[tileType] || tileColors.floor}
        />
      );
    });
  
    return elements;
  }, [position, scale, tiles, selectionRect]); // Ensure selectionRect is included in dependencies
  

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '200px', padding: '10px', background: '#f0f0f0' }}>
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
      </div>
      <Stage
        width={window.innerWidth - 200} // Adjusting for sidebar width
        height={window.innerHeight}
        draggable
        onWheel={handleWheel}
        onDragMove={handleDragMove}
        onContextMenu={handleRightClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}  // Attach function here
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        ref={stageRef}
      >
        <Layer>{drawGrid}</Layer>
      </Stage>
    </div>
  );
};

export default InfiniteGrid;
