import { View, Text, Pressable, Keyboard, GestureResponderEvent, TouchableWithoutFeedback, Alert, Image, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import CustomText from '@/components/CustomText'
import { Formik } from 'formik'
import { object, string } from 'yup'
import CustomTextInput, { StyledCustomTextInput } from '@/components/CustomInput/CustomTextInput'
import CustomButton, { StyledCustomButton } from '@/components/CustomButton'
import useAuth from '@/hooks/api/auth/useAuth'
import { loginRequest, sendCodeRequest } from '@/hooks/api/auth/authTypes'
import useAsyncStorage from '@/hooks/useAsyncStorage'
import { Colors } from '@/constants/Colors'
import Wrapper from '@/components/Layout/Wrapper'
import WithKeyboard from '@/components/Layout/WithKeyboard'

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
    const { width } = Dimensions.get('window')
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
        <View style={{ flex: 1 }}>
            <View className='absolute'>
                <Image source={require('../../../assets/images/backgrounds/wave-1.png')} style={{ width: width, height: 375 }} />
            </View>
            <Wrapper>
                <CustomText size='3xl' weight='heavy' style={{ color: Colors.light.primary }}>Daftar</CustomText>
                <CustomText size='md' style={{ color: 'white', marginBottom: 20 }}>Mulai perjalananmu dengan kami!</CustomText>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                    <Image source={require('../../../assets/images/characters/icon-regis.png')} style={{ width: 277, height: 250 }} />
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
                        <WithKeyboard>
                            <View style={{ height: 400, flexDirection: 'column', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <CustomTextInput
                                        label='Email'
                                        placeholder='Cth: johndoe@gmail.com'
                                        labelStyle={{ color: Colors.light.primary }}
                                        value={values.email}
                                        onChangeText={handleChange('email')}
                                        error={errors.email}
                                    />
                                    <CustomTextInput
                                        label='Kata sandi'
                                        placeholder='Masukkan minimal 6 karakter'
                                        labelStyle={{ color: Colors.light.primary }}
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        error={errors.password}
                                        secureTextEntry
                                    />
                                    <CustomTextInput
                                        label='Konfirmasi kata sandi'
                                        placeholder='Masukkan kembali kata sandi'
                                        labelStyle={{ color: Colors.light.primary }}
                                        value={values.passwordConfirmation}
                                        onChangeText={handleChange('passwordConfirmation')}
                                        error={errors.passwordConfirmation}
                                        secureTextEntry
                                    />
                                </View>
                                <View>
                                    {/* bug */}
                                    <CustomButton title='Daftar' onPress={handleSubmit as (e?: GestureResponderEvent) => void} size='md' loading={sendCodeLoading} />
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
                        </WithKeyboard>
                    )}
                </Formik>
            </Wrapper>
        </View>
    )
}