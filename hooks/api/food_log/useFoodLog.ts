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

    const storeFoodLog = async (setLoading: (loading: boolean) => void, data: FormData) => {
        setLoading(true)
        const res = await withToken.post(`${group}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
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

    const updateFoodLog = async (setLoading: (loading: boolean) => void, id: number, data: FormData) => {
        setLoading(true)
        const res = await withToken.post(`${group}/${id}?_method=PUT`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
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

    const getFoodByBarcode = async (setLoading: (loading: boolean) => void, data: GetFoodByBarcodeReq) => {
        setLoading(true)
        const res = await withToken.post(`${group}/barcode`, data)
            .then(res => {
                console.log('[useFoodLog][getFoodByBarcode]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useFoodLog][getFoodByBarcode]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    const getFoodLogReportByDate = async (setLoading: (loading: any) => void, startDate: string, endDate: string) => {
        setLoading(true)
        const res = await withToken.post(`${group}/report/date`, {
            start_date: startDate,
            end_date: endDate,
        })
            .then(res => {
                console.log('[useFoodLog][getFoodLogReportByDate]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useFoodLog][getFoodLogReportByDate]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    const getFoodLogReportByMonth = async (setLoading: (loading: any) => void, month: number, year: number) => {
        setLoading(true)
        const res = await withToken.post(`${group}/report/month`, {
            month,
            year,
        })
            .then(res => {
                console.log('[useFoodLog][getFoodLogReportByMonth]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useFoodLog][getFoodLogReportByMonth]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    const getFoodLogReportByYear = async (setLoading: (loading: any) => void, year: number) => {
        setLoading(true)
        const res = await withToken.post(`${group}/report/year`, {
            year,
        })
            .then(res => {
                console.log('[useFoodLog][getFoodLogReportByYear]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useFoodLog][getFoodLogReportByYear]', err.response?.data)
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
        getFoodByBarcode,
        getFoodLogReportByDate,
        getFoodLogReportByMonth,
        getFoodLogReportByYear,
    }
}