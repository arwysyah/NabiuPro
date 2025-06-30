import {useEffect, useState} from 'react';
import {Transaction} from './useGetTransactions';
import {getTransactionsBetweenCreatedAt} from '../lib/queries';

export const useTransactionsBetweenCreatedAt = (
  startDate: string,
  endDate: string,
) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTransactionsBetweenCreatedAt(startDate, endDate);
        setTransactions(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  return {transactions, loading, error};
};
