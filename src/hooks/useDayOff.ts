import {useEffect, useState} from 'react';
import {fetchDayOff} from '../lib/getDayOff';
export const useDayOff = (countryCode = 'ID') => {
  const [holiday, setHoliday] = useState<null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDayOff()
      .then(res => {
        setHoliday(res);
        setLoading(false);
      })
      .catch(err => console.log(err));
  }, [countryCode]);

  return {holiday, loading};
};
