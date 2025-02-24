"use client";
import React from "react";

type GridItemEffectsProps = {
    grid: any[];
    itemEffectsMap: Record<string, any[]>;
};

const GridItemEffects: React.FC<GridItemEffectsProps> = ({ grid, itemEffectsMap }) => {
    const handleShowEffects = () => {
        const selectedTiles = grid.slice(64, 70);
        selectedTiles.forEach((tile) => {
            if (tile.item) {
                const effects = itemEffectsMap[tile.item.id] || [];
                console.log(`Item: ${tile.item.name}, Effects:`, effects);
            }
        });
    };

    return (
        <div className="mt-4">
            <button onClick={handleShowEffects} className="px-4 py-2 bg-blue-500 text-white rounded">
                Show Item Effects (Tiles 64-69)
            </button>
        </div>
    );
};

export default GridItemEffects;
