import {useEffect, useState} from 'react';
import {PlanByDate} from '../types/sql';
import {
  queryPlansByDate,
  queryPlansByDateAll,
} from '../lib/db/queries.planByDate';

export function usePlansByDate(date: string) {
  const [plans, setPlans] = useState<PlanByDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      const result = await queryPlansByDate(date);
      setPlans(result);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (date) {
      refetch();
    }
  }, [date]);

  return {plans, loading, error, refetch};
}

export function usePlansByDateAll() {
  const [plans, setPlans] = useState<PlanByDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      const result = await queryPlansByDateAll();
      setPlans(result);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refetch();
  }, []);

  return {plans, loading, error, refetch};
}
