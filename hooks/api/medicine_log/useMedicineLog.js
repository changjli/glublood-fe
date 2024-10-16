import useWithToken from '@/configs/axios/withToken'

export default function useMedicineLog() {

    const withToken = useWithToken()

    const group = 'api/medicine'

    const getMedicineLogByDate = async (setLoading, date) => {
        setLoading(true)
        const res = await withToken.get(`${group}?date=${date}`)
            .then(res => {
                console.log('[useFoodLog][getFoodLogByDate]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useFoodLog][getFoodLogByDate]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    const storeMedicineLog = async (setLoading, data) => {
        setLoading(true)
        const res = await withToken.post(`${group}`, data)
            .then(res => {
                console.log('[useFoodLog][storeFoodLog]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useFoodLog][storeFoodLog]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    return {
        getMedicineLogByDate,
        storeMedicineLog,
    }
}