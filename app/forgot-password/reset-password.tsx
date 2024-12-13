import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup"
import { ResetPasswordRequest } from '@/hooks/api/auth/authTypes';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '@/hooks/api/auth/useAuth'
import axios from 'axios';
import { useCustomAlert } from '../context/CustomAlertProvider';

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
                    showAlert(`An error occurred: ${status}. Please try again later.`, 'error');
                }
            } else {
                console.log('Unexpected Error:', err);
                showAlert('Please check your internet connection.', 'error');
            }
            return null
        }
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Lupa kata sandi</Text>
                <Text style={styles.subtitle}>Perbaharui kata sandimu untuk melanjutkan</Text>
            </View>

            <Image
                source={require('@/assets/images/forgot-password/reset.png')}
                style={styles.img}
            />

            <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                    <View>
                        <Text style={styles.labelInput}>Kata sandi baru</Text>
                        <View style={{ marginBottom: 8 }}>
                            <TextInput
                                style={[
                                    styles.input,
                                    errors.password && styles.inputError,
                                ]}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Masukkan kata sandi"
                                secureTextEntry={!isPasswordVisible}
                            />
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    top: 15,
                                    right: 12,
                                }}
                                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                            >
                                {
                                    isPasswordVisible ?
                                        <Ionicons name='eye' size={20} color='#969696' />
                                        :
                                        <Ionicons name='eye-off' size={20} color='#969696' />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
            )}

            <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                    <View>
                        <Text style={styles.labelInput}>Konfirmasi kata sandi baru</Text>
                        <View style={{ marginBottom: 8 }}>
                            <TextInput
                                style={[
                                    styles.input,
                                    errors.confirmPassword && styles.inputError,
                                ]}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Masukkan konfirmasi kata sandi"
                                secureTextEntry={!isConfirmPasswordVisible}
                            />
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    top: 15,
                                    right: 12,
                                }}
                                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                            >
                                {
                                    isConfirmPasswordVisible ?
                                        <Ionicons name='eye' size={20} color='#969696' />
                                        :
                                        <Ionicons name='eye-off' size={20} color='#969696' />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
            )}

            <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit((data) => {
                    const resetRequest: ResetPasswordRequest = {
                        email: credentials.email,
                        code: credentials.code,
                        password: data.password,
                    };
                    handleResetPassword(resetRequest);
                })}
            >
                <Text style={styles.buttonText}>Konfirmasi</Text>
            </TouchableOpacity>
        </View>
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
        fontSize: 32,
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