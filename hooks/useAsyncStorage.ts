import AsyncStorage from '@react-native-async-storage/async-storage'

export default function useAsyncStorage() {

    const storeData = async (key: string, value: string) => {
        try {
            console.log('[useAuth][storeData]', value)
            await AsyncStorage.setItem(key, value);
        } catch (err) {
            console.log('[useAuth][storeData]', err)
        }
    }

    const getData = async (key: string) => {
        try {
            const value = await AsyncStorage.getItem(key)
            console.log('[useAuth][getData]', value)
            if (value != null) {
                return value
            }
        } catch (err) {
            console.log('[useAuth][getData]', err)
        }
    }

    const storeObjectData = async (key: string, value: {}) => {
        try {
            console.log('[useAuth][storeObjectData]', value)
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue);
        } catch (err) {
            console.log('[useAuth][storeObjectData]', err)
        }
    }

    const getObjectData = async (key: string) => {
        try {
            const jsonValue = await AsyncStorage.getItem(key)
            console.log('[useAuth][getObjectData]', jsonValue)
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (err) {
            console.log('[useAuth][getObjectData]', err)
        }
    }

    const getAllKeys = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            console.log('All keys:', keys);
            return keys;
        } catch (error) {
            console.error('Error fetching keys:', error);
            return [];
        }
    };

    const getAllObjectData = async (keys: string[]) => {
        try {
            const allItems = await AsyncStorage.multiGet(keys);

            const data = allItems.reduce<StoredData>((acc, [key, value]) => {
                if (value != null) {
                    acc[key] = JSON.parse(value);
                }
                return acc;
            }, {});

            return data;
        } catch (err) {
            console.log('[useAuth][getAllObjectData] Error:', err);
        }
    };

    const deleteDataByKey = async (key: string) => {
        try {
            await AsyncStorage.removeItem(key);
            console.log(`Data with key ${key} deleted successfully.`);
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    const deleteAllData = async () => {
        try {
            await AsyncStorage.clear();
            console.log(`All data deleted successfully.`);
        } catch (error) {
            console.error('Error deleting all data:', error);
        }
    };

    return {
        storeData,
        getData,
        storeObjectData,
        getObjectData,
        getAllKeys,
        getAllObjectData,
        deleteDataByKey,
        deleteAllData,
    }
}