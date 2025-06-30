// hooks/useSellHistory.ts
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SELL_HISTORY_KEY = 'savedTemporary';

export type SellItem = {
  id: string | number;
  name: string;
  unit: string;
  stock: number;
  sellingPrice: number;
  purchasePrice: number;
  purchaseDate: string;
  totalPaid: string;
  idStock: string | number;
  note: string;
};

export const useSaveOrder = () => {
  const [history, setHistory] = useState<SellItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Load data
  const loadHistory = async () => {
    try {
      setLoading(true);
      const raw = await AsyncStorage.getItem(SELL_HISTORY_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setHistory(parsed);
    } catch (error) {
      console.error('Failed to load sell history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new item
  const addToHistory = async (item: SellItem) => {
    try {
      const updated = [...history, item];
      setHistory(updated);
      await AsyncStorage.setItem(SELL_HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save sell data:', error);
    }
  };

  // Remove one by ID
  const removeById = async (id: string | number) => {
    try {
      const filtered = history.filter(item => item.id !== id);
      setHistory(filtered);
      await AsyncStorage.setItem(SELL_HISTORY_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete sell data:', error);
    }
  };

  // Clear all
  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(SELL_HISTORY_KEY);
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return {
    history,
    loading,
    addToHistory,
    removeById,
    clearHistory,
    refresh: loadHistory,
  };
};
