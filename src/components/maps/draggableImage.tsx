import React from 'react';
import { Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';

interface DraggableImageProps {
  imageUrl: string;
  x: number;
  y: number;
}

const DraggableImage: React.FC<DraggableImageProps> = ({ imageUrl, x, y }) => {
  const [image] = useImage(imageUrl);
  return <KonvaImage image={image} x={x} y={y} draggable />;
};

export default DraggableImage;
