type Item = {
	id: string;
    item_id?: string;
	name: string;
	quantity: number;
	description?: string;
	type: string;
	weight?: number;
	value?: number;
};

type Tile = {
	id: string;
	item: Item | null;
	isTrash?: boolean;
	isSideSlot?: boolean;
	slotType?: string;
};