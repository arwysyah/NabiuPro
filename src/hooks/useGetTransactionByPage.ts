import {useCallback, useEffect, useState} from 'react';
import {Transaction} from 'react-native-sqlite-storage';
import {getAllTransactionByPAge} from '../lib/queries';

export const useGetTransactionByPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 12;

  const fetchTransactions = useCallback(
    async (reset = false) => {
      setLoading(true);
      setError(null);
      try {
        const offset = reset ? 0 : page * PAGE_SIZE;
        const data = await getAllTransactionByPAge(PAGE_SIZE, offset);

        if (reset) {
          setTransactions(data);
          setPage(1);
        } else {
          setTransactions(prev => [...prev, ...data]);
          setPage(prev => prev + 1);
        }

        setHasMore(data.length === PAGE_SIZE); // if less than 20, assume no more data
      } catch (err: any) {
        console.log('Failed to fetch transactions:', err.message || err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [page],
  );

  useEffect(() => {
    fetchTransactions(true); // Initial load
  }, []);

  return {
    transactions,
    loading,
    error,
    hasMore,
    refresh: () => fetchTransactions(true),
    loadMore: () => {
      if (!loading && hasMore) {
        fetchTransactions(false);
      }
    },
  };
};
