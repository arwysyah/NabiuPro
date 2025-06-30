import DatabaseManager from './manager';

export const seedInitialData = async () => {
  const db = await DatabaseManager.getInstance();

  await db.executeSql(
    'INSERT OR IGNORE INTO users (id, name, email) VALUES (?, ?, ?)',
    [1, 'Default User', 'default@example.com'],
  );
};
