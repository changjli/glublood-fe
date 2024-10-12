import { View, Text, Pressable, Keyboard, GestureResponderEvent, TouchableWithoutFeedback, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import CustomText from '@/components/CustomText'
import { Formik } from 'formik'
import { object, string } from 'yup'
import { StyledCustomTextInput } from '@/components/CustomInput/CustomTextInput'
import { StyledCustomButton } from '@/components/CustomButton'
import useAuth from '@/hooks/api/auth/useAuth'
import { loginRequest, sendCodeRequest } from '@/hooks/api/auth/authTypes'
import useAsyncStorage from '@/hooks/useAsyncStorage'
import { Colors } from '@/constants/Colors'

type SendCodeProps = {
    setPage: (value: number) => void
    setCredentials: (value: {
        email: string,
        password: string,
    }) => void
}

const sendCodeSchema = object({
    email: string().required(),
    password: string().required(),
    passwordConfirmation: string().required(),
})

export default function SendCode({ setPage, setCredentials }: SendCodeProps) {
    const { sendCode } = useAuth()
    // const { storeObjectData } = useAsyncStorage()

    const [sendCodeLoading, setSendCodeLoading] = useState<boolean>(false)

    const handleSendCode = async (data: sendCodeRequest) => {
        try {
            const res = await sendCode(setSendCodeLoading, data)
            if (res.status == 200) {
                console.log(res.data)
                Alert.alert('success', res.message)
                setCredentials(data)
                setPage(2)
                // await storeObjectData('credentials', data)
                // router.replace('(auth)/verify-code')
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
        <>
            <View className='absolute'>
                <Image source={require('../../../assets/images/register/Vector1.png')} />
            </View>
            <CustomText size='xl' weight='heavy' style={{ color: Colors.light.primary }}>Daftar</CustomText>
            <CustomText size='md' style={{ color: 'white', marginBottom: 10 }}>Mulai perjalananmu dengan kami!</CustomText>
            <View className='flex flex-row justify-center mb-8'>
                <Image source={require('../../../assets/images/characters/IconRegis1.png')} />
            </View>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    passwordConfirmation: '',
                }}
                onSubmit={(values) => {
                    handleSendCode(values)
                }}
                validationSchema={sendCodeSchema}
            >
                {({ handleChange, handleSubmit, values, errors }) => (
                    <View className='flex-1 flex-col justify-between'>
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
                        </View>
                        <View>
                            {/* bug */}
                            <StyledCustomButton title='Daftar' onPress={handleSubmit as (e?: GestureResponderEvent) => void} size='md' loading={sendCodeLoading} />
                            <View className='flex flex-row justify-center'>
                                <CustomText size='sm' weight='heavy' style={{ color: Colors.light.gray500, marginRight: 4 }}>
                                    Sudah memiliki akun?
                                </CustomText>
                                <Pressable onPress={() => router.replace('/(auth)/login')}>
                                    <CustomText size='sm' weight='heavy' style={{ color: Colors.light.primary }}>
                                        Masuk disini
                                    </CustomText>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                )}
            </Formik>
        </>
    )
}