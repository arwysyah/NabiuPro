import {useEffect, useState} from 'react';
import DatabaseManager from '../lib/manager';

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

export const useStoreMonthlyIncome = () => {
  const [summary, setSummary] = useState<InsightSummary | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const db = await DatabaseManager.getInstance();
      const date = new Date();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear());
      const monthYear = `${month}-${year}`;

      db.transaction(tx => {
        tx.executeSql(
          `SELECT name, SUM(totalPaid) as total 
           FROM storeIncome 
           WHERE month_year = ?
           GROUP BY name`,
          [monthYear],
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

            // Calculate percentage for each product
            const calculated = breakdown.map(item => ({
              ...item,
              percentage: parseFloat(((item.amount / income) * 100).toFixed(1)),
            }));

            setSummary({
              income,
              expense: 0,
              difference: income, // since no expense involved
              breakdown: calculated,
            });
          },
          (_, error) => {
            console.error('Failed to fetch storeIncome:', error);
            return true;
          },
        );
      });
    };

    fetchData();
  }, []);

  return summary;
};
