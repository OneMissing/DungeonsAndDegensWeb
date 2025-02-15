// components/ModeSelector.tsx
"use client"
import React from 'react';

interface ModeSelectorProps {
  mode: 'wall' | 'rectangle' | 'tile';
  setMode: React.Dispatch<React.SetStateAction<'wall' | 'rectangle' | 'tile'>>;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, setMode }) => {
  return (
    <div><div>
    <button onClick={() => setMode('wall')} disabled={mode === 'wall'}>
      Wall
    </button>
    <button onClick={() => setMode('rectangle')} disabled={mode === 'rectangle'}>
      Rectangle
    </button>
    <button onClick={() => setMode('tile')} disabled={mode === 'tile'}>
      Tile
    </button>
  </div>
    
  </div>
  );
};

export default ModeSelector;
