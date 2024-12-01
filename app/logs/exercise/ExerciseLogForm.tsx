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
import { object, string } from 'yup'
import { useForm, Controller, SubmitHandler, UseFormHandleSubmit } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
interface ExerciseLogFormRenderProps {
    handleSubmit: UseFormHandleSubmit<StoreExerciseLogReq, undefined>
    disabled: boolean
}

interface ExerciseLogFormProps {
    formValue: StoreExerciseLogReq
    setFormValue: (formValue: StoreExerciseLogReq) => void
    children: (props: ExerciseLogFormRenderProps) => React.ReactNode
}

const exerciseLogSchema = object({
    exercise_name: string().required('Exercise name is required'),
    date: string().required('Date is required'),
    start_time: string()
        .required('Start time is required')
        .test('is-less', 'Start time must be before end time', function (value) {
            const { end_time } = this.parent
            if (!end_time || !value) return true;
            const end = new Date(`1970-01-01T${end_time}:00`);
            const start = new Date(`1970-01-01T${value}:00`);
            return start < end;
        }),
    end_time: string()
        .required('End time is required')
        .test('is-greater', 'End time must be after start time', function (value) {
            const { start_time } = this.parent
            if (!start_time || !value) return true;
            const start = new Date(`1970-01-01T${start_time}:00`);
            const end = new Date(`1970-01-01T${value}:00`);
            return end > start;
        }),
})

export default function ExerciseLogForm({ formValue, setFormValue, children, ...rest }: ExerciseLogFormProps) {

    const { fetchUserProfile } = useProfile()

    const { control, handleSubmit, reset, watch, setValue, formState: { errors, isDirty, isValid } } = useForm<StoreExerciseLogReq>({
        defaultValues: formValue,
        resolver: yupResolver(exerciseLogSchema),
        mode: 'onChange',
    })

    const [userProfile, setUserProfile] = useState({})
    const [fetchUserProfileLoading, setFetchUserProfileLoading] = useState(false)

    const [startTime, endTime, caloriesPerKg] = watch(['start_time', 'end_time', 'calories_per_kg'])

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

    useEffect(() => {
        if (isDirty && caloriesPerKg && startTime && endTime) {
            const duration = getDuration(startTime, endTime)
            if (duration > 0) {
                setValue('burned_calories', Number(userProfile.weight) * caloriesPerKg * duration / 60)
            }
        }
    }, [caloriesPerKg, startTime, endTime])

    useEffect(() => {
        reset(formValue)
    }, [formValue])

    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
            <View>
                <Controller
                    control={control}
                    name='exercise_name'
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <ExercisePicker
                            value={value}
                            onChange={({ exerciseName, caloriesPerKg }) => {
                                onChange(exerciseName)
                                setValue('calories_per_kg', caloriesPerKg)
                            }}
                            error={errors.exercise_name ? errors.exercise_name.message : ''}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name='start_time'
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <CustomTimePicker
                            label='Waktu mulai'
                            value={value}
                            onChange={onChange}
                            error={errors.start_time ? errors.start_time.message : ''}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name='end_time'
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <CustomTimePicker
                            label='Waktu selesai'
                            value={value}
                            onChange={onChange}
                            error={errors.end_time ? errors.end_time.message : ''}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name='burned_calories'
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <CustomTextInput
                            label='Estimasi kalori'
                            value={String(Math.round(value * 100) / 100)}
                            placeholder='0.0 Kal'
                            readOnly
                        />
                    )}
                />
            </View>
            {children({ handleSubmit, disabled: !isDirty || !isValid })}
        </View>
    )
}