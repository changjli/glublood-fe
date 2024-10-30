import { View, Text, Keyboard, TouchableWithoutFeedback, StyleSheet, TouchableOpacity, Pressable, GestureResponderEvent, Alert, Image } from 'react-native'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { FontSize, FontFamily } from '@/constants/Typography'
import CustomButton, { CustomButtonProps, StyledCustomButton } from '@/components/CustomButton'
import { Ionicons } from '@expo/vector-icons'
import { Formik } from 'formik'
import CustomTextInput, { StyledCustomTextInput } from '@/components/CustomInput/CustomTextInput'
import index from '..'
import { Colors } from '@/constants/Colors'
import Mcq from './Mcq'
import DiabetesPedigree from './DiabetesPedigree'
import usePrediction from '@/hooks/api/prediction/usePrediction'
import { predictionRequest, predictionResponse } from '@/hooks/api/prediction/predictionTypes'
import { useSession } from '@/app/context/AuthenticationProvider'
import { router } from 'expo-router'

export type prediction = {
    pregnancies: number,
    glucose: number,
    blood_pressure: number,
    skin_thickness: number,
    insulin: number,
    weight: number,
    height: number,
    bmi: number,
    is_father: number,
    is_mother: number,
    is_sister: number,
    is_brother: number,
    age: number,
}

export default function Prediction() {
    const { session } = useSession()
    const { storePrediction } = usePrediction()

    // Initialize questions 
    // refactor: bisa dipindahin 
    const qnas = [{
        group: 'mcq',
        key: 'pregnancies',
        question: 'Sudah berapa kali anda mengalami kehamilan?',
        answers: [
            {
                label: 'A. 0-4 kali',
                value: 2,
            }, {
                label: 'B. 5-8 kali',
                value: 6.5,
            }, {
                label: 'C. 9-12 kali',
                value: 10.5,
            }, {
                label: 'D. 13-16 kali',
                value: 14.5,
            }, {
                label: 'E. Lebih dari 16 kali',
                value: 16,
            }
        ]
    }, {
        group: 'mcq',
        key: 'glucose',
        question: 'Setelah meminum 75g gula, berapa kadar gula darah Anda setelah 2 jam?',
        answers: [
            {
                label: 'A. 0-50 mg/dL',
                value: 25,
            }, {
                label: 'B. 51-100 mg/dL',
                value: 75,
            }, {
                label: 'C. 101-150 mg/dL',
                value: 125,
            }, {
                label: 'D. 151-200 mg/dL',
                value: 175,
            }, {
                label: 'E. Lebih dari 200 mg/dL',
                value: 200,
            }
        ]
    }, {
        group: 'mcq',
        key: 'blood_pressure',
        question: 'Berapa tekanan darah diastolik Anda?',
        answers: [
            {
                label: 'A. 0-30 mmHg',
                value: 15,
            }, {
                label: 'B. 31-60 mmHg',
                value: 45,
            }, {
                label: 'C. 61-90 mmHg',
                value: 75,
            }, {
                label: 'D. 91-120 mmHg',
                value: 105,
            }, {
                label: 'E. Lebih dari 120 mmHg',
                value: 120,
            }
        ]
    }, {
        group: 'mcq',
        key: 'skin_thickness',
        question: 'Berapa ketebalan kulit Anda di perut setelah dipinch?',
        answers: [
            {
                label: 'A. 0-25 mm',
                value: 12.5,
            }, {
                label: 'B. 26-50 mm',
                value: 37.5,
            }, {
                label: 'C. 51-75 mm',
                value: 62.5,
            }, {
                label: 'D. 76-100 mm',
                value: 97.5,
            }, {
                label: 'E. Lebih dari 100 mm',
                value: 112.5,
            }
        ]
    }, {
        group: 'mcq',
        key: 'insulin',
        question: 'Berapa kadar insulin dalam tubuh anda?',
        answers: [
            {
                label: 'A. 0-25 mm',
                value: 12.5,
            }, {
                label: 'B. 26-50 mm',
                value: 37.5,
            }, {
                label: 'C. 51-75 mm',
                value: 62.5,
            }, {
                label: 'D. 76-100 mm',
                value: 97.5,
            }, {
                label: 'E. Lebih dari 100 mm',
                value: 112.5,
            }
        ]
    }, {
        group: 'bmi',
        key: 'bmi',
        question: 'Kalkulator Body Mass Index (BMI)',
        answers: [],
    }, {
        group: 'diabetes_pedigree',
        key: 'is_father',
        question: 'Apakah ayah Anda terkena diabetes?',
        answers: [],
    }, {
        group: 'diabetes_pedigree',
        key: 'is_mother',
        question: 'Apakah ibu Anda terkena diabetes?',
        answers: [],
    }, {
        group: 'diabetes_pedigree',
        key: 'is_sister',
        question: 'Apakah saudara perempuan Anda terkena diabetes?',
        answers: [],
    }, {
        group: 'diabetes_pedigree',
        key: 'is_brother',
        question: 'Apakah saudara laki-laki Anda terkena diabetes?',
        answers: [],
    }]

    const [page, setPage] = useState(0)
    const [predictionLoading, setPredictionLoading] = useState(false)
    const [result, setResult] = useState(-1)

    const handleNextPage = () => setPage(page + 1)
    const handlePreviousPage = () => setPage(page - 1)
    const isFirstPage = page == 0
    const isLastPage = page == qnas.length - 1

    const handleCalculateBMI = (weight: number, height: number) => {
        return Math.round(Number(weight) / Math.pow(Number(height) / 100, 2) * 100) / 100
    }

    const handleStorePrediction = async (data: predictionRequest) => {
        try {
            const res = await storePrediction(setPredictionLoading, data)
            if (res.status == 200) {
                const data: predictionResponse = res.data
                console.log(data)
                setResult(data.result)
            } else if (res.status == 400) {
                console.log(res.message)
                Alert.alert('error', res.message)
            }
        } catch (err) {
            console.log('Axios Error:', err)
            Alert.alert('error', 'Error: Please try again later')
        }
    }

    const handleReset = () => {
        setPage(0)
        setResult(-1)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className='flex-1 px-[16px] py-[22px] bg-background'>
                {
                    result == -1 &&
                    <Formik<prediction>
                        initialValues={{
                            pregnancies: -1,
                            glucose: -1,
                            blood_pressure: -1,
                            skin_thickness: -1,
                            insulin: -1,
                            weight: 0,
                            height: 0,
                            bmi: 0,
                            is_father: -1,
                            is_mother: -1,
                            is_sister: -1,
                            is_brother: -1,
                            age: 20,
                        }}
                        onSubmit={async (values) => {
                            await handleStorePrediction(values)
                        }}
                    >
                        {({ handleChange, setFieldValue, handleSubmit, values, errors }) => (
                            <View className='flex-1 justify-between'>
                                {/* Mcq */}
                                {
                                    qnas[page].group == 'mcq' &&
                                    <Mcq
                                        question={qnas[page].question}
                                        answers={qnas[page].answers}
                                        value={values[qnas[page].key as keyof prediction]}
                                        onChange={(value) => setFieldValue(qnas[page].key as keyof prediction, value)}
                                    />
                                }
                                {/* BMI */}
                                {
                                    qnas[page].group == 'bmi' &&
                                    <View>
                                        <Text style={bmiStyles.question}>{qnas[page].question}</Text>
                                        <View className='flex flex-row gap-4 mb-4'>
                                            <View className='flex-1'>
                                                <StyledCustomTextInput label='Berat badan (Kg)' value={String(values.weight)} onChangeText={handleChange('weight')} keyboardType='numeric' />
                                            </View>
                                            <View className='flex-1'>
                                                <StyledCustomTextInput label='Tinggi badan (Cm)' value={String(values.height)} onChangeText={handleChange('height')} keyboardType='numeric' />
                                            </View>
                                        </View>
                                        <StyledCustomButton title='Calculate' size='lg' onPress={() => {
                                            const bmi = handleCalculateBMI(values.weight, values.height)
                                            setFieldValue('bmi', String(bmi))
                                        }} style={'mb-4'} />
                                        <View style={bmiStyles.result}>
                                            <View>
                                                <Text style={{ textAlign: 'center', fontSize: FontSize.md, fontFamily: FontFamily.medium }}>
                                                    Hasil BMI
                                                </Text>
                                                <Text style={{ textAlign: 'center', fontSize: 32, fontFamily: FontFamily.heavy, color: Colors.light.primary }}>
                                                    {String(values.bmi)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                }
                                {/* Diabetes pedigree */}
                                {
                                    qnas[page].group == 'diabetes_pedigree' &&
                                    <DiabetesPedigree
                                        question={qnas[page].question}
                                        value={values[qnas[page].key as keyof prediction]}
                                        onChange={(value) => setFieldValue(qnas[page].key as keyof prediction, value)}
                                    />
                                }
                                <View className={`flex flex-row ${isFirstPage ? 'justify-end' : 'justify-between'}`}>
                                    {!isFirstPage && <TouchableOpacity
                                        style={styles.nextButton}
                                        onPress={handlePreviousPage}
                                    >
                                        <Ionicons name="arrow-back" color='#ffffff' size={24} className='text-center' />
                                    </TouchableOpacity>}
                                    {!isLastPage ?
                                        <TouchableOpacity
                                            style={styles.nextButton}
                                            onPress={handleNextPage}
                                            disabled={values[qnas[page].key as keyof prediction] == -1 ||
                                                (qnas[page].group == 'bmi' && values[qnas[page].key as keyof prediction] == 0) ? true : false}
                                        >
                                            <Ionicons name="arrow-forward" color='#ffffff' size={24} className='text-center' />
                                        </TouchableOpacity> :
                                        <CustomButton title='Submit' onPress={handleSubmit as (e?: GestureResponderEvent) => void} loading={predictionLoading} />
                                    }
                                </View>
                            </View>
                        )}
                    </Formik>
                }
                {
                    result == 0 &&
                    <>
                        <Image
                            source={require('@/assets/images/prediction/Vector3.png')}
                            className='absolute'
                        />
                        <View className='flex-1 justify-between gap-4'>
                            <View className='flex-1 justify-center items-center'>
                                <Image
                                    source={require('@/assets/images/characters/indikasi-terkena-1.png')}
                                    style={{
                                        width: 242,
                                        height: 264,
                                    }}
                                />
                                <Text style={{ fontSize: FontSize.md }}>Hasil prediksi menyatakan</Text>
                                <Text style={{ fontSize: FontSize.xl, color: Colors.light.primary, fontFamily: FontFamily.heavy }}>TIDAK TERINDIKASI DIABETES</Text>
                            </View>
                            <CustomButton title='Lanjutkan' size='lg' onPress={() => router.navigate('/(tabs)')} />
                            <CustomButton title='Ulangi hasil tes' size='lg' type='outline' onPress={handleReset} />
                        </View>
                    </>
                }
                {
                    result == 1 &&
                    <>
                        <Image
                            source={require('@/assets/images/prediction/Vector3.png')}
                            className='absolute'
                        />
                        <View className='flex-1 justify-between gap-4'>
                            <View className='flex-1 justify-center items-center'>
                                <Image
                                    source={require('@/assets/images/characters/indikasi-tidak-1.png')}
                                    style={{
                                        width: 242,
                                        height: 264,
                                    }}
                                />
                                <Text style={{ fontSize: FontSize.md }}>Hasil prediksi menyatakan</Text>
                                <Text style={{ fontSize: FontSize.xl, color: Colors.light.primary, fontFamily: FontFamily.heavy }}>TERINDIKASI DIABETES</Text>
                            </View>
                            <CustomButton title='Lanjutkan' size='lg' onPress={() => router.navigate('/(tabs)')} />
                            <CustomButton title='Ulangi hasil tes' size='lg' type='outline' onPress={handleReset} />
                        </View>
                    </>
                }

            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    nextButton: {
        width: 55,
        height: 40,
        backgroundColor: '#DA6E35',
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'center',
    },
})

const bmiStyles = StyleSheet.create({
    question: {
        fontSize: FontSize.xl,
        fontFamily: FontFamily.heavy,
        marginBottom: 36,
    },
    result: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.light.primary,
        borderRadius: 12,
        paddingVertical: 20,
    }
})