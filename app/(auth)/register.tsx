import { View, Text, Pressable, Keyboard, GestureResponderEvent, TouchableWithoutFeedback, Alert } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { StyledCustomText } from '@/components/CustomText'
import { Formik } from 'formik'
import { object, string } from 'yup'
import { StyledCustomTextInput } from '@/components/CustomInput/CustomTextInput'
import { StyledCustomButton } from '@/components/CustomButton'
import useAuth from '@/hooks/api/auth/useAuth'
import { loginRequest, sendCodeRequest } from '@/hooks/api/auth/authTypes'
import useAsyncStorage from '@/hooks/useAsyncStorage'

const registerSchema = object({
    email: string().required(),
    password: string().required(),
    passwordConfirmation: string().required(),
})

export default function Register() {
    const { sendCode } = useAuth()
    const { storeObjectData } = useAsyncStorage()

    const [registerLoading, setRegisterLoading] = useState<boolean>(false)

    const handleSendCode = async (data: sendCodeRequest) => {
        try {
            const res = await sendCode(setRegisterLoading, data)
            if (res.status == 200) {
                console.log(res.data)
                Alert.alert('success', res.message)
                await storeObjectData('credentials', data)
                router.replace('(auth)/verify-code')
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
                    initialValues={{
                        email: '',
                        password: '',
                        passwordConfirmation: '',
                    }}
                    onSubmit={(values) => {
                        handleSendCode(values)
                    }}
                    validationSchema={registerSchema}
                >
                    {({ handleChange, handleSubmit, values, errors }) => (
                        <View className='flex flex-col gap-4'>
                            <StyledCustomTextInput
                                label='Email'
                                placeholder='Cth: johndoe@gmail.com'
                                labelStyle='text-primary'
                                value={values.email}
                                onChangeText={handleChange('email')}
                                error={errors.email}
                            />
                            <StyledCustomTextInput
                                label='Kata sandi'
                                placeholder='Masukkan minimal 6 karakter'
                                labelStyle='text-primary'
                                value={values.password}
                                onChangeText={handleChange('password')}
                                error={errors.password}
                                secureTextEntry
                            />
                            <StyledCustomTextInput
                                label='Konfirmasi kata sandi'
                                placeholder='Masukkan kembali kata sandi'
                                labelStyle='text-primary'
                                value={values.passwordConfirmation}
                                onChangeText={handleChange('passwordConfirmation')}
                                error={errors.passwordConfirmation}
                                secureTextEntry
                            />
                            <View>
                                {/* bug */}
                                <StyledCustomButton title='Daftar' onPress={handleSubmit as (e?: GestureResponderEvent) => void} size='md' loading={registerLoading} />
                                <View className='flex flex-row justify-center'>
                                    <StyledCustomText size='sm' weight='heavy' style='text-gray-500 mr-1'>
                                        Sudah memiliki akun?
                                    </StyledCustomText>
                                    <Pressable onPress={() => router.replace('(auth)/login')}>
                                        <StyledCustomText size='sm' weight='heavy' style='text-primary'>
                                            Masuk disini
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