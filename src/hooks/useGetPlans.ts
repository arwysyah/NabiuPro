import {useEffect, useState, useCallback} from 'react';
import {getAllPlan} from '../lib/db/queries.plan';

export const useGetAllPlans = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllPlan();
      setPlans(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return {plans, loading, error, refetch: fetchPlans};
};
