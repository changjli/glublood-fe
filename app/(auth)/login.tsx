import { View, Text, TouchableWithoutFeedback, Keyboard, GestureResponderEvent, Alert, Pressable, Image, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Formik } from 'formik'
import CustomTextInput, { StyledCustomTextInput } from '@/components/CustomInput/CustomTextInput'
import CustomButton, { StyledCustomButton } from '@/components/CustomButton'
import CustomText from '@/components/CustomText'
import { object, string } from 'yup'
import { router } from 'expo-router'
import { useSession } from '../context/AuthenticationProvider'
import apiClient from '@/configs/axios'
import axios, { AxiosError } from 'axios'
import useAuth from '@/hooks/api/auth/useAuth'
import { loginRequest } from '@/hooks/api/auth/authTypes'
import { Colors } from '@/constants/Colors'
import Wrapper from '@/components/Layout/Wrapper'
import WithKeyboard from '@/components/Layout/WithKeyboard'

const loginSchema = object({
    email: string().required(),
    password: string().required(),
})

export default function LoginPage() {
    const user = { email: 'admin@gmail.com', password: 'password' }

    const { login } = useAuth()
    const { signIn } = useSession()
    const { width, height } = Dimensions.get('window')

    const [loginLoading, setLoginLoading] = useState<boolean>(false);

    const handleLogin = async (data: loginRequest) => {
        try {
            const res = await login(setLoginLoading, data)
            if (res.status == 200) {
                console.log(res.data)
                Alert.alert('success', res.message)
                signIn(res)
                router.replace('/')
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
        <View style={{ flex: 1 }}>
            {/* <View className='absolute'>
                <Image source={require('../../assets/images/backgrounds/wave-1.png')} style={{ width: width, height: 375 }} />
            </View> */}
            <WithKeyboard>
                <Wrapper style={{ backgroundColor: 'white', height: height }}>
                    <CustomText size='3xl' weight='heavy' style={{ color: Colors.light.primary }}>Masuk</CustomText>
                    <CustomText size='md' style={{ color: 'white', marginBottom: 20 }}>Selamat datang lanjutkan perjalananmu!</CustomText>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                        <Image source={require('../../assets/images/characters/icon-login.png')} style={{ height: 200 }} resizeMode='contain' />
                    </View>
                    <Formik
                        initialValues={{
                            email: '',
                            password: ''
                        }}
                        onSubmit={async (values) => {
                            await handleLogin(values)
                        }}
                        validationSchema={loginSchema}
                    >
                        {({ handleChange, handleSubmit, values, errors }) => (
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'column', gap: errors && 5 }}>
                                    <CustomTextInput
                                        label='Email'
                                        placeholder='Masukkan emailmu'
                                        labelStyle={{ color: Colors.light.primary }}
                                        value={values.email}
                                        onChangeText={handleChange('email')}
                                        error={errors.email}
                                    />
                                    <View>
                                        <CustomTextInput
                                            label='Kata sandi'
                                            placeholder='Masukkan kata sandimu'
                                            labelStyle={{ color: Colors.light.primary }}
                                            value={values.password}
                                            onChangeText={handleChange('password')}
                                            error={errors.password}
                                            secureTextEntry
                                        />
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                            <CustomText size='sm' weight='heavy' style={{ color: Colors.light.primary }}>
                                                Lupa kata sandi?
                                            </CustomText>
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    {/* bug */}
                                    <CustomButton title='Masuk' onPress={handleSubmit as (e?: GestureResponderEvent) => void} size='md' loading={loginLoading} />
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        <CustomText size='sm' weight='heavy' style={{ color: Colors.light.gray500, marginRight: 4 }}>
                                            Belum memiliki akun?
                                        </CustomText>
                                        <Pressable onPress={() => router.replace('/(auth)/register')}>
                                            <CustomText size='sm' weight='heavy' style={{ color: Colors.light.primary }}>
                                                Daftar disini
                                            </CustomText>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        )}
                    </Formik>
                </Wrapper>
            </WithKeyboard>
        </View>
    )
}   