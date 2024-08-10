import WithToken from '@/configs/axios/withToken'
import { storeProfileRequest } from './profileTypes'

export default function useProfile() {

    const group = 'api/user-profile'

    const storeUserProfile = async (setLoading, payload, token) => {
        setLoading(true)
        const res = await WithToken(token).post(`${group}`, payload)
            .then(res => {
                console.log('[useAuth][storeUserProfile]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useAuth][storeUserProfile]', err.response?.data)
                setLoading(false)
                return err.response?.data
            })
        return res
    }


    return {
        storeUserProfile,
    }
}