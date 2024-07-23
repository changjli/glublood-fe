import { View, Text, TouchableWithoutFeedback, Keyboard, GestureResponderEvent, Alert, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import CustomTextInput, { StyledCustomTextInput } from '@/components/CustomInput/CustomTextInput'
import { StyledCustomButton } from '@/components/CustomButton'
import { StyledCustomText } from '@/components/CustomText'
import { object, string } from 'yup'
import { router } from 'expo-router'
import { useSession } from '../context/AuthenticationProvider'
import apiClient from '@/configs/axios'
import axios, { AxiosError } from 'axios'
import useAuth from '@/hooks/api/auth/useAuth'
import { loginRequest } from '@/hooks/api/auth/authTypes'

const loginSchema = object({
    email: string().required(),
    password: string().required(),
})

export default function Login() {
    const user = { email: 'nicholas@gmail.com', password: 'password' }

    const { login } = useAuth()
    const { signIn } = useSession()

    const [loginLoading, setLoginLoading] = useState<boolean>(false);

    const handleLogin = async (data: loginRequest) => {
        try {
            const res = await login(setLoginLoading, data)
            if (res.status == 200) {
                console.log(res.data)
                Alert.alert('success', res.message)
            } else if (res.status == 400) {
                console.log(res.message)
                Alert.alert('error', res.message)
            }
        } catch (err) {
            console.log('Axios Error:', err)
            Alert.alert('error', 'Error: Please try again later')
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className='flex-1 p-[16px]'>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    onSubmit={(values) => {
                        handleLogin(values)
                    }}
                    validationSchema={loginSchema}
                >
                    {({ handleChange, handleSubmit, values, errors }) => (
                        <View className='flex flex-col gap-4'>
                            <StyledCustomTextInput
                                label='Email'
                                placeholder='Masukkan emailmu'
                                labelStyle='text-primary'
                                value={values.email}
                                onChangeText={handleChange('email')}
                                error={errors.email}
                            />
                            <View>
                                <StyledCustomTextInput
                                    label='Kata sandi'
                                    placeholder='Masukkan kata sandimu'
                                    labelStyle='text-primary'
                                    value={values.password}
                                    onChangeText={handleChange('password')}
                                    error={errors.password}
                                    secureTextEntry
                                />
                                <View className='flex flex-row justify-end'>
                                    <StyledCustomText size='sm' weight='heavy' style='text-primary'>
                                        Lupa kata sandi?
                                    </StyledCustomText>
                                </View>
                            </View>
                            <View>
                                {/* bug */}
                                <StyledCustomButton title='Masuk' onPress={handleSubmit as (e?: GestureResponderEvent) => void} size='md' loading={loginLoading} />
                                <View className='flex flex-row justify-center'>
                                    <StyledCustomText size='sm' weight='heavy' style='text-gray-500 mr-1'>
                                        Belum memiliki akun?
                                    </StyledCustomText>
                                    <Pressable onPress={() => router.replace('(auth)/register')}>
                                        <StyledCustomText size='sm' weight='heavy' style='text-primary'>
                                            Daftar disini
                                        </StyledCustomText>
                                    </Pressable>

                                </View>
                            </View>
                        </View>
                    )}

                </Formik>
            </View>
        </TouchableWithoutFeedback>
    )
}