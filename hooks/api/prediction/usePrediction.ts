import { predictionRequest } from './predictionTypes'
import useWithToken from '@/configs/axios/withToken'

export default function usePrediction() {

    const withToken = useWithToken()

    const group = 'api/diabetes-prediction'

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

    return {
        storePrediction,
    }
}