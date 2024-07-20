import { View, Text, TouchableWithoutFeedback, Keyboard, GestureResponderEvent, Alert, Pressable } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import { StyledCustomTextInput } from '@/components/CustomInput/CustomTextInput'
import { StyledCustomButton } from '@/components/CustomButton'
import { StyledCustomText } from '@/components/CustomText'
import { object, string } from 'yup'
import { router } from 'expo-router'

const loginSchema = object({
    email: string().required(),
    password: string().required(),
})

export default function Login() {
    const user = { email: 'nicholas audric', password: 'password' }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className='flex-1 p-[16px]'>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    onSubmit={(values) => {
                        if (values.email == user.email && values.password == values.password) {
                            router.replace('(auth)/register')
                        } else {
                            Alert.alert('Error', 'Login failed!')
                        }
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
                                <StyledCustomButton title='Masuk' onPress={handleSubmit as (e?: GestureResponderEvent) => void} size='md' />
                                <View className='flex flex-row justify-center'>
                                    <StyledCustomText size='sm' weight='heavy' style='text-gray-500'>
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