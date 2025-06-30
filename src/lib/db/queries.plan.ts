import DatabaseManager from '../manager';

export const getAllPlan = async (): Promise<any[]> => {
  const db = await DatabaseManager.getInstance();

  return new Promise<any[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM plans ORDER BY startDate DESC`,
        [],
        (_, {rows}) => {
          const result: any[] = [];
          for (let i = 0; i < rows.length; i++) {
            result.push(rows.item(i));
          }
          resolve(result);
        },
        (_, error) => {
          console.log('Error fetching plans:', error);
          reject(error);
          return false;
        },
      );
    });
  });
};
