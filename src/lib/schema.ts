import {getUniqueId} from 'react-native-device-info';
import DatabaseManager from './manager';
export const createDeviceUser = async (): Promise<void> => {
  try {
    const deviceId = await getUniqueId();

    const db = await DatabaseManager.getInstance();

    return new Promise<void>((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT OR IGNORE INTO users (id, name) VALUES (?, ?)',
          // biome-ignore lint/style/useTemplate: <explanation>
          [deviceId, 'Anonymous' + deviceId],
          () => {
            resolve();
          },
          (_, err) => {
            console.log('Insert user failesd:', err);
            reject(err);
            return false;
          },
        );
      });
    });
  } catch (error) {
    console.log('createDeviceUser failed:', error);
    throw error;
  }
};

export const insertDebtOrReceivable = async ({
  title,
  date,
  type,
  fromTo,
  amount,
  note,
}: {
  title: string;
  date: string;
  type: string;
  fromTo: string;
  amount: string;
  note?: string;
}) => {
  try {
    const userId = await getUniqueId();
    await DatabaseManager.executeSql(
      `
      INSERT INTO ${type} 
      (title,  fromTo, amount, date, note, status, user_id)
      VALUES (?, ?, ?, ?, ?, ? ,?)
      `,
      [title, fromTo, amount, date, note || null, 'pending', userId],
    );

    return true;
  } catch (error) {
    console.log('Failed to insert debt or receivable:', error);
    return false;
  }
};

export const selectDebtOrReceivable = async (type: 'debt' | 'receivable') => {
  try {
    const result = await DatabaseManager.executeSql(
      `
      SELECT id, title, fromTo, amount, date, note, created_at , status
      FROM ${type}
      ORDER BY date DESC
      `,
    );

    const rows = result[0].rows;
    const data: any[] = [];

    for (let i = 0; i < rows.length; i++) {
      data.push(rows.item(i));
    }

    return data;
  } catch (error) {
    console.log('Failed to select debt or receivable:', error);
    return [];
  }
};

export const deleteDebtOrReceivable = async ({
  id,
  type,
}: {
  id: number;
  type: string;
}) => {
  try {
    await DatabaseManager.executeSql(
      `
      DELETE FROM ${type}
      WHERE id = ?
      `,
      [id],
    );

    return true;
  } catch (error) {
    console.log('Failed to delete debt or receivable:', error);
    return false;
  }
};

export const markAsPaid = async (type: 'debt' | 'receivable', id: string) => {
  try {
    await DatabaseManager.executeSql(
      `
      UPDATE ${type}
      SET status = 'completed'
      WHERE id = ?
      `,
      [id],
    );
    return true;
  } catch (error) {
    console.error('Failed to update status to completed:', error);
    return false;
  }
};

export const insertTransaction = async ({
  title,
  categoryId,
  type,
  amount,
  date,
  category,
  subcategory,
  note,
}: {
  title: string;
  categoryId: string;
  type: 'income' | 'expense';
  amount: string;
  date: string;
  category: string;
  subcategory: string;
  note?: string;
}) => {
  const dates = new Date(); // or new Date(data.date)
  const month = String(dates.getMonth() + 1).padStart(2, '0'); // '06'
  const year = String(dates.getFullYear()); // '2025'
  const monthYear = `${month}-${year}`;
  try {
    const userId = await getUniqueId();

    await DatabaseManager.executeSql(
      `
      INSERT INTO transactions (
    user_id, title, category, category_id, subcategory,
    type, amount, date, month, year, month_year, note
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        title,
        category,
        categoryId,
        subcategory,
        type,
        amount,
        date,
        month,
        year,
        monthYear,
        note,
      ],
    );
    return true;
  } catch (error) {
    console.log('Failed to insert transaction:', error);
    return false;
  }
};

export const updateTransaction = async ({
  id,
  title,
  categoryId,
  type,
  amount,
  date,
  category,
  subcategory,
  note,
}: {
  id: string; // transaction id to update
  title: string;
  categoryId: string;
  type: 'savings' | 'debt' | 'loan' | 'investment' | 'income' | 'expense';
  amount: string;
  date: string;
  category: string;
  subcategory: string;
  note?: string;
}) => {
  try {
    await DatabaseManager.executeSql(
      `
      UPDATE transactions
      SET title = ?, category = ?, subcategory = ?, category_id = ?, type = ?, amount = ?, date = ?, note = ?
      WHERE id = ?
      `,
      [
        title,
        category,
        subcategory,
        categoryId,
        type,
        amount,
        date,
        note || null,
        id,
      ],
    );
    return true;
  } catch (error) {
    console.log('Failed to update transaction:', error);
    return false;
  }
};
export const deleteTransaction = async (id: string) => {
  try {
    await DatabaseManager.executeSql(
      `
      DELETE FROM transactions
      WHERE id = ?
      `,
      [id],
    );
    return true;
  } catch (error) {
    console.log('Failed to delete transaction:', error);
    return false;
  }
};
