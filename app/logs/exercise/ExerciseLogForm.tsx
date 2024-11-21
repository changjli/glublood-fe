import { View, Text, Alert } from 'react-native'
import React, { Children, useEffect, useState } from 'react'
import { Formik, FormikProps, useFormikContext } from 'formik'
import CustomTextInput from '@/components/CustomInput/CustomTextInput'
import ExercisePicker from './ExercisePicker'
import CustomButton from '@/components/CustomButton'
import { getDuration } from '@/utils/formatDatetoString'
import CustomTimePicker from '@/components/CustomTimePicker'
import useProfile from '@/hooks/api/profile/useProfile'
import axios from 'axios'

interface ExerciseLogFormRenderProps {
    values: StoreExerciseLogReq
    handleSubmit: () => void
}

interface ExerciseLogFormProps {
    formValue: StoreExerciseLogReq
    setFormValue: (formValue: StoreExerciseLogReq) => void
    children: (props: ExerciseLogFormRenderProps) => React.ReactNode
}

export default function ExerciseLogForm({ formValue, setFormValue, children, ...rest }: ExerciseLogFormProps) {

    const { fetchUserProfile } = useProfile()

    const [userProfile, setUserProfile] = useState({})
    const [fetchUserProfileLoading, setFetchUserProfileLoading] = useState(false)

    const handleFetchUserProfile = async () => {
        try {
            const res = await fetchUserProfile(setFetchUserProfileLoading)
            setUserProfile(res.data)
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
            return []
        }
    }

    useEffect(() => {
        handleFetchUserProfile()
    }, [])

    return (
        <Formik
            initialValues={formValue}
            onSubmit={(values) => {
                // Additional validation logic
            }}
            enableReinitialize
        >
            {({ handleChange, setFieldValue, handleSubmit, values, errors }) => {
                const [caloriesPerKg, setCaloriesPerKg] = useState(0)

                useEffect(() => {
                    if (caloriesPerKg && values.start_time && values.end_time) {
                        const duration = getDuration(values.start_time, values.end_time)
                        console.log("duration", duration)
                        setFieldValue('burned_calories', Number(userProfile.weight) * caloriesPerKg * duration / 60)
                    }
                }, [caloriesPerKg, values.start_time, values.end_time])

                return (
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                        <View>
                            <ExercisePicker
                                value={values.exercise_name}
                                onChange={({ exerciseName, caloriesPerKg }) => {
                                    setFieldValue('exercise_name', exerciseName)
                                    setCaloriesPerKg(caloriesPerKg)
                                }}
                            />
                            <CustomTimePicker
                                value={values.start_time}
                                onChange={handleChange('start_time')}
                            />
                            <CustomTimePicker
                                value={values.end_time}
                                onChange={handleChange('end_time')}
                            />
                            <CustomTextInput
                                label='Estimasi kalori'
                                value={values.burned_calories ? String(values.burned_calories) : ''}
                                placeholder='0.0 Kal'
                                readOnly
                            />
                        </View>
                        {children({ values, handleSubmit })}
                    </View>
                )
            }}
        </Formik>
    )
}