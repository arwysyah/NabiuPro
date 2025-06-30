import {useEffect, useState} from 'react';
import {getPlansByParentId} from '../lib/db/queries.planByDateId';

export const usePlansByParentId = (idParent: number) => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    getPlansByParentId(idParent)
      .then(data => {
        if (isMounted) setPlans(data);
      })
      .catch(err => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [idParent]);

  return {plans, loading, error};
};
