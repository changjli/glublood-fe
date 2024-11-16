import useWithToken from '@/configs/axios/withToken'

export default function useFoodMenu() {

    const withToken = useWithToken()

    const group = 'api/food-menus'

    const getAllFoodMenu = async (setLoading: (loading: boolean) => void, keyword: string) => {
        setLoading(true)
        const res = await withToken.get(`${group}${keyword != '' ? `?keyword=${keyword}` : ''}`)
            .then(res => {
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useFoodMenu][getFoodLogReportByYear]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    return {
        getAllFoodMenu,
    }
}