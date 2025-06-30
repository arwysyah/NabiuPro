import {useEffect, useState} from 'react';
import {selectAllCategoriesWithSubcategories} from '../lib/db/queries.categories';

export const useCategories = () => {
  const [categories, setCategories] = useState<
    {id: number; name: string; subCategories: string[]; categoryType: string}[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    selectAllCategoriesWithSubcategories()
      .then(setCategories)
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return {categories, loading, error};
};
