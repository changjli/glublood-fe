import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert, useWindowDimensions } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup"
import { ResetPasswordRequest } from '@/hooks/api/auth/authTypes';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '@/hooks/api/auth/useAuth'
import axios from 'axios';
import { useCustomAlert } from '../context/CustomAlertProvider';
import CustomTextInput from '@/components/CustomInput/CustomTextInput';
import CustomButton from '@/components/CustomButton';
import { FontSize } from '@/constants/Typography';
import WithKeyboard from '@/components/Layout/WithKeyboard';

type NewPassword = {
    password: string,
    confirmPassword: string,
}

type ResetPasswordProps = {
    setPage: (value: number) => void
    credentials: {
        email: string,
        password: string,
        code: string,
    }
}

const passwordSchema = Yup.object({
    password: Yup.string().required('Password wajib diisi'),
    confirmPassword: Yup.string().required('Confirm Password wajib diisi').oneOf([Yup.ref('password')], 'Konfirmasi password tidak sama'),
});

export default function ResetPassword({ setPage, credentials }: ResetPasswordProps) {
    const { resetPassword } = useAuth()
    const [resetPasswordLoading, setResetPasswordLoading] = useState<boolean>(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const { showAlert } = useCustomAlert()
    const { height } = useWindowDimensions()

    const { control, handleSubmit, formState: { errors } } = useForm<NewPassword>({
        defaultValues: {
            password: '',
            confirmPassword: ''
        },
        resolver: yupResolver(passwordSchema),
        mode: 'onChange',
    })

    const handleResetPassword = async (id: ResetPasswordRequest) => {
        try {
            const res = await resetPassword(setResetPasswordLoading, id)
            const data: ResetPasswordRequest = res.data
            if (res.status === 200) {
                setPage(4)
            }
            console.log("[ResetPasswordRequest]: ", id)
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

    return (
        <WithKeyboard>
            <View style={[styles.container, { height: height }]}>
                <View>
                    <Text style={styles.title}>Lupa kata sandi</Text>
                    <Text style={styles.subtitle}>Perbaharui kata sandimu untuk melanjutkan</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View>
                        <Image
                            source={require('@/assets/images/forgot-password/reset.png')}
                            style={styles.img}
                        />

                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, value } }) => (
                                <CustomTextInput
                                    label='Kata sandi baru'
                                    placeholder='Masukkan kata sandi baru'
                                    value={value}
                                    onChangeText={onChange}
                                    postfix={
                                        <TouchableOpacity
                                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                        >
                                            {
                                                isPasswordVisible ?
                                                    <Ionicons name='eye-off' size={20} color='#969696' />
                                                    :
                                                    <Ionicons name='eye' size={20} color='#969696' />
                                            }
                                        </TouchableOpacity>
                                    }
                                    error={
                                        errors.password ? errors.password.message : ""
                                    }
                                    secureTextEntry={!isPasswordVisible}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field: { onChange, value } }) => (
                                <CustomTextInput
                                    label='Konfirmasi kata sandi baru'
                                    placeholder='Masukkan konfirmasi kata sandi'
                                    value={value}
                                    onChangeText={onChange}
                                    postfix={
                                        <TouchableOpacity
                                            onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                                        >
                                            {
                                                isConfirmPasswordVisible ?
                                                    <Ionicons name='eye-off' size={20} color='#969696' />
                                                    :
                                                    <Ionicons name='eye' size={20} color='#969696' />
                                            }
                                        </TouchableOpacity>
                                    }
                                    error={
                                        errors.confirmPassword ? errors.confirmPassword.message : ""
                                    }
                                    secureTextEntry={!isConfirmPasswordVisible}
                                />
                            )}
                        />
                    </View>

                    <CustomButton
                        title='Konfirmasi'
                        onPress={handleSubmit((data) => {
                            const resetRequest: ResetPasswordRequest = {
                                email: credentials.email,
                                code: credentials.code,
                                password: data.password,
                            };
                            handleResetPassword(resetRequest);
                        })}
                        loading={resetPasswordLoading}
                    />
                </View>
            </View>
        </WithKeyboard>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        flex: 1,
    },
    contentContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '90%',
    },
    title: {
        marginBottom: -6,
        fontSize: FontSize['2xl'],
        fontFamily: 'Helvetica-Bold'
    },
    subtitle: {
        marginBottom: 16,
        color: '#969696',
        fontSize: 16,
        fontFamily: 'Helvetica',
    },
    img: {
        marginHorizontal: 'auto',
        marginBottom: 10,
        width: 120,
        height: 145,
        objectFit: 'cover',
    },
    labelInput: {
        fontSize: 16,
        fontFamily: 'Helvetica-Bold'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 12,
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginTop: -5,
        marginBottom: 8,
    },
    button: {
        marginTop: 'auto',
        height: 60,
        backgroundColor: '#DA6E35',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Helvetica-Bold'
    },
});