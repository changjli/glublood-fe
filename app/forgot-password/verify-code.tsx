import { View, Text, StyleSheet, Alert, Pressable } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import CustomText from '@/components/CustomText'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field'
import { Colors } from '@/constants/Colors'
import { ForgotPasswordRequest, sendCodeRequest, VerifyCodeRequest } from '@/hooks/api/auth/authTypes'
import useAuth from '@/hooks/api/auth/useAuth'
import Wrapper from '@/components/Layout/Wrapper'
import Loader from '@/components/Loader'
import axios from 'axios'
import { useCustomAlert } from '../context/CustomAlertProvider'

type VerifyCodeProps = {
    setPage: (value: number) => void
    setCredentials: (value: {
        email: string,
        password: string,
        code: string,
    }) => void
    credentials: {
        email: string,
        password: string,
        code: string,
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

export default function VerifyCode({ setPage, setCredentials, credentials }: VerifyCodeProps) {
    const [innerCredentials, setInnerCredentials] = useState(credentials)
    const [timeFlag, setTimeFlag] = useState(false)

    const { forgotPassword, verifyForgotPassword } = useAuth()
    const { showAlert } = useCustomAlert()

    const [sendCodeLoading, setSendCodeLoading] = useState(false)

    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: 6 });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    const [verificationCode, setVerificationCode] = useState('')

    const handleSendCode = async (data: ForgotPasswordRequest) => {
        try {
            const res = await forgotPassword(setSendCodeLoading, data)
            if (res.status == 200) {
                console.log(res.data)
                Alert.alert('success', res.message)
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

    const handleVerifyForgotPasswordCode = async (id: VerifyCodeRequest) => {
        try {
            const res = await verifyForgotPassword(setSendCodeLoading, id)
            const data: VerifyCodeRequest = res.data
            console.log("[VerifyCodeRequest]: ", id)
            if (res.status === 200) {
                setCredentials({ email: id.email, password: '', code: id.code });
                setPage(3)
            }
            return res.data
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    showAlert('Invalid request. Please check your input.', 'error');
                } else if (status === 500) {
                    showAlert('A server error occurred. Please try again later.', 'error');
                } else {
                    // showAlert(`An error occurred: ${status}. Please try again later.`, 'error');
                }
            } else {
                console.log('Unexpected Error:', err);
                showAlert('Please check your internet connection.', 'error');
            }
            return null
        }
    }

    const handleSubmit = async () => {
        handleVerifyForgotPasswordCode({ email: credentials.email, code: verificationCode })
    }

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
                <CustomText size='3xl' weight='heavy'>Verifikasi kode</CustomText>
                <CustomText size='md' style={{ color: Colors.light.gray400, marginTop: -5, marginBottom: 10 }}>Masukkan 6 kode yang telah dikirim ke {credentials.email}</CustomText>
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
                        <Pressable onPress={() => handleSendCode({ email: credentials.email })}>
                            <Text className='text-primary font-helvetica-bold'> Kirim ulang</Text>
                        </Pressable>
                    </View>
                </View>
            </Wrapper>
            {(sendCodeLoading) && (
                <Loader visible={sendCodeLoading} />
            )}
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