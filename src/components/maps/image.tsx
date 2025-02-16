import React from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';

interface Structure {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  isSelected: boolean;
  isDragging?: boolean;
  itemPath: string;
}

type StructureProps = {
  structure: Structure;
};

const StructureComponent: React.FC<StructureProps> = ({ structure }) => {
  const [image] = useImage(structure.itemPath);

  return (
    <Image
      key={structure.id}
      x={structure.x}
      y={structure.y}
      width={structure.width}
      height={structure.height}
      image={image}
      stroke={structure.isDragging ? 'red' : 'transparent'}
      strokeWidth={structure.isDragging ? 3 : 0}
      draggable={true}
      onDragStart={() => {
        // Update the dragging state
      }}
      onDragMove={(e) => {
        // Drag snapping logic
      }}
      onDragEnd={(e) => {
        // Update position and clear dragging state
      }}
      onContextMenu={(e) => e.evt.preventDefault()}
    />
  );
};

export default StructureComponent;
