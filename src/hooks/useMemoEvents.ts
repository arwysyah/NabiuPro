// hooks/useMemoEvents.ts
import {useMemo} from 'react';
import dayjs from 'dayjs';

export function useMemoEvents(plans: any[] | undefined) {
  return useMemo(() => {
    if (!plans || !Array.isArray(plans)) return {};

    const result: Record<string, any[]> = {};

    plans.forEach(plan => {
      const start = dayjs(plan.startDate);
      const end = dayjs(plan.endDate);

      for (
        let date = start;
        date.isBefore(end) || date.isSame(end, 'day');
        date = date.add(1, 'day')
      ) {
        const dateStr = date.format('YYYY-MM-DD');
        if (!result[dateStr]) result[dateStr] = [];
        result[dateStr].push(plan); // Store full plan object
      }
    });

    return result;
  }, [plans]);
}
