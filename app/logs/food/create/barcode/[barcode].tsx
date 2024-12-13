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
import FoodLogForm from '../../FoodLogForm'
import { formatDatetoStringYmd } from '@/utils/formatDatetoString'
import Loader from '@/components/Loader'
import { useCustomAlert } from '@/app/context/CustomAlertProvider'

const storeFoodLogSchema = object({

})

export default function CreateBarcodePage() {
    const { barcode } = useLocalSearchParams()
    const { getData } = useAsyncStorage()
    const { getFoodByBarcode, storeFoodLog } = useFoodLog()
    const { showAlert } = useCustomAlert()

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
        type: 'barcode',
    })

    const [getLoading, setGetLoading] = useState(false)
    const [storeLoading, setStoreLoading] = useState(false)

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
        }
    }

    const handlePopulateFormValue = async () => {
        const date = formatDatetoStringYmd(new Date())
        const food = await handleGetMasterFoodDetail(String(barcode))

        setFormValue({
            ...formValue,
            calories: food.product.nutriments.energy,
            carbohydrate: food.product.nutriments.carbohydrates,
            fat: food.product.nutriments.fat,
            protein: food.product.nutriments.proteins,
            food_name: food.product.product_name,
            date: date ?? '',
            img: food.product.image_url,
            // serving_qty: food.product.nutrition_data_per == '100g' ? 100 : 1,
            // serving_size: food.product.nutrition_data_per == '100g' ? 'g' : 'serving',
            serving_qty: 1,
            serving_size: 'serving',
        })
    }

    useEffect(() => {
        handlePopulateFormValue()
    }, [])

    useEffect(() => {
        console.log("dimana", formValue)
    }, [formValue])

    return (
        <>
            <Loader visible={getLoading} />
            {!formValue.calories ? (
                <>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('@/assets/images/characters/404.png')} style={{ marginBottom: 4 }} />
                        <CustomText style={{ textAlign: 'center', paddingHorizontal: 20 }}>Maaf, data makanan yang kamu pindai tidak ada di penyimpanan kami</CustomText>
                    </View>
                    <View style={{ padding: 16 }}>
                        <CustomButton title='Tambahkan secara manual' onPress={() => router.push('/logs/food/create')} />
                    </View>
                </>
            ) : (
                <FoodLogForm
                    formValue={formValue}
                >
                    {({ handleSubmit, disabled }) => (
                        <CustomButton
                            title='Simpan catatan'
                            size='md'
                            disabled={disabled}
                            onPress={handleSubmit((data) => handleStoreFoodLog(data))}
                            style={{ marginTop: 20 }}
                            loading={storeLoading}
                        />
                    )}
                </FoodLogForm>
            )}
        </>
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