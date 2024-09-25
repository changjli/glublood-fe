import { useSession } from '@/app/context/AuthenticationProvider'
import useAuth from '@/hooks/api/auth/useAuth'
import axios from 'axios'
import { useEffect } from 'react'

export default function useWithToken() {
    const { session, signIn } = useSession()

    const instance = axios.create({
        baseURL: process.env.EXPO_PUBLIC_API_URL,
        headers: {
            'Access-Control-Allow-Origin': `*`,
            'Access-Control-Allow-Methods': 'GET, HEAD, POST, PATCH, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'ApiKey': `${process.env.PUBLIC_API_KEY}`,
        },
        timeout: 10000,
    })

    // Add a request interceptor
    instance.interceptors.request.use(function (config) {
        // Do something before request is sent
        // Cors 
        config.headers.Authorization = `Bearer ${session}`
        return config;
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    });

    const refresh = async () => {
        const res = await instance.post(`/api/refresh`)
            .then(res => {
                console.log('[useWithToken][refresh]', res.data)
                return res.data
            }).catch(err => {
                console.log('[useWithToken][refresh]', err.response?.data)
                return Promise.reject(err.response?.data)
            })
        return res
    }

    instance.interceptors.response.use(
        function (response) {
            return response
        },
        async function (error) {
            console.log('Interceptor Error:', error)
            if (error.response.status == 401) {
                // Unauthorized
                if (session) {
                    // Refresh token
                    const originalRequest = error.config;
                    try {
                        const res = await refresh()
                        if (res.status == 200) {
                            console.log(res.data)
                            signIn(res)
                            originalRequest.headers.Authorization = `Bearer ${res.token}`;
                            // Send request with the new token
                            return axios(originalRequest);
                        } else if (res.status == 400) {
                            console.log(res.message)
                        }
                    } catch (err) {
                        console.log('Axios Error:', err)
                    }
                }
            } else if (error.response.status == 403) {
                // Forbidden
            }
            return Promise.reject(error)
        }
    )

    return instance
}

