import {useCallback, useState} from 'react';
import {deleteDebtOrReceivable} from '../lib/schema';

export const useDeleteDebtOrReceivable = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(
    async (
      data: {id: number; type: string},
      load: () => void, // callback to refresh data
    ) => {
      setLoading(true);
      setError(null);
      try {
        const success = await deleteDebtOrReceivable(data);
        if (success) {
          load(); // refresh after deletion
        }
        return success;
      } catch (e: any) {
        setError(e.message || 'Unknown error');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {remove, loading, error};
};
