import { useState, useEffect } from 'react';
import localforage from 'localforage';

// Configure localforage
localforage.config({
    name: 'WardrobeManager',
    storeName: 'wardrobe_items'
});

export function useWardrobe() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const storedItems = await localforage.getItem('clothes') || [];
            setItems(storedItems);
        } catch (err) {
            console.error("Error loading items", err);
        } finally {
            setIsLoading(false);
        }
    };

    const addItem = async (item) => {
        const newItem = {
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            isAvailable: true, // Default to available
            ...item
        };
        
        try {
            const currentItems = await localforage.getItem('clothes') || [];
            const updatedItems = [newItem, ...currentItems];
            await localforage.setItem('clothes', updatedItems);
            setItems(updatedItems);
        } catch (err) {
            console.error("Error saving item", err);
        }
    };

    const removeItem = async (id) => {
        try {
            const currentItems = await localforage.getItem('clothes') || [];
            const updatedItems = currentItems.filter(item => item.id !== id);
            await localforage.setItem('clothes', updatedItems);
            setItems(updatedItems);
        } catch (err) {
            console.error("Error removing item", err);
        }
    };

    const toggleAvailability = async (id) => {
        try {
            const currentItems = await localforage.getItem('clothes') || [];
            const updatedItems = currentItems.map(item => 
                item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
            );
            await localforage.setItem('clothes', updatedItems);
            setItems(updatedItems);
        } catch (err) {
            console.error("Error toggling availability", err);
        }
    };

    return {
        items,
        isLoading,
        addItem,
        removeItem,
        toggleAvailability
    };
}
