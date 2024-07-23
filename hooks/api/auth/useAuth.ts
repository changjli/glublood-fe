import { View, Text } from 'react-native'
import React, { Dispatch, SetStateAction, useState } from 'react'
import apiClient from '@/configs/axios'
import { loginRequest, sendCodeRequest } from './authTypes'

export default function useAuth() {

    const group = 'api/'

    const login = async (setLoading: (loading: boolean) => void, payload: loginRequest) => {
        setLoading(true)
        const res = await apiClient.post(`${group}login`, payload)
            .then(res => {
                console.log('[useAuth][login]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useAuth][login]', err.response?.data)
                setLoading(false)
                return err.response?.data
            })
        return res
    }

    const register = async (setLoading: (loading: boolean) => void, payload: loginRequest) => {
        setLoading(true)
        const res = await apiClient.post(`${group}register`, payload)
            .then(res => {
                console.log('[useAuth][register]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useAuth][register]', err.response?.data)
                setLoading(false)
                return err.response?.data
            })
        return res
    }

    const sendCode = async (setLoading: (loading: boolean) => void, payload: sendCodeRequest) => {
        setLoading(true)
        const res = await apiClient.post(`${group}send-code`, payload)
            .then(res => {
                console.log('[useAuth][send-code]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useAuth][send-code]', err.response?.data)
                setLoading(false)
                return err.response?.data
            })
        return res
    }

    return {
        login,
        register,
        sendCode,
    }
}