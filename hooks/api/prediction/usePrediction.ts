import { predictionRequest } from './predictionTypes'
import useWithToken from '@/configs/axios/withToken'

export default function usePrediction() {

    const withToken = useWithToken()

    const group = 'api/diabetes-prediction'

    const doPrediction = async (setLoading: (loading: boolean) => void, payload: predictionRequest) => {
        setLoading(true)
        const res = await withToken.post(`${group}/predict`, payload)
            .then(res => {
                console.log('[usePrediction][store]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[usePrediction][store]', err.response?.data)
                setLoading(false)
                return err.response?.data
            })
        return res
    }

    const storePrediction = async (setLoading: (loading: boolean) => void, payload: predictionRequest) => {
        setLoading(true)
        const res = await withToken.post(`${group}`, payload)
            .then(res => {
                console.log('[usePrediction][store]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[usePrediction][store]', err.response?.data)
                setLoading(false)
                return err.response?.data
            })
        return res
    }

    const getPredictionByUser = async (setLoading: (loading: boolean) => void) => {
        setLoading(true)
        const res = await withToken.get(`${group}`)
            .then(res => {
                console.log('[usePrediction][getPredictionByUser]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[usePrediction][getPredictionByUser]', err.response?.data)
                setLoading(false)
                return err.response?.data
            })
        return res
    }

    const getPredictionById = async (setLoading: (loading: boolean) => void) => {
        setLoading(true)
        const res = await withToken.get(`${group}`)
            .then(res => {
                console.log('[usePrediction][getPredictionByUser]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[usePrediction][getPredictionByUser]', err.response?.data)
                setLoading(false)
                return err.response?.data
            })
        return res
    }

    return {
        doPrediction,
        storePrediction,
        getPredictionByUser,
    }
}