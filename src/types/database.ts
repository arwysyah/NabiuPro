export type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

export type Category = {
  id: number;
  name: string;
  type: 'income' | 'expense' | 'debt';
  icon?: string;
  color?: string;
};

export type Tag = {
  id: number;
  name: string;
};

export type Transaction = {
  id: number;
  user_id: number;
  category_id: number;
  amount: number;
  note?: string;
  date: string;
  created_at: string;
};

export type TransactionWithCategory = Transaction & {
  category_name: string;
  icon?: string;
  color?: string;
};

export type TransactionTag = {
  transaction_id: number;
  tag_id: number;
};
