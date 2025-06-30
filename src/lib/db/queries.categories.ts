import DatabaseManager from '../manager';

export const selectAllCategoriesWithSubcategories = async (): Promise<
  {
    id: number;
    name: string;
    subCategories: string[];
    categoryType: string;
    categoryIcon: string;
  }[]
> => {
  try {
    const results = await DatabaseManager.executeSql(
      `
 SELECT 
  c.id AS categoryId,
  c.name AS categoryName,
  c.type AS categoryType,
  c.icon AS categoryIcon,
  json_group_array(s.name) AS subCategories
FROM categories c
LEFT JOIN subcategories s ON s.categoryId = c.id
GROUP BY c.id

      `,
    );

    const rows: {
      id: number;
      name: string;
      subCategories: string[];
      type: string;
      icon: string;
    }[] = [];

    const resultSet = results[0];
    for (let i = 0; i < resultSet.rows.length; i++) {
      const item = resultSet.rows.item(i);

      rows.push({
        id: item.categoryId,
        name: item.categoryName,
        subCategories: JSON.parse(item.subCategories ?? '[]'),
        type: item.categoryType,
        icon: item.categoryIcon,
      });
    }

    return rows;
  } catch (error) {
    throw error;
  }
};
