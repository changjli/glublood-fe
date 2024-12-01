import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Wrapper from '@/components/Layout/Wrapper'
import CustomText from '@/components/CustomText'
import ExerciseLogForm from './ExerciseLogForm'
import useExerciseLog from '@/hooks/api/logs/exercise/useExerciseLog'
import { router } from 'expo-router'
import axios from 'axios'
import CustomButton from '@/components/CustomButton'
import useAsyncStorage from '@/hooks/useAsyncStorage'
import CustomHeader from '@/components/CustomHeader'

export default function CreateExerciseLogPage() {
    const { storeExerciseLog } = useExerciseLog()
    const { getData } = useAsyncStorage()

    const [formValue, setFormValue] = useState<StoreExerciseLogReq>({
        burned_calories: 0,
        date: '',
        end_time: '',
        exercise_name: '',
        start_time: '',
        calories_per_kg: 0,
    })
    const [storeLoading, setStoreLoading] = useState(false)

    const handleStoreExerciseLog = async (payload: StoreExerciseLogReq) => {
        try {
            console.log("payload", payload)
            const res = await storeExerciseLog(setStoreLoading, payload)
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

    const handlePopulateFormValue = async () => {
        const date = await getData('foodLogDate')
        setFormValue({
            ...formValue,
            date: date ?? '',
        })
    }

    useEffect(() => {
        handlePopulateFormValue()
    }, [])

    return (
        <>
            <CustomHeader title='Tambah log olahraga' />
            <Wrapper style={{ backgroundColor: 'white', marginBottom: 16 }}>
                <ExerciseLogForm
                    formValue={formValue}
                    setFormValue={setFormValue}
                >
                    {({ handleSubmit, disabled }) => (
                        <CustomButton
                            title='Simpan catatan'
                            size='md'
                            disabled={disabled}
                            onPress={handleSubmit(data => handleStoreExerciseLog(data))}
                            loading={storeLoading}
                        />
                    )}
                </ExerciseLogForm>
            </Wrapper>
        </>
    )
}