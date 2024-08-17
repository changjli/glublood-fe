import WithToken from '@/configs/axios/withToken'

export default function useProfile() {

    const group = 'api/user-profile'

    const storeUserProfile = async (setLoading, payload, token) => {
        setLoading(true)
        const res = await WithToken(token).post(`${group}`, payload)
            .then(res => {
                console.log('[useProfile][storeUserProfile]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useProfile][storeUserProfile]', err.response?.data)
                setLoading(false)
                return err.response?.data
            })
        return res
    }


    return {
        storeUserProfile,
    }
}