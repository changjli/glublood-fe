import useWithToken from '@/configs/axios/withToken'

export default function useGlucoseLog() {

    const withToken = useWithToken()

    const group = 'api/glucose'

    const getGlucoseLogByDate = async (setLoading, date) => {
        setLoading(true)
        const res = await withToken.get(`${group}?date=${date}`)
            .then(res => {
                console.log('[useGlucoseLog][getGlucoseLogByDate]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useGlucoseLog][getGlucoseLogByDate]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    const storeGlucoseLog = async (setLoading, data) => {
        setLoading(true)
        const res = await withToken.post(`${group}`, data)
            .then(res => {
                console.log('[useGlucoseLog][storeGlucoseLog]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useGlucoseLog][storeGlucoseLog]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    const getGlucoseLogDetail = async (setLoading, id) => {
        setLoading(true)
        const res = await withToken.get(`${group}/${id}`)
            .then(res => {
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useGlucoseLog][getGlucoseLogDetail]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    const updateGlucoseLog = async (setLoading, data) => {
        setLoading(true)
        const res = await withToken.put(`${group}/${data.id}`, data)
            .then(res => {
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useGlucoseLog][updateGlucoseLog]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    const deleteGlucoseLog = async (setLoading, id) => {
        setLoading(true)
        const res = await withToken.delete(`${group}/${id}`)
            .then(res => {
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useGlucoseLog][deleteGlucoseLog]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    return {
        getGlucoseLogByDate,
        storeGlucoseLog,
        getGlucoseLogDetail,
        updateGlucoseLog,
        deleteGlucoseLog
    }
}