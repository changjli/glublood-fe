import { View, Text, Alert, StyleSheet, Image, ScrollView, GestureResponderEvent } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import useMasterFood from '@/hooks/api/master_food/useMasterFood'
import axios from 'axios'
import { FontFamily, FontSize } from '@/constants/Typography'
import CustomText from '@/components/CustomText'
import CustomTimePicker from '../../../CustomTimePicker'
import CustomQuantityPicker from '../../../CustomQuantityPicker'
import { Colors } from '@/constants/Colors'
import CustomTextInput from '@/components/CustomInput/CustomTextInput'
import CustomButton from '@/components/CustomButton'
import useFoodLog from '@/hooks/api/food_log/useFoodLog'
import { Formik } from 'formik'
import { number, object, string } from 'yup'
import { FlatList } from 'react-native-reanimated/lib/typescript/Animated'
import useAsyncStorage from '@/hooks/useAsyncStorage'
import Wrapper from '@/components/Layout'
import FoodLogForm from '../../FoodLogForm'

const storeFoodLogSchema = object({

})

export default function CreateBarcodePage() {
    const { barcode } = useLocalSearchParams()
    const { getData } = useAsyncStorage()

    const { getFoodByBarcode, storeFoodLog } = useFoodLog()

    const [formValue, setFormValue] = useState<StoreFoodLogRequest>({
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
    })

    const [getLoading, setGetLoading] = useState(false)

    const handleGetMasterFoodDetail = async (barcode: string) => {
        try {
            const payload = {
                barcode
            }
            const res = await getFoodByBarcode(setGetLoading, payload)
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

    const handleStoreFoodLog = async (payload: StoreFoodLogRequest) => {
        try {
            console.log("payload", payload)
            const res = await storeFoodLog(setGetLoading, payload)
            router.navigate('/(notes)/food-logs')
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
        const food = await handleGetMasterFoodDetail(String(barcode))
        setFormValue({
            ...formValue,
            calories: food.product.nutriments.energy,
            carbohydrate: food.product.nutriments.carbohydrates,
            fat: food.product.nutriments.fat,
            protein: food.product.nutriments.proteins,
            food_name: food.product.product_name,
            date: date ?? '',
            img: food.product.image_url
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