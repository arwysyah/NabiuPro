export type PlanByDate = {
  date: string; // format: YYYY-MM-DD
  title: string;
  idParent: number;
  amount: number;
};

export type SQLiteDatabase = {
  transaction: (
    callback: (tx: SQLiteTransaction) => void,
    errorCallback?: (error: any) => void,
    successCallback?: () => void,
  ) => void;
};

export type SQLiteTransaction = {
  executeSql: (
    sqlStatement: string,
    args?: any[],
    successCallback?: (tx: SQLiteTransaction, resultSet: any) => void,
    errorCallback?: (tx: SQLiteTransaction, error: any) => boolean,
  ) => void;
};
