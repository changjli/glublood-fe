import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, GestureResponderEvent, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomTextInput from '@/components/CustomInput/CustomTextInput'
import { Formik } from 'formik'
import CustomText from '@/components/CustomText'
import { FontFamily, FontSize } from '@/constants/Typography'
import CustomButton from '@/components/CustomButton'
import { Colors } from '@/constants/Colors'
import Stepper from '../Stepper'
import useFoodLog from '@/hooks/api/food_log/useFoodLog'
import axios from 'axios'
import useAsyncStorage from '@/hooks/useAsyncStorage'
import { router } from 'expo-router'
import Wrapper from '@/components/Layout/Wrapper'
import FoodLogForm from '../FoodLogForm'


export default function Create() {

    const { storeFoodLog } = useFoodLog()
    const { getData } = useAsyncStorage()

    const [formValue, setFormValue] = useState<PostFoodLogRequest>({
        calories: 0,
        carbohydrate: 0,
        date: '',
        fat: 0,
        food_name: '',
        protein: 0,
        serving_qty: 1,
        serving_size: 'porsi',
        time: '',
        note: '',
        type: 'manual',
        img: undefined,
    })

    const [storeLoading, setStoreLoading] = useState(false)

    const handleStoreFoodLog = async (payload: PostFoodLogRequest) => {
        try {
            const formData = new FormData()
            formData.append('payload', JSON.stringify(payload))
            if (payload.img) {
                const fileResponse = await fetch(payload.img);
                const fileBlob = await fileResponse.blob();

                formData.append('food_image', {
                    uri: payload.img,
                    name: 'filename.jpeg',
                    type: fileBlob.type || 'image/jpeg',
                } as any);
            }

            console.log("payload", formData)
            const res = await storeFoodLog(setStoreLoading, formData)
            router.navigate('/(tabs)/(notes)')
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.log("error", err)
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
        <FoodLogForm
            formValue={formValue}
        >
            {({ values, handleSubmit }) => (
                <CustomButton
                    title='Simpan catatan'
                    size='md'
                    onPress={() => {
                        handleSubmit()
                        handleStoreFoodLog(values)
                    }}
                    style={{
                        marginTop: 20
                    }}
                />
            )}
        </FoodLogForm>
    )
}

const styles = StyleSheet.create({
    nutrientOuterContainer: {
        padding: 8,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 8,
        borderRadius: 8,
        borderWidth: 1,
    },
    nutrientContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    nutrientInnerLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    nutrientIcon: {
        width: 32,
        height: 32,
    },
})