import {getUniqueId} from 'react-native-device-info';
import {defaultCategories, defaultSubcategories} from '../constants/categories';
import {PlanByDate} from '../types/sql';
import DatabaseManager from './manager';
// import RNFS from 'react-native-fs';
export const initTables = async (): Promise<void> => {
  const db = await DatabaseManager.getInstance();

  return new Promise<void>((resolve, reject) => {
    db.transaction(
      tx => {
        db.executeSql(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);
        // tx.executeSql('DROP TABLE IF EXISTS stocks;');
        // tx.executeSql('DROP TABLE IF EXISTS transactions;');
        tx.executeSql(`
  CREATE TABLE IF NOT EXISTS stocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  units TEXT,
  stock REAL NOT NULL,
    selling_price REAL NOT NULL,
  purchase_price REAL NOT NULL,
  purchase_date TEXT NOT NULL,
  note TEXT,
  created_at TEXT DEFAULT (datetime('now', 'localtime'))
  );
`);
        tx.executeSql(`
  CREATE TABLE IF NOT EXISTS storeIncome (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL,
  name TEXT NOT NULL,
  units TEXT,
  stock REAL NOT NULL,
  selling_price REAL NOT NULL,
  purchase_price REAL NOT NULL,
  totalPaid REAL NOT NULL,
  purchase_date TEXT NOT NULL,
  idStock TEXT NOT NULL,
  note TEXT,
  month TEXT,       
  year TEXT,       
  month_year TEXT,
  created_at TEXT DEFAULT (datetime('now', 'localtime'))
  );
`);
        tx.executeSql(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          type TEXT CHECK(type IN ('income', 'expense', 'bill', 'debts')),
          icon TEXT,
          UNIQUE(name, type)
        );
      `);
        tx.executeSql(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    title TEXT,
    category TEXT NOT NULL,
    category_id TEXT NOT NULL,
    subcategory TEXT,
    type TEXT CHECK(type IN ('income', 'expense')),
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    month TEXT,       
    year TEXT,       
    month_year TEXT,
    note TEXT,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(category_id) REFERENCES categories(id)
  );
`);

        tx.executeSql(`CREATE TABLE IF NOT EXISTS PlanByDate (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  date TEXT,
  idParent INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  amount INTEGER,
  user_id TEXT
);
`);
        tx.executeSql(`
        CREATE TABLE IF NOT EXISTS savings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT,
          name TEXT NOT NULL,
          amount REAL DEFAULT 0,
          note TEXT,
          created_at TEXT DEFAULT (datetime('now', 'localtime')),
          FOREIGN KEY(user_id) REFERENCES users(id)
        );
      `);
        tx.executeSql(`CREATE TABLE IF NOT EXISTS subcategories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  categoryId INTEGER NOT NULL,
  name TEXT NOT NULL,
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE(categoryId, name)  -- prevent duplicate subcategory names under same category
);`);
        tx.executeSql(`
        CREATE TABLE IF NOT EXISTS goals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT,
          name TEXT NOT NULL,
          target_amount REAL NOT NULL,
          saved_amount REAL DEFAULT 0,
          deadline TEXT,
          note TEXT,
          is_completed INTEGER DEFAULT 0,
          created_at TEXT DEFAULT (datetime('now', 'localtime')),
          FOREIGN KEY(user_id) REFERENCES users(id)
        );
      `);
        tx.executeSql(`
        CREATE TABLE IF NOT EXISTS debts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT,
          creditor TEXT NOT NULL,
          total_amount REAL NOT NULL,
          remaining_amount REAL NOT NULL,
          due_date TEXT,
          note TEXT,
          created_at TEXT DEFAULT (datetime('now', 'localtime')),
          FOREIGN KEY(user_id) REFERENCES users(id)
        );
      `);
        tx.executeSql(`
        CREATE TABLE IF NOT EXISTS bills (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT,
          name TEXT NOT NULL,
          amount REAL NOT NULL,
          due_date TEXT NOT NULL,
          is_paid INTEGER DEFAULT 0,
          is_recurring INTEGER DEFAULT 0,
          frequency TEXT CHECK(frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
          note TEXT,
          created_at TEXT DEFAULT (datetime('now', 'localtime')),
          FOREIGN KEY(user_id) REFERENCES users(id)
        );
        
      `);
        tx.executeSql(`
        CREATE TABLE IF NOT EXISTS debt (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          date TEXT NOT NULL,
          fromTo TEXT NOT NULL,
          amount REAL NOT NULL,
          status TEXT NOT NULL,
          note TEXT,
          created_at TEXT DEFAULT (datetime('now', 'localtime')),
          user_id TEXT
        );
        
      `);
        tx.executeSql(`
        CREATE TABLE IF NOT EXISTS receivable (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          date TEXT NOT NULL,
          fromTo TEXT NOT NULL,
          amount REAL NOT NULL,
          status TEXT NOT NULL,
          note TEXT,
          created_at TEXT DEFAULT (datetime('now', 'localtime')),
          user_id TEXT
        );
        
      `);
        tx.executeSql(`
 CREATE TABLE IF NOT EXISTS plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  amount REAL NOT NULL,
  startDate TEXT NOT NULL,
  endDate TEXT NOT NULL,
  createdAt TEXT DEFAULT (datetime('now', 'localtime')),
  modifiedAt TEXT DEFAULT (datetime('now', 'localtime')),
  paid INTEGER DEFAULT 0,
  note TEXT,
  user_id TEXT
);

`);
      },
      err => {
        console.log('Error creating tables:', err);
        reject(err);
      },
      () => {
        console.log('Tables initialized successfully!');
        resolve();
      },
    );
  });
};

export async function insertPlanByDate(plan: PlanByDate): Promise<boolean> {
  const {date, title, idParent, amount} = plan;
  const db = await DatabaseManager.getInstance();
  const userId = await getUniqueId();
  return new Promise(resolve => {
    db.transaction(
      tx => {
        tx.executeSql(
          `INSERT INTO PlanByDate (date, title, idParent, amount,user_id)
           VALUES (?, ?, ?, ?, ?)`,
          [date, title, idParent, amount, userId],
          () => resolve(true),
          (_, error) => {
            console.log('SQL execution error:', error);
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
}

export const insertPlan = async (
  title: string,
  amount: number,
  startDate: string,
  endDate: string,
  note?: string,
): Promise<boolean> => {
  const db = await DatabaseManager.getInstance();
  const userId = await getUniqueId();
  return new Promise<boolean>((resolve, reject) => {
    db.transaction(tx => {
      // Check duplicate plan by title and note (handle null note)
      tx.executeSql(
        `SELECT id FROM plans WHERE title = ? AND (note = ? OR (note IS NULL AND ? IS NULL)) LIMIT 1`,
        [title, note ?? null, note ?? null],
        (_, {rows}) => {
          if (rows.length > 0) {
            // Duplicate found, skip insertion
            console.log('Duplicate plan exists, skipping insert.');
            resolve(false);
          } else {
            // Insert new plan
            const now = new Date().toISOString();
            tx.executeSql(
              `INSERT INTO plans (title, amount, startDate, endDate, modifiedAt, paid, note,user_id)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
              [title, amount, startDate, endDate, now, 0, note ?? null, userId],
              () => {
                console.log('Plan inserted successfully');
                resolve(true);
              },
              (_, error) => {
                console.log('Insert plan error:', error);
                reject(error);
                return false;
              },
            );
          }
        },
        (_, error) => {
          console.log('Check duplicate plan error:', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

export const insertCategory = async (
  name: string,
  type: string,
  icon: string,
) => {
  const db = await DatabaseManager.getInstance();
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO categories (name, type, icon) VALUES (?, ?, ?)',
        [name, type, icon],
        () => resolve(),
        (_, error) => {
          console.log('Failed to insert category:', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

export const insertSubCategory = async (
  categoryName: string,
  subCategoryName: string,
) => {
  const db = await DatabaseManager.getInstance();
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT id FROM categories WHERE name = ? LIMIT 1',
        [categoryName],
        (_, {rows}) => {
          if (rows.length > 0) {
            const categoryId = rows.item(0).id;
            tx.executeSql(
              'INSERT INTO subcategories (categoryId, name) VALUES (?, ?)',
              [categoryId, subCategoryName],
              () => resolve(),
              (_, error) => {
                console.log('Failed to insert subcategory:', error);
                reject(error);
                return false;
              },
            );
          } else {
            reject(new Error('Category not found'));
          }
        },
      );
    });
  });
};

export const insertDefaultCategoriesAndSubcategories =
  async (): Promise<void> => {
    const db = await DatabaseManager.getInstance();

    // Categories with type and icon

    // Subcategories with reference by category name (to find ID after insert)

    return new Promise<void>((resolve, reject) => {
      db.transaction(
        tx => {
          // Insert categories first
          // biome-ignore lint/complexity/noForEach: <explanation>
          defaultCategories.forEach(cat => {
            tx.executeSql(
              'INSERT OR IGNORE INTO categories (name, type, icon) VALUES (?, ?, ?)',
              [cat.name, cat.type, cat.icon],
              () => {
                /* success callback */
              },
              (_, error) => {
                console.log(`Insert category failed: ${cat.name}`, error);
                return false; // rollback on error
              },
            );
          });

          // biome-ignore lint/complexity/noForEach: <explanation>
          defaultSubcategories.forEach(subcat => {
            tx.executeSql(
              'SELECT id FROM categories WHERE name = ? LIMIT 1',
              [subcat.categoryName],
              (_, {rows}) => {
                if (rows.length > 0) {
                  const categoryId = rows.item(0).id;
                  tx.executeSql(
                    'INSERT OR IGNORE INTO subcategories (categoryId, name) VALUES (?, ?)',
                    [categoryId, subcat.name],
                    () => {},
                    (_, error) => {
                      console.log(
                        `Insert subcategory failed: ${subcat.name}`,
                        error,
                      );
                      return false;
                    },
                  );
                } else {
                  console.warn(
                    `Category "${subcat.categoryName}" not found for subcategory "${subcat.name}"`,
                  );
                }
              },
              (_, error) => {
                console.log('Category lookup failed', error);
                return false;
              },
            );
          });
        },
        err => {
          console.log('Transaction failed:', err);
          reject(err);
        },
        () => {
          console.log('Categories and subcategories inserted');
          resolve();
        },
      );
    });
  };

export const initializeDatabase = async () => {
  try {
    await initTables();
    // await createDeviceUser();
    await insertDefaultCategoriesAndSubcategories();
    console.log('Database fully initialized');
  } catch (e) {
    console.log('Database initialization error:', e);
  }
};

export const dropAllTables = async (): Promise<void> => {
  const db = await DatabaseManager.getInstance();

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        const tables = [
          'users',
          'categories',
          'transactions',
          'PlanByDate',
          'savings',
          'subcategories',
          'goals',
          'debts',
          'bills',
          'plans',
          'storeIncome',
          'receivable',
          'stocks',
        ];

        tables.forEach(table => {
          tx.executeSql(`DROP TABLE IF EXISTS ${table};`);
        });
      },
      error => {
        console.error('Error dropping tables:', error);
        reject(error);
      },
      () => {
        console.log('All tables dropped');
        resolve();
      },
    );
  });
};
export async function getDatabaseSize(): Promise<number | null> {
  const db = await DatabaseManager.getInstance();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `PRAGMA page_size;`,
        [],
        (_, resultPageSize) => {
          const pageSize = resultPageSize.rows.item(0).page_size;

          tx.executeSql(
            `PRAGMA page_count;`,
            [],
            (_, resultPageCount) => {
              const pageCount = resultPageCount.rows.item(0).page_count;
              resolve(pageSize * pageCount); // size in bytes
            },
            (_, error) => {
              console.error('Failed to get page_count:', error);
              reject(error);
              return false;
            },
          );
        },
        (_, error) => {
          console.error('Failed to get page_size:', error);
          reject(error);
          return false;
        },
      );
    });
  });
}
