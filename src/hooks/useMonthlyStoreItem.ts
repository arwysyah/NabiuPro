import {useEffect, useState, useCallback} from 'react';
import DatabaseManager from '../lib/manager';

export type TransactionItem = {
  id: number;
  userId: string;
  name: string;
  units?: string;
  stock: number;
  selling_price: number;
  purchase_price: number;
  totalPaid: number;
  purchase_date: string;
  idStock: string;
  note?: string;
  month?: string;
  year?: string;
  month_year?: string;
};

export const useMonthlyStoreIncomeItem = () => {
  const [list, setList] = useState<TransactionItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const db = await DatabaseManager.getInstance();

      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM storeIncome ORDER BY purchase_date DESC`,
          [],
          (_, result) => {
            const data: TransactionItem[] = [];
            const rows = result.rows;

            for (let i = 0; i < rows.length; i++) {
              const row = rows.item(i);
              data.push({
                id: row.id,
                userId: row.userId,
                name: row.name,
                units: row.units,
                stock: row.stock,
                selling_price: row.selling_price,
                purchase_price: row.purchase_price,
                totalPaid: row.totalPaid,
                purchase_date: row.purchase_date,
                idStock: row.idStock,
                note: row.note,
                month: row.month,
                year: row.year,
                month_year: row.month_year,
              });
            }

            setList(data);
            setLoading(false);
          },
          (_, err) => {
            console.error('SQL error:', err);
            setError('Failed to fetch transactions');
            setLoading(false);
            return true;
          },
        );
      });
    } catch (e) {
      console.error('DB error:', e);
      setError('Unexpected error occurred');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {list, loading, error, refetch: fetchData};
};
