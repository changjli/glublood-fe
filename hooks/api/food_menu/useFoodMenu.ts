import useWithToken from '@/configs/axios/withToken'
import { queryParamBuilder } from '@/utils/queryParamBuilder'

export default function useFoodMenu() {

    const withToken = useWithToken()

    const group = 'api/food-menus'

    const getAllFoodMenu = async (setLoading: (loading: boolean) => void, keyword?: string, limit?: number) => {
        setLoading(true)
        console.log(`${group}${queryParamBuilder({ keyword, limit })}`)
        const res = await withToken.get(`${group}${queryParamBuilder({ keyword, limit })}`)
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

    const getFoodMenuDetail = async (setLoading: (loading: boolean) => void, id: number) => {
        setLoading(true)
        const res = await withToken.get(`${group}/${id}`)
            .then(res => {
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useFoodMenu][getFoodMenuDetail]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    return {
        getAllFoodMenu,
        getFoodMenuDetail,
    }
}