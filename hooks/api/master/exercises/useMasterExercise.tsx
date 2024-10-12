import useWithToken from '@/configs/axios/withToken'

export default function useMasterExercise() {

    const withToken = useWithToken()

    const group = 'api/master/exercises'

    const getMasterExercises = async (setLoading: (loading: boolean) => void, query: string) => {
        setLoading(true)
        const res = await withToken.get(`${group}?query=${query}`)
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

    return {
        getMasterExercises
    }
}