import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, GestureResponderEvent, Alert } from 'react-native'
import React, { useState } from 'react'
import CustomTextInput from '@/components/CustomInput/CustomTextInput'
import CustomTimePicker from '../CustomTimePicker'
import { Formik } from 'formik'
import CustomQuantityPicker from '../CustomQuantityPicker'
import CustomText from '@/components/CustomText'
import { FontFamily, FontSize } from '@/constants/Typography'
import CustomButton from '@/components/CustomButton'
import { Colors } from '@/constants/Colors'
import Stepper from './Stepper'
import useFoodLog from '@/hooks/api/food_log/useFoodLog'
import axios from 'axios'


export default function Create() {

    const { storeFoodLog } = useFoodLog()

    const [formValue, setFormValue] = useState<StoreFoodLogRequest>({
        calorie: 0,
        carbohydrate: 0,
        date: '2024-10-06',
        fat: 0,
        food_name: '',
        protein: 0,
        serving_qty: 0,
        serving_size: '',
        time: '',
        note: '',
        type: 0,
    })

    const [storeLoading, setStoreLoading] = useState(false)

    const handleStoreFoodLog = async (payload: StoreFoodLogRequest) => {
        try {
            console.log("payload", payload)
            const res = await storeFoodLog(setStoreLoading, payload)
            console.log(res.data)
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

    return (
        <View>
            <Formik
                initialValues={formValue}
                onSubmit={async (values) => {
                    await handleStoreFoodLog(values)
                }}
            >
                {({ handleChange, setFieldValue, handleSubmit, values, errors }) => (
                    <ScrollView style={{
                        padding: 16
                    }}>
                        <CustomTextInput
                            label='Nama makanan'
                            placeholder='Contoh: Nasi goreng'
                            value={values.food_name}
                            onChangeText={handleChange('food_name')}
                        />
                        <CustomText size='sm' weight='heavy'>Niali gizi makanan</CustomText>
                        <View style={styles.nutrientOuterContainer}>
                            <View style={styles.nutrientContainer}>
                                <View style={styles.nutrientInnerLeftContainer}>
                                    <Image source={require('@/assets/images/foods/calorie_icon.png')} style={styles.nutrientIcon} />
                                    <View style={{
                                        flexDirection: 'column',
                                    }}>
                                        <CustomText size='sm' weight='heavy'>Kalori</CustomText>
                                        <CustomText size='sm'>Kkal</CustomText>
                                    </View>
                                </View>
                                <Stepper
                                    value={values.calorie}
                                    onChange={v => {
                                        setFieldValue('calorie', v)
                                    }}
                                />
                            </View>
                            <View style={styles.nutrientContainer}>
                                <View style={styles.nutrientInnerLeftContainer}>
                                    <Image source={require('@/assets/images/foods/protein_icon.png')} style={styles.nutrientIcon} />
                                    <View style={{
                                        flexDirection: 'column',
                                    }}>
                                        <CustomText size='sm' weight='heavy'>Protein</CustomText>
                                        <CustomText size='sm'>Gram</CustomText>
                                    </View>
                                </View>
                                <Stepper
                                    value={values.protein}
                                    onChange={v => {
                                        setFieldValue('protein', v)
                                    }}
                                />
                            </View>
                            <View style={styles.nutrientContainer}>
                                <View style={styles.nutrientInnerLeftContainer}>
                                    <Image source={require('@/assets/images/foods/carbohydrate_icon.png')} style={styles.nutrientIcon} />
                                    <View style={{
                                        flexDirection: 'column',
                                    }}>
                                        <CustomText size='sm' weight='heavy'>Karbohidrat</CustomText>
                                        <CustomText size='sm'>Gram</CustomText>
                                    </View>
                                </View>
                                <Stepper
                                    value={values.carbohydrate}
                                    onChange={v => {
                                        setFieldValue('carbohydrate', v)
                                    }}
                                />
                            </View>
                            <View style={styles.nutrientContainer}>
                                <View style={styles.nutrientInnerLeftContainer}>
                                    <Image source={require('@/assets/images/foods/fat_icon.png')} style={styles.nutrientIcon} />
                                    <View style={{
                                        flexDirection: 'column',
                                    }}>
                                        <CustomText size='sm' weight='heavy'>Lemak</CustomText>
                                        <CustomText size='sm'>Gram</CustomText>
                                    </View>
                                </View>
                                <Stepper
                                    value={values.fat}
                                    onChange={v => {
                                        setFieldValue('fat', v)
                                    }}
                                />
                            </View>
                        </View>
                        <CustomTimePicker
                            value={values.time}
                            onChange={handleChange('time')}
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
                        <CustomButton title='Submit' size='md' onPress={handleSubmit as (e?: GestureResponderEvent) => void} />
                    </ScrollView>
                )}
            </Formik>
        </View>
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