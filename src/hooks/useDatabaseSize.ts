import {useEffect, useState, useCallback} from 'react';

import {useFocusEffect} from '@react-navigation/native';
import {getDatabaseSize} from '../lib/init';

export function useDatabaseSize() {
  const [size, setSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSize = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dbSize = await getDatabaseSize();
      setSize(dbSize);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSize();
    }, [fetchSize]),
  );

  return {size, loading, error, refresh: fetchSize};
}
