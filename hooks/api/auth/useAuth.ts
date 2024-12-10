import { View, Text } from 'react-native'
import React, { Dispatch, SetStateAction, useState } from 'react'
import apiClient from '@/configs/axios'
import { ForgotPasswordRequest, loginRequest, registerRequest, ResetPasswordRequest, sendCodeRequest, VerifyCodeRequest } from './authTypes'
import useWithToken from '@/configs/axios/withToken'

export default function useAuth() {

    const withToken = useWithToken()
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

    const register = async (setLoading: (loading: boolean) => void, payload: registerRequest) => {
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

    const getAuthenticatedUser = async (setLoading: (loading: boolean) => void, payload: sendCodeRequest) => {
        setLoading(true)
        const res = await withToken.post(`${group}get-auth`, payload)
            .then(res => {
                console.log('[useAuth][get-user]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useAuth][get-user]', err.response?.data)
                setLoading(false)
                return err.response?.data
            })
        return res
    }

    const forgotPassword = async (setLoading: (loading: boolean) => void, payload: ForgotPasswordRequest) => {
        setLoading(true)
        const res = await apiClient.post(`${group}forgot-password`, payload)
            .then(res => {
                console.log('[useAuth][forgot-password]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useAuth][forgot-password]', err.response?.data)
                setLoading(false)
                return err.response?.data
            })
        return res
    }

    const verifyForgotPassword = async (setLoading: (loading: boolean) => void, payload: VerifyCodeRequest) => {
        setLoading(true)
        const res = await apiClient.post(`${group}verify-password`, payload)
            .then(res => {
                console.log('[useAuth][verify-password]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useAuth][verify-password]', err.response?.data)
                setLoading(false)
                return err.response?.data
            })
        return res
    };

    const resetPassword = async (setLoading: (loading: boolean) => void, payload: ResetPasswordRequest) => {
        setLoading(true)
        const res = await apiClient.post(`${group}reset-password`, payload)
            .then(res => {
                console.log('[useAuth][reset-password]', res.data)
                setLoading(false)
                return res.data
            }).catch(err => {
                console.log('[useAuth][reset-password]', err.response?.data)
                setLoading(false)
                return err.response?.data
            })
        return res
    };

    return {
        login,
        register,
        sendCode,
        getAuthenticatedUser,
        forgotPassword,
        verifyForgotPassword,
        resetPassword,
    }
}