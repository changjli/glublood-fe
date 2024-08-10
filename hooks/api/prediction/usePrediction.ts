import withToken from '@/configs/axios/withToken'
import { predictionRequest } from './predictionTypes'

export default function usePrediction() {

    const group = 'api/diabetes-prediction'

    const storePrediction = async (setLoading: (loading: boolean) => void, token: string, payload: predictionRequest) => {
        setLoading(true)
        const res = await withToken(token).post(`${group}`, payload)
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

    return {
        storePrediction,
    }
}