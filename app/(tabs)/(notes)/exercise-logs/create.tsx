import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Wrapper from '@/components/Layout'
import CustomText from '@/components/CustomText'
import ExerciseLogForm from './ExerciseLogForm'
import useExerciseLog from '@/hooks/api/logs/exercise/useExerciseLog'
import { router } from 'expo-router'
import axios from 'axios'
import CustomButton from '@/components/CustomButton'
import useAsyncStorage from '@/hooks/useAsyncStorage'

export default function CreateExerciseLogPage() {
    const { storeExerciseLog } = useExerciseLog()
    const { getData } = useAsyncStorage()

    const [formValue, setFormValue] = useState<StoreExerciseLogReq>({
        burned_calories: 0,
        date: '',
        end_time: '',
        exercise_name: '',
        start_time: '',
    })
    const [storeLoading, setStoreLoading] = useState(false)

    const handleStoreExerciseLog = async (payload: StoreExerciseLogReq) => {
        try {
            console.log("payload", payload)
            const res = await storeExerciseLog(setStoreLoading, payload)
            router.navigate('/(notes)/exercise-logs')
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
        <Wrapper>
            <CustomText size='xl' weight='heavy'>Tambah log gula darah</CustomText>
            <ExerciseLogForm
                formValue={formValue}
                setFormValue={setFormValue}
            >
                {({ values, handleSubmit }) => (
                    <CustomButton title='Simpan catatan' size='md' onPress={() => {
                        handleSubmit()
                        handleStoreExerciseLog(values)
                    }} />
                )}
            </ExerciseLogForm>
        </Wrapper>
    )
}