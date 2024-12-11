import { View, Text, Keyboard, TouchableWithoutFeedback, StyleSheet, TouchableOpacity, Pressable, GestureResponderEvent, Alert, Image, ScrollView, useWindowDimensions, LayoutChangeEvent } from 'react-native'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { FontSize, FontFamily } from '@/constants/Typography'
import CustomButton, { CustomButtonProps, StyledCustomButton } from '@/components/CustomButton'
import { Ionicons } from '@expo/vector-icons'
import { Formik } from 'formik'
import CustomTextInput, { StyledCustomTextInput } from '@/components/CustomInput/CustomTextInput'
import { Colors } from '@/constants/Colors'
import usePrediction from '@/hooks/api/prediction/usePrediction'
import { predictionRequest, predictionResponse } from '@/hooks/api/prediction/predictionTypes'
import { useSession } from '@/app/context/AuthenticationProvider'
import { router } from 'expo-router'
import CustomProgressBar from '@/components/CustomProgressBar'
import Wrapper from '@/components/Layout/Wrapper'
import CustomText from '@/components/CustomText'
import { FlexStyles } from '@/constants/Flex'
import Mcq from '@/components/Mcq'
import DiabetesPedigree from '@/components/DiabetesPedigree'
import Loader from '@/components/Loader'
import { useUserProfile } from '@/hooks/useUserProfile'
import CustomHeader from '@/components/CustomHeader'

export type Prediction = {
    "high_bp": number,
    "high_chol": number,
    "chol_check": number,
    "bmi": number,
    "smoker": number,
    "stroke": number,
    "heart_disease": number,
    "phys_activity": number,
    "fruits": number,
    "veggies": number,
    "hvy_alcohol": number,
    "any_healthcare": number,
    "no_doc": number,
    "gen_health": number,
    "mental_health": number,
    "phys_health": number,
    "diff_walk": number,
    "sex": number,
    "age": number
}

export default function PredictionPage() {
    const { session } = useSession()
    const { doPrediction, storePrediction } = usePrediction()
    const { profile } = useUserProfile()

    // Initialize questions 
    // refactor: bisa dipindahin 
    const qnas = [
        {
            group: 'yes_no',
            key: 'high_bp',
            question: 'Apakah Anda memiliki Tekanan Darah Tinggi?',
            description: 'Jika tidak ada riwayat darah tinggi, maka pilih tidak',
            answers: []
        }, {
            group: 'yes_no',
            key: 'high_chol',
            question: 'Apakah Anda memiliki angka kolesterol tinggi?',
            description: 'Jika tidak ada riwayat kolesterol, maka pilih tidak',
            answers: []
        }, {
            group: 'yes_no',
            key: 'chol_check',
            question: 'Apakah Anda pernah melakukan pengecekkan kolesterol?',
            description: 'Pengecekkan dilakukan dalam 5 tahun terakhir',
            answers: []
        }, {
            group: 'bmi',
            key: 'bmi',
            description: '',
            question: 'Kalkulator Body Mass Index (BMI)',
            answers: [],
        }, {
            group: 'yes_no',
            key: 'smoker',
            question: 'Apakah Anda seorang perokok?',
            description: 'Pilih ya, jika Anda menghabiskan 100 puntung selama ini',
            answers: []
        }, {
            group: 'yes_no',
            key: 'stroke',
            question: 'Pernahkah Anda mengalami penyakit stroke?',
            description: '',
            answers: []
        }, {
            group: 'yes_no',
            key: 'heart_disease',
            question: 'Pernahkah Anda mengalami penyakit pada bagian jantung?',
            description: '',
            answers: []
        }, {
            group: 'yes_no',
            key: 'phys_activity',
            question: 'Dalam 30 hari belakangan, apakah Anda melakukan aktivitas fisik?',
            description: 'Pekerjaan kantor tidak termasuk',
            answers: []
        }, {
            group: 'yes_no',
            key: 'fruits',
            question: 'Apakah Anda mengonsumsi buah-buahan minimal satu atau lebih per hari?',
            description: '',
            answers: []
        }, {
            group: 'yes_no',
            key: 'veggies',
            question: 'Apakah Anda mengonsumsi sayuran minimal satu atau lebih per hari?',
            description: '',
            answers: []
        }, {
            group: 'yes_no',
            key: 'hvy_alcohol',
            question: 'Apakah Anda sering minum-minuman alkohol?',
            description: 'Kategori peminum jika lebih dari 14 botol per minggu untuk pria dan 7 botol per minggu untuk wanita',
            answers: []
        }, {
            group: 'yes_no',
            key: 'any_healthcare',
            question: 'Apakah Anda memiliki semacam asuransi kesehatan?',
            description: '',
            answers: []
        }, {
            group: 'yes_no',
            key: 'no_doc',
            question: 'Apakah Anda merasa ingin bertemu dengan dokter dalam 12 bulan ini, tetapi tidak memiliki uang?',
            description: '',
            answers: []
        }, {
            group: 'mcq',
            key: 'gen_health',
            question: 'Bagaimana Anda merasakan kesehatan Anda secara umum?',
            description: '',
            answers: [
                {
                    label: 'Sangat Sehat',
                    value: 25,
                }, {
                    label: 'Sehat',
                    value: 75,
                }, {
                    label: 'Biasa Saja',
                    value: 125,
                }, {
                    label: 'Kurang Sehat',
                    value: 175,
                }, {
                    label: 'Tidak Sehat',
                    value: 200,
                }
            ]
        }, {
            group: 'mcq',
            key: 'mental_health',
            question: 'Bagaimana Anda merasakan kesehatan mental Anda?',
            description: '',
            answers: [
                {
                    label: 'Sangat Sehat',
                    value: 25,
                }, {
                    label: 'Sehat',
                    value: 75,
                }, {
                    label: 'Biasa Saja',
                    value: 125,
                }, {
                    label: 'Kurang Sehat',
                    value: 175,
                }, {
                    label: 'Tidak Sehat',
                    value: 200,
                }
            ]
        }, {
            group: 'mcq',
            key: 'phys_health',
            question: 'Bagaimana Anda merasakan penyembuhan luka fisik Anda?',
            description: '',
            answers: [
                {
                    label: 'Sangat Cepat',
                    value: 25,
                }, {
                    label: 'Cepat',
                    value: 75,
                }, {
                    label: 'Biasa Saja',
                    value: 125,
                }, {
                    label: 'Kurang Cepat',
                    value: 175,
                }, {
                    label: 'Lambat',
                    value: 200,
                }
            ]
        }, {
            group: 'yes_no',
            key: 'diff_walk',
            question: 'Apakah Anda merasa kesulitan ketika naik tangga atau berjalan',
            description: '',
            answers: []
        },]

    const [page, setPage] = useState(0)
    const [predictionLoading, setPredictionLoading] = useState(false)
    const [result, setResult] = useState(-1)
    const [headerHeight, setHeaderHeight] = useState(0)
    const formRef = useRef<Prediction | null>(null)

    const handleNextPage = () => setPage(page + 1)
    const handlePreviousPage = () => setPage(page - 1)
    const isFirstPage = page == 0
    const isLastPage = page == qnas.length - 1

    const handleCalculateBMI = (weight: number, height: number) => {
        return height > 0 ? Math.round(Number(weight) / Math.pow(Number(height) / 100, 2) * 100) / 100 : 0
    }

    const handlePredict = async (data: Prediction) => {
        try {
            const res = await doPrediction(setPredictionLoading, data)
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

    const handleStorePrediction = async (data: Prediction) => {
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
        formRef.current = null
        setPage(0)
        setResult(-1)
    }

    return (
        <>
            {<Loader visible={predictionLoading} />}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <>
                    {
                        result == -1 &&
                        <>
                            <CustomProgressBar current={page + 1} total={qnas.length} />
                            <Formik<Prediction>
                                initialValues={{
                                    "high_bp": -1,
                                    "high_chol": -1,
                                    "chol_check": -1,
                                    "bmi": 0,
                                    "smoker": -1,
                                    "stroke": -1,
                                    "heart_disease": -1,
                                    "phys_activity": -1,
                                    "fruits": -1,
                                    "veggies": -1,
                                    "hvy_alcohol": -1,
                                    "any_healthcare": -1,
                                    "no_doc": -1,
                                    "gen_health": -1,
                                    "mental_health": -1,
                                    "phys_health": -1,
                                    "diff_walk": -1,
                                    "sex": 0,
                                    "age": 21
                                }}
                                onSubmit={async (values) => {
                                    formRef.current = values
                                    await handlePredict(values)
                                }}
                            >
                                {({ handleChange, setFieldValue, handleSubmit, values, errors }) => (
                                    <Wrapper style={{
                                        flex: 1,
                                        backgroundColor: 'white',
                                        justifyContent: 'space-between'
                                    }}>
                                        {/* Mcq */}
                                        {
                                            qnas[page].group == 'mcq' &&
                                            <Mcq
                                                question={qnas[page].question}
                                                description={qnas[page].description}
                                                answers={qnas[page].answers}
                                                value={values[qnas[page].key as keyof Prediction]}
                                                onChange={(value) => setFieldValue(qnas[page].key as keyof Prediction, value)}
                                            />
                                        }
                                        {/* BMI */}
                                        {
                                            qnas[page].group == 'bmi' &&
                                            <View>
                                                <Text style={bmiStyles.question}>{qnas[page].question}</Text>
                                                <View className='flex flex-row gap-4 mb-4'>
                                                    <View className='flex-1'>
                                                        <StyledCustomTextInput label='Berat badan (Kg)' value={profile?.weight} onChangeText={handleChange('weight')} keyboardType='numeric' />
                                                    </View>
                                                    <View className='flex-1'>
                                                        <StyledCustomTextInput label='Tinggi badan (Cm)' value={profile?.height} onChangeText={handleChange('height')} keyboardType='numeric' />
                                                    </View>
                                                </View>
                                                <StyledCustomButton title='Calculate' size='lg' onPress={() => {
                                                    const bmi = handleCalculateBMI(Number(profile?.weight), Number(profile?.height))
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
                                        {/* Yes No */}
                                        {
                                            qnas[page].group == 'yes_no' &&
                                            <DiabetesPedigree
                                                question={qnas[page].question}
                                                value={values[qnas[page].key as keyof Prediction]}
                                                description={qnas[page].description}
                                                onChange={(value) => setFieldValue(qnas[page].key as keyof Prediction, value)}
                                            />
                                        }
                                        {/* Button */}
                                        <View className={`flex flex-row ${isFirstPage ? 'justify-end' : 'justify-between'}`}>
                                            {!isFirstPage && (
                                                <TouchableOpacity
                                                    style={styles.nextButton}
                                                    onPress={handlePreviousPage}
                                                >
                                                    <Ionicons name="arrow-back" color='#ffffff' size={24} className='text-center' />
                                                </TouchableOpacity>
                                            )}
                                            {!isLastPage ?
                                                <TouchableOpacity
                                                    style={[
                                                        styles.nextButton,
                                                        (qnas[page].group == 'bmi' ? values['bmi'] == 0 : values[qnas[page].key as keyof Prediction] == -1) && styles.disabledNextButton
                                                    ]}
                                                    onPress={handleNextPage}
                                                    disabled={qnas[page].group == 'bmi' ? values['bmi'] == 0 : values[qnas[page].key as keyof Prediction] == -1}
                                                >
                                                    <Ionicons name="arrow-forward" color='#ffffff' size={24} className='text-center' />
                                                </TouchableOpacity> :
                                                <TouchableOpacity onPress={handleSubmit as (e?: GestureResponderEvent) => void} style={styles.submitButton} >
                                                    <CustomText size='md' weight='heavy' style={{ color: 'white' }}>Submit</CustomText>
                                                </TouchableOpacity>
                                            }
                                        </View>
                                    </Wrapper>
                                )}
                            </Formik>
                        </>
                    }
                    {
                        result == 0 &&
                        <Wrapper style={{ flex: 1, backgroundColor: "white", justifyContent: 'space-between' }}>
                            {/* <Image
                                source={require('@/assets/images/prediction/Vector3.png')}
                                className='absolute'
                            /> */}
                            <View style={styles.resultInnerContainer}>
                                <Image
                                    source={require('@/assets/images/characters/indikasi-terkena-1.png')}
                                    style={{
                                        width: 242,
                                        height: 264,
                                        marginBottom: 4,
                                    }}
                                />
                                <CustomText style={{ textAlign: 'center' }}>Hasil prediksi menyatakan</CustomText>
                                <CustomText size='xl' weight='heavy' style={{ color: Colors.light.primary, textAlign: 'center' }}>TIDAK TERINDIKASI DIABETES</CustomText>
                            </View>
                            <View style={styles.resultButtonContainer}>
                                <CustomButton title='Lanjutkan' size='md' onPress={async () => {
                                    if (formRef.current) {
                                        await handleStorePrediction(formRef.current)
                                        router.navigate('/(tabs)')
                                    }
                                }} />
                                <CustomButton title='Ulangi hasil tes' size='md' type='outline' onPress={handleReset} />
                            </View>
                        </Wrapper>
                    }
                    {
                        result == 1 &&
                        <Wrapper style={styles.resultContainer}>
                            {/* <Image
                                source={require('@/assets/images/prediction/Vector3.png')}
                                className='absolute'
                            /> */}
                            <View style={styles.resultInnerContainer}>
                                <Image
                                    source={require('@/assets/images/characters/indikasi-tidak-1.png')}
                                    style={{
                                        width: 260,
                                        height: 264,
                                        marginBottom: 4,
                                    }}
                                />
                                <CustomText style={{ textAlign: 'center' }}>Hasil prediksi menyatakan</CustomText>
                                <CustomText size='xl' weight='heavy' style={{ color: Colors.light.primary, textAlign: 'center' }}>TERINDIKASI DIABETES</CustomText>
                            </View>
                            <View style={styles.resultButtonContainer}>
                                <CustomButton title='Lanjutkan' size='md' onPress={async () => {
                                    if (formRef.current) {
                                        await handleStorePrediction(formRef.current)
                                        router.navigate('/(tabs)')
                                    }
                                }} />
                                <CustomButton title='Ulangi hasil tes' size='md' type='outline' onPress={handleReset} />
                            </View>
                        </Wrapper>
                    }
                </>
            </TouchableWithoutFeedback>
        </>
    )
}

const styles = StyleSheet.create({
    nextButton: {
        width: 55,
        height: 40,
        backgroundColor: Colors.light.primary,
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 8,
    },
    submitButton: {
        paddingHorizontal: 8,
        height: 40,
        backgroundColor: Colors.light.primary,
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 8,
    },
    disabledNextButton: {
        backgroundColor: Colors.light.gray300
    },
    resultContainer: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: 'space-between'
    },
    resultInnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    resultButtonContainer: {
        marginBottom: 16,
        gap: 8
    }
})

const bmiStyles = StyleSheet.create({
    question: {
        fontSize: FontSize.xl,
        fontFamily: FontFamily.heavy,
        marginBottom: 16,
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