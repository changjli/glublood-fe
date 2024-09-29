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
                return err.response?.data
            })
        return res
    }

    return {
        getFoodLogByDate,
    }
}