import { View, Text, Alert, StyleSheet, Image, ScrollView, GestureResponderEvent } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import useMasterFood from '@/hooks/api/master_food/useMasterFood'
import axios from 'axios'
import { FontFamily, FontSize } from '@/constants/Typography'
import CustomText from '@/components/CustomText'
import CustomTimePicker from '../../CustomTimePicker'
import CustomQuantityPicker from '../../CustomQuantityPicker'
import { Colors } from '@/constants/Colors'
import CustomTextInput from '@/components/CustomInput/CustomTextInput'
import CustomButton from '@/components/CustomButton'
import useFoodLog from '@/hooks/api/food_log/useFoodLog'
import { Formik } from 'formik'
import { number, object, string } from 'yup'
import { FlatList } from 'react-native-reanimated/lib/typescript/Animated'
import useAsyncStorage from '@/hooks/useAsyncStorage'

const storeFoodLogSchema = object({

})

export default function Detail() {
    const { id } = useLocalSearchParams()
    const { getData } = useAsyncStorage()

    const { getMasterFoodDetail } = useMasterFood()
    const { storeFoodLog } = useFoodLog()

    const [food, setFood] = useState<GetMasterFoodDetailResponse | null>(null)
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
        type: 0,
    })

    const [getLoading, setGetLoading] = useState(false)

    const handleGetMasterFoodDetail = async () => {
        try {
            const res = await getMasterFoodDetail(setGetLoading, id as string)
            const data: GetMasterFoodDetailResponse = res.data
            setFood(data)
            handlePopulateFormValue(data)
        } catch (err) {
            setFood(null)
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

    const handlePopulateFormValue = async (data: GetMasterFoodDetailResponse) => {
        const date = await getData('foodLogDate')
        setFormValue({
            ...formValue,
            calories: data.calories,
            carbohydrate: data.carbohydrate,
            fat: data.fat,
            protein: data.protein,
            food_name: data.food_name,
            date: date ?? '',
        })
    }

    useEffect(() => {
        handleGetMasterFoodDetail()
    }, [])

    return (
        <ScrollView style={{ flex: 1, padding: 16 }}>
            <CustomText size='xl' weight='heavy'>{food?.food_name}</CustomText>
            <View style={styles.nutrientOuterContainer}>
                <View style={[styles.nutrientContainer, { width: '100%' }]}>
                    <Image source={require('@/assets/images/foods/calorie_icon.png')} style={styles.nutrientIcon} />
                    <Text style={styles.nutrientTitle}>Kalori</Text>
                    <Text style={styles.nutrientText}>{food?.calories} Kkal/Porsi</Text>
                </View>
                <View style={[styles.nutrientContainer, { width: '30%' }]}>
                    <Image source={require('@/assets/images/foods/protein_icon.png')} style={styles.nutrientIcon} />
                    <CustomText size='sm' weight='heavy'>Protein</CustomText>
                    <CustomText size='sm'>{food?.protein} g</CustomText>
                </View>
                <View style={[styles.nutrientContainer, { width: '30%' }]}>
                    <Image source={require('@/assets/images/foods/carbohydrate_icon.png')} style={styles.nutrientIcon} />
                    <CustomText size='sm' weight='heavy'>Karbohidrat</CustomText>
                    <CustomText size='sm'>{food?.carbohydrate} g</CustomText>
                </View>
                <View style={[styles.nutrientContainer, { width: '30%' }]}>
                    <Image source={require('@/assets/images/foods/fat_icon.png')} style={styles.nutrientIcon} />
                    <CustomText size='sm' weight='heavy'>Lemak</CustomText>
                    <CustomText size='sm'>{food?.fat} g</CustomText>
                </View>
            </View>
            <Formik
                initialValues={formValue}
                onSubmit={async (values) => {
                    await handleStoreFoodLog(values)
                }}
                enableReinitialize
                validationSchema={storeFoodLogSchema}
            >
                {({ handleChange, handleSubmit, values, errors }) => (
                    <View style={styles.formContainer}>
                        <CustomTimePicker
                            value={values.time}
                            onChange={handleChange('time')}
                            error={errors.time}
                        />
                        <CustomQuantityPicker
                            qty={values.serving_qty}
                            size={values.serving_size}
                            onChangeQty={handleChange('serving_qty')}
                            onChangeSize={handleChange('serving_size')}
                        />
                        <CustomTextInput
                            label='Catatan'
                            placeholder='Masukkan catatan di bagian ini'
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical='top'
                            value={values.note}
                            onChangeText={handleChange('note')}
                        />
                        <CustomButton title='Submit' onPress={handleSubmit as (e?: GestureResponderEvent) => void} />
                    </View>
                )}
            </Formik>
        </ScrollView>
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