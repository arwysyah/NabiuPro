import DatabaseManager from '../manager';

export const getPlansByParentId = async (idParent: number): Promise<any[]> => {
  const db = await DatabaseManager.getInstance();

  return new Promise<any[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM PlanByDate WHERE idParent = ? ORDER BY date DESC',
        [idParent],
        (_, {rows}) => {
          const result: any[] = [];
          for (let i = 0; i < rows.length; i++) {
            result.push(rows.item(i));
          }
          resolve(result);
        },
        (_, error) => {
          console.log('Error fetching plans by idParent:', error);
          reject(error);
          return false;
        },
      );
    });
  });
};
