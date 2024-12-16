import useWithToken from '@/configs/axios/withToken'

export default function useProfile() {
    const withToken = useWithToken()

    const group = 'api/user-profile'

    // Function to store or save user profile
    const storeUserProfile = async (setLoading, payload) => {
        setLoading(true)
        const res = await withToken.post(`${group}`, payload)
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

    // Function to fetch or get user profile
    const fetchUserProfile = async (setLoading) => {
        setLoading(true);
        const res = await withToken.get(`${group}`)
            .then(res => {
                console.log('[useProfile][fetchUserProfile]', res.data);
                setLoading(false);
                return res.data;
            }).catch(err => {
                console.log('[useProfile][fetchUserProfile]', err.response?.data);
                setLoading(false);
                return err.response?.data;
            });
        return res;
    };

    const updateUserProfile = async (setLoading, payload) => {
        setLoading(true)
        const res = await withToken.put(`${group}`, payload)
            .then(res => {
                console.log('[useProfile][updateUserProfile]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useProfile][updateUserProfile]', err.response?.data)
                setLoading(false)
                return err.response?.data
            })
        return res
    }

    const saveProfileImage = async (setLoading, data) => {
        setLoading(true)
        const res = await withToken.post(`${group}/image?_method=PUT`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(res => {
                console.log('[useProfile][saveProfileImage]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useProfile][saveProfileImage]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    const deleteProfileImage = async (setLoading) => {
        setLoading(true)
        const res = await withToken.delete(`${group}/image`)
            .then(res => {
                console.log('[useProfile][deleteProfileImage]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useProfile][deleteProfileImage]', err.response?.data)
                setLoading(false)
                return Promise.reject(err)
            })
        return res
    }

    return {
        storeUserProfile,
        fetchUserProfile,
        updateUserProfile,
        saveProfileImage,
        deleteProfileImage,
    }
}