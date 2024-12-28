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
import FoodLogForm from './FoodLogForm'
import { useCustomAlert } from '@/app/context/CustomAlertProvider'
import { slugify } from '@/utils/slugify'

const storeFoodLogSchema = object({

})

export default function FoodLogDetailPage() {
    const { id } = useLocalSearchParams()

    const { getFoodLogDetail, updateFoodLog, deleteFoodLog } = useFoodLog()
    const { showAlert } = useCustomAlert()

    const emptyFormValue = {
        id: Number(id),
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
        type: '',
        brand: '',
        img: undefined,
    }
    const [formValue, setFormValue] = useState<PostFoodLogRequest>(emptyFormValue)

    const [getLoading, setGetLoading] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const handleGetFoodLogDetail = async (id: number) => {
        try {
            const res = await getFoodLogDetail(setGetLoading, id)
            const data: GetFoodLogResponse = res.data
            console.log(data)
            setFormValue({
                ...formValue,
                id: data.id,
                date: data.date,
                time: data.time,
                food_name: data.food_name,
                calories: data.calories,
                protein: data.protein,
                carbohydrate: data.carbohydrate,
                fat: data.fat,
                serving_qty: data.serving_qty,
                serving_size: data.serving_size,
                note: data.note ?? '',
                type: data.type,
                img: data.type == 'auto' ? `/storage/master-foods/${slugify(`${data.food_name} ${data.brand}`)}.jpeg` : data.img,
                brand: data.brand,
                cholestrol: data.cholestrol,
                fiber: data.fiber,
                sugar: data.sugar,
                sodium: data.sodium,
                kalium: data.kalium,
            })
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
            return null
        }
    }

    const handleUpdateFoodLog = async (payload: PostFoodLogRequest) => {
        try {
            const formData = new FormData()
            formData.append('payload', JSON.stringify(payload))
            if (payload.img) {
                try {
                    const fileResponse = await fetch(payload.img);
                    const fileBlob = await fileResponse.blob();

                    formData.append('food_image', {
                        uri: payload.img,
                        name: 'filename.jpeg',
                        type: fileBlob.type || 'image/jpeg',
                    } as any);
                } catch (err) {
                    console.log(err)
                }
            }

            console.log("payload", formData)
            const res = await updateFoodLog(setUpdateLoading, Number(id), formData)
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

    const handleDeleteFoodLog = async (id: number) => {
        try {
            const res = await deleteFoodLog(setDeleteLoading, id)
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
        handleGetFoodLogDetail(Number(id))
    }, [])

    return (
        <FoodLogForm
            formValue={formValue}
        >
            {({ handleSubmit, disabled }) => (
                <>
                    <CustomButton
                        title='Simpan catatan'
                        size='md'
                        disabled={disabled || deleteLoading}
                        onPress={handleSubmit(data => handleUpdateFoodLog(data))}
                        loading={updateLoading}
                    />

                    <CustomButton
                        title='Hapus log'
                        size='md'
                        type='delete'
                        onPress={() => {
                            showAlert('Apakah kamu ingin tetap melanjutkan untuk menghapus catatan ini', 'warning', undefined, () => handleDeleteFoodLog(Number(id)))
                        }}
                        disabled={updateLoading}
                        loading={deleteLoading}
                    />
                </>
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