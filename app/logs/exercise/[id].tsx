import { View, Text, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomText from '@/components/CustomText'
import ExerciseLogForm from './ExerciseLogForm'
import useExerciseLog from '@/hooks/api/logs/exercise/useExerciseLog'
import { router, useLocalSearchParams } from 'expo-router'
import axios from 'axios'
import CustomButton from '@/components/CustomButton'
import useAsyncStorage from '@/hooks/useAsyncStorage'
import Wrapper from '@/components/Layout/Wrapper'
import CustomHeader from '@/components/CustomHeader'
import { FontAwesome } from '@expo/vector-icons'
import { FontSize } from '@/constants/Typography'
import { FlexStyles } from '@/constants/Flex'
import { Colors } from '@/constants/Colors'
import { useCustomAlert } from '@/app/context/CustomAlertProvider'

export default function ExerciseLogDetailPage() {
    const { id } = useLocalSearchParams()
    const { getExerciseLogDetail, updateExerciseLog, deleteExerciseLog } = useExerciseLog()
    const { showAlert } = useCustomAlert()

    const [formValue, setFormValue] = useState<StoreExerciseLogReq>({
        burned_calories: 0,
        date: '',
        end_time: '',
        exercise_name: '',
        start_time: '',
        calories_per_kg: 0,
    })
    const [updateLoading, setUpdateLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const handleGetExerciseLogDetail = async (id: number) => {
        try {
            const res = await getExerciseLogDetail(setUpdateLoading, id)
            setFormValue(res.data)
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
        }
    }

    const handleUpdateExerciseLog = async (payload: UpdateExerciseLogReq) => {
        try {
            const res = await updateExerciseLog(setUpdateLoading, payload)
            router.navigate('/(tabs)/(notes)')
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
        }
    }

    const handleDeleteExerciseLog = async (id: number) => {
        try {
            const res = await deleteExerciseLog(setDeleteLoading, id)
            router.navigate('/(tabs)/(notes)')
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
        }
    }

    useEffect(() => {
        handleGetExerciseLogDetail(Number(id))
    }, [])

    return (
        <>
            <CustomHeader title='Edit log olahraga' />
            <Wrapper style={{ backgroundColor: 'white', paddingBottom: 16 }}>
                <ExerciseLogForm
                    formValue={formValue}
                    setFormValue={setFormValue}
                >
                    {({ handleSubmit, disabled }) => (
                        <View>
                            <CustomButton
                                title='Simpan perubahan'
                                size='md'
                                style={{ marginBottom: 10 }}
                                disabled={disabled || deleteLoading}
                                onPress={handleSubmit(data => handleUpdateExerciseLog({
                                    id: Number(id),
                                    ...data,
                                }))}
                                loading={updateLoading}
                            />
                            <CustomButton
                                title='Hapus log'
                                size='md'
                                type='delete'
                                disabled={updateLoading}
                                loading={deleteLoading}
                                onPress={() => {
                                    showAlert('Apakah kamu ingin tetap melanjutkan untuk menghapus catatan ini', 'warning', () => { }, () => handleDeleteExerciseLog(Number(id)))
                                }}
                            />
                        </View>
                    )}
                </ExerciseLogForm>
            </Wrapper>
        </>
    )
}