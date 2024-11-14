import useWithToken from '@/configs/axios/withToken'

export default function useReport() {

    const withToken = useWithToken()

    const group = 'api/report'

    const getLogReportByDate = async (setLoading: (loading: any) => void, payload: GetLogReportByDateReq) => {
        setLoading(true)
        const res = await withToken.post(`${group}`, payload)
            .then(res => {
                console.log('[useReport][getLogReportByDate]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useReport][getLogReportByDate]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    return {
        getLogReportByDate
    }
}