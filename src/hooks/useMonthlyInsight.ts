import {useEffect, useState} from 'react';
import DatabaseManager from '../lib/manager';
type InsightItem = {
  category: string;
  amount: number;
  percentage: number;
};

type InsightSummary = {
  income: number;
  expense: number;
  difference: number;
  breakdown: InsightItem[];
};

export const useMonthlyInsight = () => {
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
          `SELECT type, category, SUM(amount) as total
           FROM transactions
           WHERE month_year = ?
           GROUP BY type, category`,
          [monthYear],
          (_, result) => {
            let income = 0;
            let expense = 0;
            const breakdown: InsightItem[] = [];

            const rows = result.rows;
            for (let i = 0; i < rows.length; i++) {
              const row = rows.item(i);
              const type = row.type;
              const category = row.category;
              const amount = parseFloat(row.total);

              if (type === 'income') {
                income += amount;
              } else if (type === 'expense') {
                expense += amount;
                breakdown.push({category, amount, percentage: 0}); // calculate % below
              }
            }

            const calculated = breakdown.map(item => ({
              ...item,
              percentage: parseFloat(
                ((item.amount / expense) * 100).toFixed(1),
              ),
            }));

            setSummary({
              income,
              expense,
              difference: income - expense,
              breakdown: calculated,
            });
          },
          (_, error) => {
            console.log('Failed to fetch insights:', error);
            return true;
          },
        );
      });
    };

    fetchData();
  }, []);

  return summary;
};
