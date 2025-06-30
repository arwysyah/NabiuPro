import {useEffect, useState} from 'react';
import {getSellStore} from '../lib/db/queries.stock';

export const useSellStore = () => {
  const [sellData, setSellData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const data = await getSellStore();
    setSellData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {sellData, loading, refresh: fetchData};
};
