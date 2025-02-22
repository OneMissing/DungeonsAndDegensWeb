import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Define the type for an item
type Item = {
  id: string;
  content: string;
};

// Define the type for a slot
type Slot = {
  id: string;
  items: Item[];
};

// Define the initial state for the inventory
const initialSlots: Slot[] = [
  {
    id: 'slot-1',
    items: [
      { id: 'item-1', content: 'Sword' },
      { id: 'item-2', content: 'Shield' },
    ],
  },
  {
    id: 'slot-2',
    items: [
      { id: 'item-3', content: 'Potion' },
      { id: 'item-4', content: 'Arrow' },
    ],
  },
  {
    id: 'equipped',
    items: [{ id: 'item-5', content: 'Helmet' }],
  },
];

// Define the item type for react-dnd
const ItemTypes = {
  ITEM: 'item',
};

// Draggable Item Component
const DraggableItem: React.FC<{
  item: Item;
  index: number;
  slotId: string;
  moveItem: (fromSlot: string, toSlot: string, fromIndex: number, toIndex: number) => void;
}> = ({ item, index, slotId, moveItem }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ITEM,
    item: { id: item.id, index, slotId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        userSelect: 'none',
        padding: '16px',
        margin: '0 0 8px 0',
        minHeight: '50px',
        backgroundColor: isDragging ? '#ddd' : '#fff',
        borderRadius: '5px',
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {item.content}
    </div>
  );
};

// Droppable Slot Component
const DroppableSlot: React.FC<{
  slot: Slot;
  moveItem: (fromSlot: string, toSlot: string, fromIndex: number, toIndex: number) => void;
}> = ({ slot, moveItem }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.ITEM,
    drop: (item: { id: string; index: number; slotId: string }) => {
      if (item.slotId !== slot.id) {
        moveItem(item.slotId, slot.id, item.index, slot.items.length);
      }
    },
  });

  return (
    <div
      ref={drop}
      style={{
        width: '200px',
        minHeight: '200px',
        backgroundColor: '#f4f4f4',
        padding: '10px',
        margin: '10px',
        borderRadius: '5px',
      }}
    >
      <h3>{slot.id === 'equipped' ? 'Equipped' : `Slot ${slot.id}`}</h3>
      {slot.items.map((item, index) => (
        <DraggableItem key={item.id} item={item} index={index} slotId={slot.id} moveItem={moveItem} />
      ))}
    </div>
  );
};

// Main Inventory Component
const Inventory: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>(initialSlots);

  const moveItem = (fromSlotId: string, toSlotId: string, fromIndex: number, toIndex: number) => {
    const fromSlot = slots.find((slot) => slot.id === fromSlotId);
    const toSlot = slots.find((slot) => slot.id === toSlotId);

    if (!fromSlot || !toSlot) {
      return;
    }

    const [removedItem] = fromSlot.items.splice(fromIndex, 1);
    toSlot.items.splice(toIndex, 0, removedItem);

    setSlots([...slots]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {slots.map((slot) => (
          <DroppableSlot key={slot.id} slot={slot} moveItem={moveItem} />
        ))}
      </div>
    </DndProvider>
  );
};

export default Inventory;