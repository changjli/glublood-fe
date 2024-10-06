import useWithToken from '@/configs/axios/withToken'

export default function useMasterFood() {

    const withToken = useWithToken()

    const group = 'api/master-foods'

    const searchMasterFood = async (setLoading: (loading: boolean) => void, query: string) => {
        setLoading(true)
        const res = await withToken.get(`${group}?query=${query}`)
            .then(res => {
                // console.log('[useMasterFood][searchMasterFood]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useMasterFood][searchMasterFood]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    const getMasterFoodDetail = async (setLoading: (loading: boolean) => void, id: string) => {
        setLoading(true)
        const res = await withToken.get(`${group}/${id}`)
            .then(res => {
                // console.log('[useMasterFood][getMasterFoodDetail]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useMasterFood][getMasterFoodDetail]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    return {
        searchMasterFood,
        getMasterFoodDetail,
    }
}