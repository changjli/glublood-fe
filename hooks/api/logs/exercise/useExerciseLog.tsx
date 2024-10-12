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
                console.log('[useMasterExercise][searchMasterFood]', err.response?.data)
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

    return {
        getExerciseLogByDate,
        storeExerciseLog,
    }
}