import DatabaseManager from '../manager';

export type PlanByDate = {
  id: number;
  title: string;
  date: string;
  idParent: number;
  createdAt: string;
};

export async function queryPlansByDate(date: string): Promise<PlanByDate[]> {
  const db = await DatabaseManager.getInstance();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM PlanByDate WHERE date = ? ORDER BY created_at DESC`,
        [date],
        (_, {rows}) => {
          const result: PlanByDate[] = [];
          for (let i = 0; i < rows.length; i++) {
            result.push(rows.item(i));
          }
          resolve(result);
        },
        (_, error) => {
          console.log('error s', error);
          reject(error);
          return false;
        },
      );
    });
  });
}
export async function queryPlansByDateAll(): Promise<PlanByDate[]> {
  const db = await DatabaseManager.getInstance();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      const sql = `SELECT * FROM PlanByDate ORDER BY created_at DESC`;
      const params: any[] = []; // no params needed

      tx.executeSql(
        sql,
        params,
        (_, {rows}) => {
          const result: PlanByDate[] = [];
          for (let i = 0; i < rows.length; i++) {
            result.push(rows.item(i));
          }

          resolve(result);
        },
        (_, error) => {
          console.log('error s', error);
          reject(error);
          return false;
        },
      );
    });
  });
}
