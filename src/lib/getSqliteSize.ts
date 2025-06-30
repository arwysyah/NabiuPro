import {Platform} from 'react-native';
import * as RNFS from '@dr.pogodin/react-native-fs';
import {dbName} from './manager';

async function getSQLiteDbSize(dbFilePath: any) {
  try {
    const stat = await RNFS.stat(dbFilePath);
    console.log('SQLite DB size (bytes):', stat.size);
    return stat.size;
  } catch (error) {
    console.error('Error getting SQLite DB file size:', error);
    return 0;
  }
}
// For iOS
const dbPathIOS = `${RNFS.DocumentDirectoryPath}/${dbName}`;

// For Android (example, adjust if needed)
const dbPathAndroid = `/data/data/com.arcnode.nabiu.package/databases/${dbName}`;

export const getDbSize = async () => {
  const path = Platform.OS === 'ios' ? dbPathIOS : dbPathAndroid;
  const sizeInBytes = await getSQLiteDbSize(path);
  const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
  console.log(`SQLite DB size: ${sizeInMB} MB`);
};
