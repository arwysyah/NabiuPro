import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
SQLite.enablePromise(true);
export const dbName = 'ADdas_nsabsiu.db';
class DatabaseManager {
  private static instance: SQLiteDatabase | null = null;
  public static async getInstance(): Promise<SQLiteDatabase> {
    if (this.instance === null) {
      this.instance = await SQLite.openDatabase({
        name: dbName,
        location: 'default',
      });
    }
    return this.instance;
  }
  public static async close(): Promise<void> {
    if (this.instance !== null) {
      await this.instance.close();
      this.instance = null;
    }
  }
  public static async executeSql(
    query: string,
    params: any[] = [],
  ): Promise<SQLite.ResultSet[]> {
    const db = await this.getInstance();
    const result = await db.executeSql(query, params);
    return result;
  }
  public static async transaction(
    transactionCallback: (tx: SQLite.Transaction) => void,
  ): Promise<void> {
    const db = await this.getInstance();
    await db.transaction(transactionCallback);
  }
}
export default DatabaseManager;
