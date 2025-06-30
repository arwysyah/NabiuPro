import {useEffect, useState, useCallback} from 'react';
import {getAllTransactions} from '../lib/queries';

export interface Transaction {
  id: number;
  user_id: number;
  category_id: number;
  amount: number;
  note: string;
  date: string;
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: Transaction[] = await getAllTransactions();
      setTransactions(data);
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (err: any) {
      console.log('Failed to fetch transactions:', err.message || err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    refresh: fetchTransactions,
  };
};
