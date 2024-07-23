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

    return {
        storeData,
        getData,
        storeObjectData,
        getObjectData,
    }
}