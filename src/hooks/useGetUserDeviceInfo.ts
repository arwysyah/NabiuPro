import {useEffect, useState} from 'react';
import {getUniqueId, getManufacturer} from 'react-native-device-info';

const useGetUserDeviceInfo = () => {
  const [uniqueId, setUniqueId] = useState('');
  const [manufacturer, setManufacturer] = useState('');

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        const [id, manu] = await Promise.all([
          getUniqueId(),
          getManufacturer(),
        ]);
        setUniqueId(id);
        setManufacturer(manu);
      } catch (error) {
        console.log('Error fetching device info:', error);
      }
    };

    fetchDeviceInfo();
  }, []);

  return {uniqueId, manufacturer};
};

export default useGetUserDeviceInfo;
