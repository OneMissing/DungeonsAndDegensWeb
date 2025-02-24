"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

interface Item {
  id: number;
  name: string;
  description: string;
  type: string; // Add type to the item interface
}

interface BookInventoryProps {
  character_id: string;
}

const BookInventory: React.FC<BookInventoryProps> = ({ character_id }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('all'); // Default to 'all' tab

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from('items').select('*');
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToInventory = async (itemId: number, itemType: string) => {
    try {
      // List of item types that should always create a new instance
      const uniqueInstanceTypes = ["helmet", "chestplate", "armor", "gauntlets", "boots", "weapon", "sword", "bow", "knife", "polearm", "axe", "staff", "wand", "shield"];

      if (uniqueInstanceTypes.includes(itemType)) {
        // If the item type is in the list, always insert a new record
        const { error: insertError } = await supabase
          .from('inventory')
          .insert([{ character_id, item_id: itemId, quantity: 1 }]);

        if (insertError) throw insertError;
      } else {
        // For other item types, check if the item already exists in the inventory
        const { data: existingItem, error: fetchError } = await supabase
          .from('inventory')
          .select('*')
          .eq('character_id', character_id)
          .eq('item_id', itemId)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

        if (existingItem) {
          // If item exists, increment the quantity
          const { error: updateError } = await supabase
            .from('inventory')
            .update({ quantity: existingItem.quantity + 1 })
            .eq('id', existingItem.id);

          if (updateError) throw updateError;
        } else {
          // If item does not exist, insert a new record
          const { error: insertError } = await supabase
            .from('inventory')
            .insert([{ character_id, item_id: itemId, quantity: 1 }]);

          if (insertError) throw insertError;
        }
      }
    } catch (error) {
      console.error('Error adding to inventory:', error);
    }
  };

  const itemTypes = Array.from(new Set(items.map((item) => item.type)));

  const filteredItems =
    activeTab === 'all'
      ? items
      : items.filter((item) => item.type === activeTab);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex h-full">
      <div className="w-1/5 border-r-1 border-yellow-400 h-full">
        <h2 className="text-lg font-bold mb-2 pb-2 w-full border-b-1 border-yellow-400">Categories</h2>
        <ul className="px-2 h-full overflow-auto">
          <li
            className={`mb-1 p-1 cursor-pointer ${activeTab === 'all' ? ' text-white' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </li>
          {itemTypes.map((type) => (
            <li
              key={type}
              className={`mb-1 p-1 cursor-pointer ${activeTab === type ? ' text-white' : ''}`}
              onClick={() => setActiveTab(type)}
            >
              {type}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-4/5 p-4">
        <h1 className="text-2xl font-bold mb-4">Items</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-1-light dark:bg-1-dark hover:bg-3-light dark:hover:bg-3-dark"
              onClick={() => addToInventory(item.id, item.type)}
            >
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-gray-600">{item.description}</p>
              <p className="text-sm text-gray-500">{item.type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookInventory;