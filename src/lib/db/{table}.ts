import DatabaseManager from "../manager";


export const selectAll{TableCapitalized} = async (): Promise<any[]> => {
  try {
    const results = await DatabaseManager.executeSql(
      `SELECT * FROM {table} ORDER BY created_at DESC`,
    );

    const rows = [];
    const resultSet = results[0];
    for (let i = 0; i < resultSet.rows.length; i++) {
      rows.push(resultSet.rows.item(i));
    }
    return rows;
  } catch (error) {
    throw error;
  }
};
