import {getUniqueId} from 'react-native-device-info';
import DatabaseManager from '../manager';

export const insertStock = async (stocks: {
  userId: string;
  name: string;
  unit: string;
  stock: number;
  purchasePrice: number;
  sellingPrice: number;
  purchaseDate: string;
  note?: string;
}): Promise<boolean> => {
  const db = await DatabaseManager.getInstance();
  const {name, unit, stock, sellingPrice, purchasePrice, purchaseDate, note} =
    stocks;
  return new Promise(resolve => {
    db.transaction(
      tx => {
        tx.executeSql(
          `INSERT INTO stocks (name, units, stock, purchase_price,selling_price, purchase_date, note)
           VALUES (?, ?, ?,?, ?, ?, ?)`,
          [
            name,
            unit ?? null,
            stock,
            purchasePrice,
            sellingPrice,
            purchaseDate,
            note ?? null,
          ],
          () => resolve(true),
          (_, error) => {
            console.log('Insert stock error:', error);
            resolve(false);
            return false;
          },
        );
      },
      error => {
        console.log('Transaction error:', error);
        resolve(false);
      },
    );
  });
};
export const insertIntoSell = async (stocks: {
  name: string;
  unit: string;
  stock: number;
  purchasePrice: number;
  sellingPrice: number;
  purchaseDate: string;
  totalPaid: string;
  idStock: string;
  note?: string;
}): Promise<boolean> => {
  const db = await DatabaseManager.getInstance();
  const {
    name,
    unit,
    stock,
    sellingPrice,
    purchasePrice,
    purchaseDate,
    note,
    idStock,
    totalPaid,
  } = stocks;
  const userId = await getUniqueId();
  return new Promise(resolve => {
    const dates = new Date(); // or new Date(data.date)
    const month = String(dates.getMonth() + 1).padStart(2, '0'); // '06'
    const year = String(dates.getFullYear()); // '2025'
    const monthYear = `${month}-${year}`;
    db.transaction(
      tx => {
        tx.executeSql(
          `INSERT INTO storeIncome (userId,name, units, stock, selling_price,purchase_price,totalPaid, purchase_date, note,idStock,month,year,month_year)
           VALUES (?, ?, ?, ?,?, ?, ?, ?, ?,?,?,?,?)`,
          [
            userId,
            name,
            unit ?? null,
            stock,

            sellingPrice,
            purchasePrice,
            totalPaid,
            purchaseDate,
            note ?? null,
            idStock,
            month,
            year,
            monthYear,
          ],
          () => resolve(true),
          (_, error) => {
            console.log('Insert stock error:', error);
            resolve(false);
            return false;
          },
        );
      },
      error => {
        console.log('Transaction error:', error);
        resolve(false);
      },
    );
  });
};

export const updateStock = async (stocks: {
  id: number; // Primary key of the stock to update
  name?: string;
  unit?: string;
  stock?: number;
  purchasePrice?: number;
  sellingPrice?: number;
  purchaseDate?: string;
  note?: string;
}): Promise<boolean> => {
  const db = await DatabaseManager.getInstance();

  // Build dynamic set clause and values
  const fields: any = [];
  const values: any[] = [];

  if (stocks.name !== undefined) {
    fields.push('name = ?');
    values.push(stocks.name);
  }
  if (stocks.unit !== undefined) {
    fields.push('units = ?');
    values.push(stocks.unit);
  }
  if (stocks.stock !== undefined) {
    fields.push('stock = ?');
    values.push(stocks.stock);
  }
  if (stocks.purchasePrice !== undefined) {
    fields.push('purchase_price = ?');
    values.push(stocks.purchasePrice);
  }
  if (stocks.sellingPrice !== undefined) {
    fields.push('selling_price = ?');
    values.push(stocks.sellingPrice);
  }
  if (stocks.purchaseDate !== undefined) {
    fields.push('purchase_date = ?');
    values.push(stocks.purchaseDate);
  }
  if (stocks.note !== undefined) {
    fields.push('note = ?');
    values.push(stocks.note);
  }

  // Prevent empty update
  if (fields.length === 0) return false;

  values.push(stocks.id); // ID is always the last parameter

  return new Promise(resolve => {
    db.transaction(
      tx => {
        tx.executeSql(
          `UPDATE stocks SET ${fields.join(', ')} WHERE id = ?`,
          values,
          () => {
            console.log('Success');
            resolve(true);
          },
          (_, error) => {
            console.log('Update stock error:', error);
            resolve(false);
            return false;
          },
        );
      },
      error => {
        console.log('Transaction error:', error);
        resolve(false);
        return false;
      },
    );
  });
};

export const getSellStore = async (): Promise<any[]> => {
  const db = await DatabaseManager.getInstance();
  const userId = await getUniqueId();

  return new Promise(resolve => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM storeIncome WHERE userId = ? ORDER BY purchase_date DESC`,
        [userId],
        (_, result) => {
          const rows = result.rows;
          const data: any[] = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows.item(i));
          }
          resolve(data);
        },
        (_, error) => {
          console.log('Select storeIncome error:', error);
          resolve([]);
          return false;
        },
      );
    });
  });
};

export const deleteStock = async (id: number): Promise<boolean> => {
  const db = await DatabaseManager.getInstance();
  return new Promise(resolve => {
    db.transaction(
      tx => {
        tx.executeSql(
          'DELETE FROM stocks WHERE id = ?',
          [id],
          () => resolve(true),
          (_, error) => {
            console.log('Delete stock error:', error);
            resolve(false);
            return false;
          },
        );
      },
      error => {
        console.log('Transaction error:', error);
        resolve(false);
      },
    );
  });
};
export const getAllStocks = async (): Promise<any[]> => {
  const db = await DatabaseManager.getInstance();
  return new Promise(resolve => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM stocks ORDER BY created_at DESC',
        [],
        (_, {rows}) => {
          const data: any[] = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows.item(i));
          }
          resolve(data);
        },
        (_, error) => {
          console.log('Fetch stocks error:', error);
          resolve([]);
          return false;
        },
      );
    });
  });
};
