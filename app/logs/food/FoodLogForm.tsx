import { View, Text, Alert, StyleSheet, Image, ScrollView, GestureResponderEvent, TouchableOpacity } from 'react-native'
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
import Stepper from './Stepper'
import Wrapper from '@/components/Layout/Wrapper'
import CustomImagePicker from '@/components/CustomImagePicker'
import CustomTimePicker from '@/components/CustomTimePicker'
import CustomQuantityPicker from '@/components/CustomQuantityPicker'
import { FlexStyles } from '@/constants/Flex'
import { FontAwesome } from '@expo/vector-icons'
import Collapsible from 'react-native-collapsible';

interface FoodLogFormRenderProps {
    values: PostFoodLogRequest
    handleSubmit: () => void
}

interface FoodLogFormProps {
    formValue: PostFoodLogRequest
    children: (props: FoodLogFormRenderProps) => React.ReactNode
}

export default function FoodLogForm({ formValue, children, ...rest }: FoodLogFormProps) {

    const [showAdditional, setShowAdditional] = useState(true)

    const getSizeData = () => {
        const sizeData = []
        for (let i = formValue.serving_qty; i < formValue.serving_qty * 100; i += formValue.serving_qty) {
            sizeData.push(i)
        }
        return sizeData
    }

    return (
        <Formik
            initialValues={formValue}
            onSubmit={async (values) => {
            }}
            enableReinitialize
        >
            {({ handleChange, setFieldValue, handleSubmit, values, errors }) => {

                // useEffect(() => {
                //     setTimeout(() => {
                //         setFieldValue('calories', values.calories * values.serving_qty)
                //         setFieldValue('protein', values.protein * values.serving_qty)
                //         setFieldValue('carbohydrate', values.carbohydrate * values.serving_qty)
                //         setFieldValue('fat', values.fat * values.serving_qty)
                //     }, 1000)
                // }, [values.serving_qty])

                return (
                    <ScrollView style={styles.formContainer}>

                        <CustomImagePicker image={values.img ?? ''} onChange={v => setFieldValue('img', v)}>
                            <Image
                                source={{
                                    // uri: values.img ? process.env.EXPO_PUBLIC_API_URL + values.img : 'https://placehold.jp/300x400.png'
                                    uri: values.img ? values.img : 'https://placehold.jp/300x400.png'
                                }}
                                style={{
                                    flex: 1,
                                    height: 300,
                                }}
                            />
                        </CustomImagePicker>


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
                                    <CustomText size='md' weight='heavy'>Niali gizi makanan</CustomText>
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
                                    <View style={styles.headerContainer}>
                                        <CustomText size='xl' weight='heavy' style={{ flex: 2 }}>{formValue.food_name}</CustomText>
                                        <View style={styles.brandCotnainer}>
                                            <CustomText>{formValue.brand}</CustomText>
                                        </View>
                                    </View>
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
                                    <View style={styles.additionalContainer}>
                                        <TouchableOpacity onPress={() => setShowAdditional(!showAdditional)}>
                                            <View style={[FlexStyles.flexRow, { justifyContent: 'space-between' }]}>
                                                <CustomText weight='heavy'>Informasi Nilai Gizi Tambahan</CustomText>
                                                <FontAwesome name='chevron-down' />
                                            </View>
                                        </TouchableOpacity>
                                        <Collapsible collapsed={showAdditional}>
                                            <View style={styles.additionalItemContainer}>
                                                <CustomText size='sm'>Kolestrol</CustomText>
                                                <CustomText size='sm'>{formValue.cholestrol} mg</CustomText>
                                            </View>
                                            <View style={styles.additionalItemContainer}>
                                                <CustomText size='sm'>Fiber</CustomText>
                                                <CustomText size='sm'>{formValue.fiber} g</CustomText>
                                            </View>
                                            <View style={styles.additionalItemContainer}>
                                                <CustomText size='sm'>Gula</CustomText>
                                                <CustomText size='sm'>{formValue.sugar} g</CustomText>
                                            </View>
                                            <View style={styles.additionalItemContainer}>
                                                <CustomText size='sm'>Sodium</CustomText>
                                                <CustomText size='sm'>{formValue.sodium} mg</CustomText>
                                            </View>
                                            <View style={[styles.additionalItemContainer, { borderBottomWidth: 0 }]}>
                                                <CustomText size='sm'>Kalium</CustomText>
                                                <CustomText size='sm'>{formValue.kalium} mg</CustomText>
                                            </View>
                                        </Collapsible>
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
                                qtyData={getSizeData()}
                                typeData={formValue.serving_size != '' ? [formValue.serving_size] : []}
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
                        <View style={{ height: 20 }} />
                    </ScrollView>
                )
            }}
        </Formik>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        ...FlexStyles.flexRow,
        justifyContent: 'space-between',
    },
    brandCotnainer: {
        ...FlexStyles.flexRow,
        justifyContent: 'center',
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.light.primary,
        borderRadius: 8,
    },
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
        backgroundColor: 'white',
    },
    nutrientOuterContainer: {
        padding: 8,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.light.gray300,
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
    additionalContainer: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 8,
        elevation: 3,
    },
    additionalItemContainer: {
        ...FlexStyles.flexRow,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.gray300,
        paddingVertical: 4,
        borderStyle: 'dashed',
    }
})