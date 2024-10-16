import useWithToken from '@/configs/axios/withToken'

export default function useFoodLog() {

    const withToken = useWithToken()

    const group = 'api/food'

    const getFoodLogByDate = async (setLoading: (loading: boolean) => void, date: string) => {
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

    const storeFoodLog = async (setLoading: (loading: boolean) => void, data: StoreFoodLogRequest) => {
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

    const getFoodLogDetail = async (setLoading: (loading: boolean) => void, id: number) => {
        setLoading(true)
        const res = await withToken.get(`${group}/${id}`)
            .then(res => {
                console.log('[useFoodLog][getFoodLogDetail]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useFoodLog][getFoodLogDetail]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    const updateFoodLog = async (setLoading: (loading: boolean) => void, payload: UpdateFoodLogReq) => {
        setLoading(true)
        const res = await withToken.put(`${group}/${payload.id}`, payload)
            .then(res => {
                console.log('[useFoodLog][updateFoodLog]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useFoodLog][updateFoodLog]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    const deleteFoodLog = async (setLoading: (loading: boolean) => void, id: number) => {
        setLoading(true)
        const res = await withToken.delete(`${group}/${id}`)
            .then(res => {
                console.log('[useFoodLog][deleteFoodLog]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useFoodLog][deleteFoodLog]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    return {
        getFoodLogByDate,
        storeFoodLog,
        getFoodLogDetail,
        updateFoodLog,
        deleteFoodLog,
    }
}