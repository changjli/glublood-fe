import useWithToken from '@/configs/axios/withToken'

export default function useDailyCalories() {

    const withToken = useWithToken()

    const group = 'api/daily-calories'

    const getDailyCaloriesByDate = async (setLoading: (loading: boolean) => void, date: string) => {
        setLoading(true)
        const res = await withToken.get(`${group}?date=${date}`)
            .then(res => {
                console.log('[useDailyCalories][getDailyCaloriesByDate]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useDailyCalories][getDailyCaloriesByDate]', err.response?.data)
                setLoading(false)
                return err.response?.data
            })
        return res
    }

    const storeDailyCalories = async (setLoading: (loading: boolean) => void, data: StoreDailyCaloriesRequest) => {
        setLoading(true)
        const res = await withToken.post(`${group}`, data)
            .then(res => {
                console.log('[useDailyCalories][storeDailyCalories]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useDailyCalories][storeDailyCalories]', err.response?.data)
                setLoading(false)
                return err.response?.data
            })
        return res
    }

    return {
        getDailyCaloriesByDate,
        storeDailyCalories,
    }
}