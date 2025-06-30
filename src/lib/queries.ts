import {Transaction} from '../types/database';
import DatabaseManager from './manager';
export const getAllTransactions = async () => {
  const db = await DatabaseManager.getInstance();
  try {
    const [result] = await db.executeSql('SELECT * FROM transactions');
    const transactions: Transaction[] = [];
    const len = result.rows.length;
    for (let i = 0; i < len; i++) {
      transactions.push(result.rows.item(i));
    }
    transactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return transactions;
  } catch (error) {
    console.log('ERROR', error);
  }
};
export const getAllTransactionByPAge = async (limit = 20, offset = 0) => {
  const db = await DatabaseManager.getInstance();
  try {
    const [result] = await db.executeSql(
      'SELECT * FROM transactions ORDER BY date DESC LIMIT ? OFFSET ?',
      [limit, offset],
    );
    const transactions: Transaction[] = [];
    const len = result.rows.length;
    for (let i = 0; i < len; i++) {
      transactions.push(result.rows.item(i));
    }
    return transactions;
  } catch (error) {
    console.log('ERROR', error);
    throw error;
  }
};

export const getTransactionsBetweenCreatedAt = async (
  startDate: string,
  endDate: string,
): Promise<Transaction[]> => {
  const db = await DatabaseManager.getInstance();
  try {
    const [result] = await db.executeSql(
      `SELECT * FROM transactions
       WHERE created_at BETWEEN ? AND ?
       ORDER BY created_at DESC`,
      [startDate, endDate],
    );

    const transactions: Transaction[] = [];
    const len = result.rows.length;
    for (let i = 0; i < len; i++) {
      transactions.push(result.rows.item(i));
    }

    return transactions;
  } catch (error) {
    console.error('ERROR in getTransactionsByCreatedAt:', error);
    return [];
  }
};

export const getTransactionsByCreatedAt = async (
  createdAt: string,
): Promise<Transaction[]> => {
  console.log(createdAt);
  const db = await DatabaseManager.getInstance();
  try {
    const [result] = await db.executeSql(
      `SELECT * FROM transactions
       WHERE date = ?
       ORDER BY created_at DESC`,
      [createdAt],
    );

    const transactions: Transaction[] = [];
    const len = result.rows.length;
    for (let i = 0; i < len; i++) {
      transactions.push(result.rows.item(i));
    }

    return transactions;
  } catch (error) {
    console.error('ERROR in getTransactionsByCreatedAt:', error);
    return [];
  }
};

export const addTransaction = async (
  userId: number,
  categoryId: number,
  amount: number,
  note: string,
  date: string,
): Promise<void> => {
  try {
    const db = await DatabaseManager.getInstance();

    await db.transaction(async tx => {
      await tx.executeSql(
        `INSERT INTO transactions (user_id, category_id, amount, note, date) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId, categoryId, amount, note, date],
      );
    });
  } catch (error: any) {
    console.log('Error inserting transaction:', error?.message || error);
    throw error;
  }
};
