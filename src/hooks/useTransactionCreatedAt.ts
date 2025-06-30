import {useEffect, useState, useCallback} from 'react';
import {getTransactionsByCreatedAt} from '../lib/queries';
import {Transaction} from '../types/database';
import {Dayjs} from 'dayjs';

export const useTransactionsByCreatedDate = (date: Dayjs) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const formattedDate = date.format('DD/MM/YYYY');
      const data = await getTransactionsByCreatedAt(formattedDate);
      setTransactions(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {transactions, loading, error, refresh: fetchTransactions};
};
