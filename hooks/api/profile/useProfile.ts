import { View, Text } from 'react-native'
import React, { Dispatch, SetStateAction, useState } from 'react'
import WithToken from '@/configs/axios/withToken'
import { storeProfileRequest } from './profileTypes'

export default function useAuth() {

    const group = 'api/user-profile'

    const storeUserProfile = async (setLoading: (loading: boolean) => void, token: string, payload: storeProfileRequest) => {
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