import DatabaseManager from '../manager';

export type User = {
  id: string;
  name: string;
};

export const getUser = async (deviceId: string): Promise<User | null> => {
  try {
    const db = await DatabaseManager.getInstance();

    return await new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM users WHERE id = ?',
          [deviceId],
          (_, result) => {
            if (result.rows.length > 0) {
              const row = result.rows.item(0);
              resolve({id: row.id, name: row.name});
            } else {
              resolve(null);
            }
          },
          (_, error) => {
            console.log('Failed to get user:', error);
            reject(error);
            return false;
          },
        );
      });
    });
  } catch (error) {
    console.log('Database access error:', error);
    throw error;
  }
};
