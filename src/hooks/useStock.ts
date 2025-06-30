import {useState, useEffect, useCallback} from 'react';
import {
  insertStock,
  deleteStock,
  getAllStocks,
  updateStock,
} from '../lib/db/queries.stock';
type Stock = {
  id?: number;
  name: string;
  unit: string;
  stock: number;
  sellingPrice: number;
  purchasePrice: number;
  purchaseDate: string;
  note?: string;
};

export function useStocks() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllStocks();
      setStocks(data);
    } catch (err) {
      setError('Failed to load stocks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  const addStock = useCallback(
    async (stockData: Omit<Stock, 'id'>) => {
      setLoading(true);
      setError(null);
      try {
        const success = await insertStock(stockData);
        if (success) {
          await fetchStocks();
          return true;
        } else {
          setError('Insert failed');
          return false;
        }
      } catch (err) {
        setError('Insert failed', err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchStocks],
  );

  const editStock = useCallback(
    async (id: number, data: Partial<Omit<Stock, 'id' | 'userId'>>) => {
      setLoading(true);
      setError(null);
      try {
        const success = await updateStock(id, data);
        if (success) {
          await fetchStocks();
          return true;
        } else {
          setError('Update failed');
          return false;
        }
      } catch {
        setError('Update failed');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchStocks],
  );

  const removeStock = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      try {
        const success = await deleteStock(id);
        if (success) {
          await fetchStocks();
          return true;
        } else {
          setError('Delete failed');
          return false;
        }
      } catch {
        setError('Delete failed');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchStocks],
  );

  return {
    stocks,
    loading,
    error,
    fetchStocks,
    addStock,
    editStock,
    removeStock,
  };
}
