import db from './db';

export const seedDatabase = async () => {
  await db.transaction(async tx => {
    await tx.execute(`INSERT OR IGNORE INTO users (name, email) VALUES 
      ('Alice', 'alice@email.com'),
      ('Bob', 'bob@email.com');`);

    await tx.execute(`INSERT OR IGNORE INTO categories (name, type, icon, color) VALUES
      ('Salary', 'income', '💼', '#4CAF50'),
      ('Bonus', 'income', '💰', '#8BC34A'),
      ('Groceries', 'expense', '🛒', '#F44336'),
      ('Transport', 'expense', '🚗', '#03A9F4'),
      ('Utilities', 'expense', '💡', '#9C27B0');`);

    await tx.execute(`INSERT OR IGNORE INTO tags (name) VALUES 
      ('Essential'), ('Fun'), ('Recurring'), ('One-time');`);

    await tx.execute(`INSERT OR IGNORE INTO transactions 
      (user_id, category_id, amount, note, date) VALUES
      (1, 1, 5000, 'Monthly salary', '2025-05-01'),
      (1, 3, -120, 'Supermarket shopping', '2025-05-02'),
      (1, 4, -30, 'Bus ticket', '2025-05-03'),
      (1, 2, 1000, 'Project bonus', '2025-05-04');`);

    await tx.execute(`INSERT OR IGNORE INTO transaction_tags 
      (transaction_id, tag_id) VALUES
      (1, 3), (2, 1), (3, 1), (4, 4);`);
  });
};
