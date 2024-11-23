import { View, Text, Alert } from 'react-native'
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

export default function ExerciseLogDetailPage() {
    const { id } = useLocalSearchParams()
    const { getExerciseLogDetail, updateExerciseLog, deleteExerciseLog } = useExerciseLog()

    const [formValue, setFormValue] = useState<StoreExerciseLogReq>({
        burned_calories: 0,
        date: '',
        end_time: '',
        exercise_name: '',
        start_time: '',
    })
    const [storeLoading, setStoreLoading] = useState(false)

    const handleGetExerciseLogDetail = async (id: number) => {
        try {
            const res = await getExerciseLogDetail(setStoreLoading, id)
            setFormValue(res.data)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    Alert.alert('Bad Request', 'Invalid request. Please check your input.');
                } else if (status === 500) {
                    Alert.alert('Server Error', 'A server error occurred. Please try again later.');
                } else {
                    // Alert.alert('Error', `An error occurred: ${status}. Please try again later.`);
                }
            } else {
                console.log('Unexpected Error:', err);
                Alert.alert('Network Error', 'Please check your internet connection.');
            }
        }
    }

    const handleUpdateExerciseLog = async (payload: UpdateExerciseLogReq) => {
        try {
            const res = await updateExerciseLog(setStoreLoading, payload)
            router.navigate('/(tabs)/(notes)')
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    Alert.alert('Bad Request', 'Invalid request. Please check your input.');
                } else if (status === 500) {
                    Alert.alert('Server Error', 'A server error occurred. Please try again later.');
                } else {
                    // Alert.alert('Error', `An error occurred: ${status}. Please try again later.`);
                }
            } else {
                console.log('Unexpected Error:', err);
                Alert.alert('Network Error', 'Please check your internet connection.');
            }
        }
    }

    const handleDeleteExerciseLog = async (id: number) => {
        try {
            const res = await deleteExerciseLog(setStoreLoading, id)
            router.navigate('/(tabs)/(notes)')
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    Alert.alert('Bad Request', 'Invalid request. Please check your input.');
                } else if (status === 500) {
                    Alert.alert('Server Error', 'A server error occurred. Please try again later.');
                } else {
                    // Alert.alert('Error', `An error occurred: ${status}. Please try again later.`);
                }
            } else {
                console.log('Unexpected Error:', err);
                Alert.alert('Network Error', 'Please check your internet connection.');
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
                    {({ values, handleSubmit }) => (
                        <View>
                            <CustomButton
                                title='Simpan perubahan'
                                size='md'
                                style={{ marginBottom: 10 }}
                                disabled={JSON.stringify(values) == JSON.stringify(formValue)}
                                onPress={() => {
                                    handleSubmit()
                                    handleUpdateExerciseLog({
                                        id: Number(id),
                                        ...values,
                                    })
                                }}
                            />
                            <CustomButton title='Hapus log' size='md' onPress={() => handleDeleteExerciseLog(Number(id))} />
                        </View>
                    )}
                </ExerciseLogForm>
            </Wrapper>
        </>
    )
}