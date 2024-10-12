import useWithToken from '@/configs/axios/withToken'

export default function useExerciseLog() {

    const withToken = useWithToken()

    const group = 'api/logs/exercise'

    const getExerciseLogByDate = async (setLoading: (loading: boolean) => void, date: string) => {
        setLoading(true)
        const res = await withToken.get(`${group}?date=${date}`)
            .then(res => {
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useMasterExercise][getExerciseLogByDate]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    const storeExerciseLog = async (setLoading: (loading: boolean) => void, payload: StoreExerciseLogReq) => {
        setLoading(true)
        const res = await withToken.post(`${group}`, payload)
            .then(res => {
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useExerciseLog][storeExerciseLog]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    const getExerciseLogDetail = async (setLoading: (loading: boolean) => void, id: number) => {
        setLoading(true)
        const res = await withToken.get(`${group}/${id}`)
            .then(res => {
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useMasterExercise][getExerciseLogDetail]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    const updateExerciseLog = async (setLoading: (loading: boolean) => void, payload: UpdateExerciseLogReq) => {
        setLoading(true)
        const res = await withToken.put(`${group}/${payload.id}`, payload)
            .then(res => {
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useExerciseLog][updateExerciseLog]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    const deleteExerciseLog = async (setLoading: (loading: boolean) => void, id: number) => {
        setLoading(true)
        const res = await withToken.delete(`${group}/${id}`)
            .then(res => {
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useExerciseLog][deleteExerciseLog]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    return {
        getExerciseLogByDate,
        storeExerciseLog,
        getExerciseLogDetail,
        updateExerciseLog,
        deleteExerciseLog,
    }
}