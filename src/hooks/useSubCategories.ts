import {useEffect, useState} from 'react';
import {selectAllCategoriesWithSubcategories} from '../lib/db/queries.subcategories';

export const useSubCategories = () => {
  const [categories, setCategories] = useState<
    {id: string; name: string; subCategories: string[]}[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    selectAllCategoriesWithSubcategories()
      .then(setCategories)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return {categories, loading, error};
};
