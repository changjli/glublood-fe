import { View, Text, Alert, StyleSheet, Image, ScrollView, GestureResponderEvent } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import useMasterFood from '@/hooks/api/master_food/useMasterFood'
import axios from 'axios'
import { FontFamily, FontSize } from '@/constants/Typography'
import CustomText from '@/components/CustomText'
import { Colors } from '@/constants/Colors'
import CustomTextInput from '@/components/CustomInput/CustomTextInput'
import CustomButton from '@/components/CustomButton'
import useFoodLog from '@/hooks/api/food_log/useFoodLog'
import { Formik } from 'formik'
import { number, object, string } from 'yup'
import { FlatList } from 'react-native-reanimated/lib/typescript/Animated'
import useAsyncStorage from '@/hooks/useAsyncStorage'
import Wrapper from '@/components/Layout/Wrapper'
import FoodLogForm from '../FoodLogForm'

const storeFoodLogSchema = object({

})

export default function Detail() {
    const { id } = useLocalSearchParams()
    const { getData } = useAsyncStorage()

    const { getMasterFoodDetail } = useMasterFood()
    const { storeFoodLog } = useFoodLog()

    const [formValue, setFormValue] = useState<PostFoodLogRequest>({
        calories: 0,
        carbohydrate: 0,
        date: '',
        fat: 0,
        food_name: '',
        protein: 0,
        serving_qty: 0,
        serving_size: '',
        time: '',
        note: '',
        type: 'auto',
        brand: '',
    })

    const [getLoading, setGetLoading] = useState(false)
    const [storeLoading, setStoreLoading] = useState(false)

    const handleGetMasterFoodDetail = async (id: string) => {
        try {
            const res = await getMasterFoodDetail(setGetLoading, id)
            const data: GetMasterFoodDetailResponse = res.data
            return res.data
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
            return null
        }
    }

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
        const food = await handleGetMasterFoodDetail(String(id))
        setFormValue({
            ...formValue,
            calories: food.calories,
            carbohydrate: food.carbohydrate,
            fat: food.fat,
            protein: food.protein,
            food_name: food.food_name,
            date: date ?? '',
            serving_qty: food.serving_qty,
            serving_size: food.serving_size,
            brand: food.brand,
            cholestrol: food.cholestrol,
            fiber: food.fiber,
            sugar: food.sugar,
            sodium: food.sodium,
            kalium: food.kalium,
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
                    style={{ marginTop: 20 }}
                    loading={storeLoading}
                />
            )}
        </FoodLogForm>
    )
}

const styles = StyleSheet.create({
    nutrientOuterContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    nutrientContainer: {
        padding: 8,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        borderRadius: 12,
        borderWidth: 2,
    },
    nutrientIcon: {
        width: 32,
        height: 32,
    },
    nutrientTitle: {
        fontSize: FontSize.md,
        fontFamily: FontFamily.heavy,
    },
    nutrientText: {
        fontSize: FontSize.md,
        fontFamily: FontFamily.medium,
    },
    formContainer: {
        gap: 10,
    }
})