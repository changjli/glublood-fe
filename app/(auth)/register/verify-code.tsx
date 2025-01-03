import { View, Text, TouchableWithoutFeedback, Keyboard, StyleSheet, GestureResponderEvent, Alert, Pressable } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import CustomText from '@/components/CustomText'
import useAsyncStorage from '@/hooks/useAsyncStorage'
import { router } from 'expo-router'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field'
import { Colors } from '@/constants/Colors'
import CustomButton from '@/components/CustomButton'
import { Formik } from 'formik'
import { loginRequest, registerRequest, sendCodeRequest } from '@/hooks/api/auth/authTypes'
import useAuth from '@/hooks/api/auth/useAuth'
import { useSession } from '@/app/context/AuthenticationProvider'
import Wrapper from '@/components/Layout/Wrapper'
import Loader from '@/components/Loader'
import axios from 'axios'

type VerifyCodeProps = {
    credentials: {
        email: string,
        password: string,
    }
}

const Timer = ({ time, flag }: { time: number, flag: boolean }) => {
    const [timer, setTimer] = useState(time);
    const timeOutCallback = useCallback(() => setTimer(currTimer => currTimer - 1), []);

    useEffect(() => {
        setTimer(time)
    }, [flag])

    useEffect(() => {
        if (timer > 0) {
            const timeout = setTimeout(timeOutCallback, 1000);
            return () => clearTimeout(timeout)
        }
    }, [timer]);

    const minutes = Math.floor(timer / 60)
    const seconds = timer - minutes * 60

    return (
        <View>
            {minutes === 0 && seconds === 0
                ? <Text style={{ color: Colors.light.danger }}>00:00</Text>
                : <Text style={{ color: Colors.light.secondary }}> {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</Text>
            }
        </View>
    )
}

export default function VerifyCode({ credentials }: VerifyCodeProps) {
    const [innerCredentials, setInnerCredentials] = useState(credentials)
    const [timeFlag, setTimeFlag] = useState(false)

    // const { getObjectData } = useAsyncStorage()
    const { register, login, sendCode } = useAuth()
    const { signIn } = useSession()

    // const [credentials, setCredentials] = useState<{
    //     email: string,
    //     password: string,
    // }>({
    //     email: '',
    //     password: '',
    // })

    const [registerLoading, setRegisterLoading] = useState(false)
    const [loginLoading, setLoginLoading] = useState(false)
    const [sendCodeLoading, setSendCodeLoading] = useState(false)

    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: 6 });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    const [verificationCode, setVerificationCode] = useState('')

    // const handleGetCredentials = async () => {
    //     try {
    //         const value = await getObjectData('credentials')
    //         setCredentials(value)
    //     } catch (err) {
    //         console.log('AsyncStorage Error:', err)
    //     }
    // }

    const handleRegister = async () => {
        try {
            const payload = {
                ...innerCredentials,
                code: verificationCode,
            }

            const res = await register(setRegisterLoading, payload)
            if (res.status == 200) {
                console.log(res.data)
            } else if (res.status == 400) {
                console.log(res.message)
                setVerificationCode('')
                Alert.alert('error', res.message)
            }
        } catch (err) {
            console.log('Axios Error:', err)
            Alert.alert('error', 'Error: Please try again later')
        }
    }

    const handleLogin = async () => {
        try {
            const payload = {
                ...innerCredentials,
            }

            const res = await login(setLoginLoading, payload)
            if (res.status == 200) {
                console.log(res.data)
                signIn(res)
                router.push('/userProfile/first_time_setup')
            } else if (res.status == 400) {
                console.log(res.message)
                Alert.alert('error', res.message)
            }
        } catch (err) {
            console.log('Axios Error:', err)
            Alert.alert('error', 'Error: Please try again later')
        }
    }

    const handleSendCode = async (data: sendCodeRequest) => {
        try {
            const res = await sendCode(setSendCodeLoading, data)
            if (res.status == 200) {
                console.log(res.data)
                Alert.alert('success', res.message)
                // await storeObjectData('credentials', data)
                // router.replace('(auth)/verify-code')
                setTimeFlag(prev => !prev)
            } else if (res.status == 400) {
                console.log(res.message)
                Alert.alert('error', res.message)
            }
        } catch (err) {
            console.log('Axios Error:', err)
            Alert.alert('error', 'Error: Please try again later')
        }
    }

    const handleSubmit = async () => {
        await handleRegister()
        await handleLogin()
    }

    // useEffect(() => {
    //     handleGetCredentials()
    // }, [])

    useEffect(() => {
        setInnerCredentials(credentials)
    }, [])

    useEffect(() => {
        if (verificationCode.length == 6) {
            handleSubmit()
        }
    }, [verificationCode])

    return (
        <View style={{ flex: 1 }}>
            <Wrapper>
                <CustomText size='3xl' weight='heavy' style={{ color: Colors.light.primary }}>Verifikasi kode</CustomText>
                <CustomText size='md' style={{ color: Colors.light.gray400, marginBottom: 10 }}>Masukkan 6 kode yang telah dikirim ke {credentials.email}</CustomText>
                <View className='flex flex-col gap-4'>
                    <CodeField
                        ref={ref}
                        {...props}
                        value={verificationCode}
                        onChangeText={setVerificationCode}
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
                    <View className='flex flex-row justify-end'>
                        <Text>Batas Waktu</Text><Timer time={3 * 60} flag={timeFlag} />
                    </View>
                    <View className='flex flex-row justify-center'>
                        <Text>Tidak menerima kode?</Text>
                        <Pressable onPress={() => handleSendCode(credentials)}>
                            <Text className='text-primary font-helvetica-bold'> Kirim ulang</Text>
                        </Pressable>
                    </View>
                </View>
            </Wrapper>
            <Loader visible={registerLoading || loginLoading || sendCodeLoading} />
        </View>
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