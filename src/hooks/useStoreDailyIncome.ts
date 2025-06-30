import {useEffect, useState} from 'react';
import DatabaseManager from '../lib/manager';
import dayjs from 'dayjs';

export interface InsightItem {
  category: string;
  amount: number;
  percentage: number;
}

export interface InsightSummary {
  income: number;
  expense: number;
  difference: number;
  breakdown: InsightItem[];
}

export const useStoreDailyIncome = () => {
  const [summary, setSummary] = useState<InsightSummary | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const db = await DatabaseManager.getInstance();
      const today = dayjs().format('YYYY-MM-DD');

      db.transaction(tx => {
        tx.executeSql(
          `SELECT name, SUM(totalPaid) as total 
           FROM storeIncome 
           WHERE date(purchase_date) = date(?) 
           GROUP BY name`,
          [today],
          (_, result) => {
            let income = 0;
            const breakdown: InsightItem[] = [];

            const rows = result.rows;
            for (let i = 0; i < rows.length; i++) {
              const row = rows.item(i);
              const category = row.name;
              const amount = parseFloat(row.total);

              income += amount;
              breakdown.push({category, amount, percentage: 0});
            }

            const calculated = breakdown.map(item => ({
              ...item,
              percentage: income
                ? parseFloat(((item.amount / income) * 100).toFixed(1))
                : 0,
            }));

            setSummary({
              income,
              expense: 0,
              difference: income,
              breakdown: calculated,
            });
          },
          (_, error) => {
            console.error('Failed to fetch daily storeIncome:', error);
            return true;
          },
        );
      });
    };

    fetchData();
  }, []);

  return summary;
};
