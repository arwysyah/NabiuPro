import React, {useEffect, useState} from 'react';
import {getUniqueId} from 'react-native-device-info';
import {getUser, type User} from '../lib/db/queries.user';

export const useUserQuery = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const deviceId = await getUniqueId();

      const result = await getUser(deviceId);

      setUser(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {user, loading, error, refetch: fetchUser};
};
