import { View, Text, Pressable, Keyboard, GestureResponderEvent, TouchableWithoutFeedback, Alert, Image, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import CustomText from '@/components/CustomText'
import { Formik } from 'formik'
import { object, string, ref } from 'yup'
import CustomTextInput, { StyledCustomTextInput } from '@/components/CustomInput/CustomTextInput'
import CustomButton, { StyledCustomButton } from '@/components/CustomButton'
import useAuth from '@/hooks/api/auth/useAuth'
import { loginRequest, sendCodeRequest } from '@/hooks/api/auth/authTypes'
import useAsyncStorage from '@/hooks/useAsyncStorage'
import { Colors } from '@/constants/Colors'
import Wrapper from '@/components/Layout/Wrapper'
import WithKeyboard from '@/components/Layout/WithKeyboard'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Ionicons } from '@expo/vector-icons'
import { FontSize } from '@/constants/Typography'
import { useCustomAlert } from '@/app/context/CustomAlertProvider'

type SendCodeProps = {
    setPage: (value: number) => void
    setCredentials: (value: {
        email: string,
        password: string,
    }) => void
}

const sendCodeSchema = object({
    email: string().required('Email wajib diisi').email(),
    password: string().required("Password wajib diisi!")
        .min(8, 'Password harus minimal 8 karakter!')
        .matches(/[A-Z]/, 'Password harus mengandung setidaknya satu huruf kapital')
        .matches(/[0-9]/, 'Password harus mengandung setidaknya satu digit')
        .matches(/[^a-zA-Z0-9]/, 'Password harus mengandung setidaknya satu karakter khusus'),
    password_confirmation: string()
        .oneOf([ref('password')], 'Konfirmasi password harus sama')
})

export default function SendCode({ setPage, setCredentials }: SendCodeProps) {
    const { showAlert } = useCustomAlert()
    const [formValue, setFormValue] = useState({
        email: '',
        password: '',
        password_confirmation: '',
    })

    const { control, handleSubmit, reset, watch, setValue, setError, formState: { errors, isDirty, isValid } } = useForm({
        defaultValues: formValue,
        resolver: yupResolver(sendCodeSchema),
        mode: 'onSubmit',
    })

    const { sendCode } = useAuth()
    const { width, height } = Dimensions.get('window')
    // const { storeObjectData } = useAsyncStorage()

    const [sendCodeLoading, setSendCodeLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

    const handleSendCode = async (data: sendCodeRequest) => {
        try {
            const res = await sendCode(setSendCodeLoading, data)
            if (res.status == 200) {
                console.log(res.data)
                showAlert(res.message, 'success')
                setCredentials(data)
                setPage(2)
                // await storeObjectData('credentials', data)
                // router.replace('(auth)/verify-code')
            } else if (res.status == 400) {
                console.log(res.message)
                if (String(res.errors.email) == 'The email has already been taken.') {
                    setError('email', { message: 'Email telah digunakan!' })
                } else {
                    showAlert(res.message, 'error')
                }
            }
        } catch (err) {
            console.log('Axios Error:', err)
            showAlert('Error: Please try again later', 'error')
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ position: 'absolute' }}>
                <Image source={require('../../../assets/images/backgrounds/wave-1.png')} style={{ width: width, height: 375 }} />
            </View>
            <WithKeyboard>
                <Wrapper style={{ height: height }}>
                    <CustomText size='3xl' weight='heavy' style={{ color: Colors.light.primary }}>Daftar</CustomText>
                    <CustomText size='md' style={{ color: 'white', marginBottom: 20 }}>Mulai perjalananmu dengan kami!</CustomText>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                        <Image source={require('@/assets/images/characters/icon-regis.png')} style={{ height: 200 }} resizeMode='contain' />
                    </View>

                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'column' }}>
                            <Controller
                                control={control}
                                name='email'
                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                    <CustomTextInput
                                        label='Email'
                                        placeholder='Cth: johndoe@gmail.com'
                                        labelStyle={{ color: Colors.light.primary }}
                                        value={value}
                                        onChangeText={onChange}
                                        error={errors.email ? errors.email.message : ''}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name='password'
                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                    <CustomTextInput
                                        label='Kata sandi'
                                        placeholder='Masukkan minimal 6 karakter'
                                        labelStyle={{ color: Colors.light.primary }}
                                        value={value}
                                        onChangeText={onChange}
                                        error={errors.password ? errors.password.message : ''}
                                        postfix={showPassword ? (
                                            <TouchableOpacity onPress={() => setShowPassword(false)}>
                                                <Ionicons name='eye-off' color={Colors.light.primary} size={FontSize.lg} />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity onPress={() => setShowPassword(true)}>
                                                <Ionicons name='eye' color={Colors.light.primary} size={FontSize.lg} />
                                            </TouchableOpacity>
                                        )}
                                        secureTextEntry={!showPassword}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name='password_confirmation'
                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                    <CustomTextInput
                                        label='Konfirmasi kata sandi'
                                        placeholder='Masukkan kembali kata sandi'
                                        labelStyle={{ color: Colors.light.primary }}
                                        value={value}
                                        onChangeText={onChange}
                                        error={errors.password_confirmation ? errors.password_confirmation.message : ''}
                                        postfix={showPasswordConfirmation ? (
                                            <TouchableOpacity onPress={() => setShowPasswordConfirmation(false)}>
                                                <Ionicons name='eye-off' color={Colors.light.primary} size={FontSize.lg} />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity onPress={() => setShowPasswordConfirmation(true)}>
                                                <Ionicons name='eye' color={Colors.light.primary} size={FontSize.lg} />
                                            </TouchableOpacity>
                                        )}
                                        secureTextEntry={!showPasswordConfirmation}
                                    />
                                )}
                            />

                        </View>
                        <View>
                            {/* bug */}
                            <CustomButton title='Daftar' onPress={handleSubmit(data => handleSendCode(data))} size='md' loading={sendCodeLoading} />
                            <View className='flex flex-row justify-center'>
                                <CustomText size='sm' weight='heavy' style={{ color: Colors.light.gray500, marginRight: 4 }}>
                                    Sudah memiliki akun?
                                </CustomText>
                                <Pressable onPress={() => router.replace('/(auth)/login')}>
                                    <CustomText size='sm' weight='heavy' style={{ color: Colors.light.primary, marginBottom: 16 }}>
                                        Masuk disini
                                    </CustomText>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Wrapper>
            </WithKeyboard>
        </View>
    )
}