import { View, Text, TouchableWithoutFeedback, Keyboard, StyleSheet, GestureResponderEvent, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomText, { StyledCustomText } from '@/components/CustomText'
import useAsyncStorage from '@/hooks/useAsyncStorage'
import { router } from 'expo-router'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field'
import { Colors } from '@/constants/Colors'
import CustomButton from '@/components/CustomButton'
import { Formik } from 'formik'
import { loginRequest, registerRequest } from '@/hooks/api/auth/authTypes'
import useAuth from '@/hooks/api/auth/useAuth'
import { useSession } from '@/app/context/AuthenticationProvider'

type VerifyCodeProps = {
    credentials: {
        email: string,
        password: string,
    }
}

export default function VerifyCode({ credentials }: VerifyCodeProps) {

    // const { getObjectData } = useAsyncStorage()
    const { register, login } = useAuth()
    const { signIn } = useSession()

    // const [credentials, setCredentials] = useState<{
    //     email: string,
    //     password: string,
    // }>({
    //     email: '',
    //     password: '',
    // })

    const [registerLoading, setRegisterLoading] = useState(false)

    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: 6 });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    // const handleGetCredentials = async () => {
    //     try {
    //         const value = await getObjectData('credentials')
    //         setCredentials(value)
    //     } catch (err) {
    //         console.log('AsyncStorage Error:', err)
    //     }
    // }

    const handleRegister = async (data: { code: string }) => {
        try {
            const payload = {
                ...credentials,
                ...data
            }

            const res = await register(setRegisterLoading, payload)
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

    const handleLogin = async () => {
        const payload = {
            ...credentials,
        }

        try {
            const res = await login(setRegisterLoading, payload)
            if (res.status == 200) {
                console.log(res.data)
                Alert.alert('success', res.message)
                signIn(res)
            } else if (res.status == 400) {
                console.log(res.message)
                Alert.alert('error', res.message)
            }
        } catch (err) {
            console.log('Axios Error:', err)
            Alert.alert('error', 'Error: Please try again later')
        }
    }

    // useEffect(() => {
    //     handleGetCredentials()
    // }, [])

    return (
        <>
            <StyledCustomText style='text-[32px] text-primary' weight='heavy' >Verifikasi kode</StyledCustomText>
            <StyledCustomText size='md' >Masukkan 6 kode yang telah dikirim ke {credentials.email}</StyledCustomText>
            <Formik
                initialValues={{ code: '', }}
                onSubmit={async (values) => {
                    await handleRegister(values)
                    await handleLogin()
                    router.push('/(auth)/UserProfile')
                }}
            >
                {({ handleChange, handleSubmit, values, errors }) => (
                    <View className='flex flex-col gap-4'>
                        <CodeField
                            ref={ref}
                            {...props}
                            value={values.code}
                            onChangeText={handleChange('code')}
                            cellCount={6}
                            rootStyle={styles.codeFieldRoot}
                            keyboardType="default"
                            textContentType="oneTimeCode"
                            renderCell={({ index, symbol, isFocused }) => (
                                <Text
                                    key={index}
                                    style={[styles.cell, isFocused && styles.focusCell]}
                                    onLayout={getCellOnLayoutHandler(index)}>
                                    {symbol || (isFocused ? <Cursor /> : null)}
                                </Text>
                            )}
                        />
                        <CustomButton title='Verifikasi Kode' onPress={handleSubmit as (e?: GestureResponderEvent) => void} loading={registerLoading} />
                    </View>
                )}
            </Formik>
        </>
    )
}

const styles = StyleSheet.create({
    root: { padding: 20, minHeight: 300 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFieldRoot: { marginTop: 20 },
    cell: {
        width: 50,
        height: 70,
        lineHeight: 38,
        fontSize: 35,
        borderWidth: 2,
        borderColor: Colors.light.primary,
        textAlign: 'center',
        textAlignVertical: 'center',
        borderRadius: 20,
    },
    focusCell: {
        backgroundColor: Colors.light.primary,
        color: 'white',
    },
});