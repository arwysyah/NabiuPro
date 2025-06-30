import DatabaseManager from '../manager';

export const selectAllCategoriesWithSubcategories = async (): Promise<
  {id: string; name: string; subCategories: string[]}[]
> => {
  const db = await DatabaseManager.getInstance();
  return new Promise((resolve, reject) => {
    db.executeSql(
      `
        SELECT 
          c.id as categoryId,
          c.name as categoryName,
          json_group_array(s.name) as subCategories
        FROM categories c
        LEFT JOIN sub_categories s ON s.category_id = c.id
        GROUP BY c.id
        `,
      [],
      (_, {rows}) => {
        const results = [];
        for (let i = 0; i < rows.length; i++) {
          const row = rows.item(i);
          results.push({
            id: row.categoryId,
            name: row.categoryName,
            subCategories: JSON.parse(row.subCategories || '[]'),
          });
        }
        resolve(results);
      },
      (_, error) => {
        reject(error);
        return false;
      },
    );
  });
};
