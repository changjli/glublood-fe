import useWithToken from '@/configs/axios/withToken'

export default function useMedicineLog() {

    const withToken = useWithToken()

    const group = 'api/medicine'

    const getMedicineLogByDate = async (setLoading, date) => {
        setLoading(true)
        const res = await withToken.get(`${group}?date=${date}`)
            .then(res => {
                console.log('[useMedicineLog][getMedicineLogByDate]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useMedicineLog][getMedicineLogByDate]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    const storeMedicineLog = async (setLoading, data) => {
        setLoading(true)
        const res = await withToken.post(`${group}`, data)
            .then(res => {
                console.log('[useMedicineLog][storeMedicineLog]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useMedicineLog][storeMedicineLog]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    const getMedicineLogDetail = async (setLoading, id) => {
        setLoading(true)
        const res = await withToken.get(`${group}/${id}`)
            .then(res => {
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useMedicineLog][getMedicineLogDetail]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    const updateMedicineLog = async (setLoading, data) => {
        setLoading(true)
        const res = await withToken.put(`${group}/${data.id}`, data)
            .then(res => {
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useMedicineLog][updateMedicineLog]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    const deleteMedicineLog = async (setLoading, id) => {
        setLoading(true)
        const res = await withToken.delete(`${group}/${id}`)
            .then(res => {
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useMedicineLog][deleteMedicineLog]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    return {
        getMedicineLogByDate,
        storeMedicineLog,
        getMedicineLogDetail,
        updateMedicineLog,
        deleteMedicineLog
    }
}