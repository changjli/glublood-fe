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
import CustomTimePicker from '../CustomTimePicker'
import CustomQuantityPicker from '../CustomQuantityPicker'
import Stepper from './Stepper'
import Wrapper from '@/components/Layout'

interface FoodLogFormRenderProps {
    values: StoreFoodLogRequest | UpdateFoodLogReq
    handleSubmit: () => void
}

interface FoodLogFormProps {
    formValue: StoreFoodLogRequest | UpdateFoodLogReq
    children: (props: FoodLogFormRenderProps) => React.ReactNode
}

export default function FoodLogForm({ formValue, children, ...rest }: FoodLogFormProps) {
    return (
        <Formik
            initialValues={formValue}
            onSubmit={async (values) => {
            }}
            enableReinitialize
        >
            {({ handleChange, setFieldValue, handleSubmit, values, errors }) => (
                <ScrollView style={styles.formContainer}>
                    <Image
                        source={{
                            uri: values.img ?? 'https://picsum.photos/300/400'
                        }}
                        style={{
                            flex: 1,
                            height: 300,
                        }}
                    />

                    <Wrapper style={{ gap: 10 }}>
                        {/* manual */}
                        {values.type == 'manual' && (
                            <>
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
                                            value={values.calories}
                                            onChange={v => {
                                                setFieldValue('calories', v)
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
                            </>
                        )}

                        {/* auto */}
                        {values.type == 'auto' && (
                            <>
                                <CustomText size='xl' weight='heavy'>{formValue.food_name}</CustomText>
                                <View style={styles.nutrientAutoOuterContainer}>
                                    <View style={[styles.nutrientAutoContainer, { width: '100%' }]}>
                                        <Image source={require('@/assets/images/foods/calorie_icon.png')} style={styles.nutrientAutoIcon} />
                                        <Text style={styles.nutrientAutoTitle}>Kalori</Text>
                                        <Text style={styles.nutrientAutoText}>{values.calories} Kkal/Porsi</Text>
                                    </View>
                                    <View style={[styles.nutrientAutoContainer, { width: '30%' }]}>
                                        <Image source={require('@/assets/images/foods/protein_icon.png')} style={styles.nutrientAutoIcon} />
                                        <CustomText size='sm' weight='heavy'>Protein</CustomText>
                                        <CustomText size='sm'>{values.protein} g</CustomText>
                                    </View>
                                    <View style={[styles.nutrientAutoContainer, { width: '30%' }]}>
                                        <Image source={require('@/assets/images/foods/carbohydrate_icon.png')} style={styles.nutrientAutoIcon} />
                                        <CustomText size='sm' weight='heavy'>Karbohidrat</CustomText>
                                        <CustomText size='sm'>{values.carbohydrate} g</CustomText>
                                    </View>
                                    <View style={[styles.nutrientAutoContainer, { width: '30%' }]}>
                                        <Image source={require('@/assets/images/foods/fat_icon.png')} style={styles.nutrientAutoIcon} />
                                        <CustomText size='sm' weight='heavy'>Lemak</CustomText>
                                        <CustomText size='sm'>{values.fat} g</CustomText>
                                    </View>
                                </View>
                            </>
                        )}

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
                            label='Pilih porsi'
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
                        {children({ values, handleSubmit })}
                    </Wrapper>
                </ScrollView>
            )}
        </Formik>
    )
}

const styles = StyleSheet.create({
    nutrientAutoOuterContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    nutrientAutoContainer: {
        padding: 8,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        borderRadius: 12,
        backgroundColor: 'white',
        elevation: 3,
    },
    nutrientAutoIcon: {
        width: 32,
        height: 32,
    },
    nutrientAutoTitle: {
        fontSize: FontSize.md,
        fontFamily: FontFamily.heavy,
    },
    nutrientAutoText: {
        fontSize: FontSize.md,
        fontFamily: FontFamily.medium,
    },
    formContainer: {
        gap: 10,
    },
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