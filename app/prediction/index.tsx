import { View, Text, Alert, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomHeader from '@/components/CustomHeader'
import Wrapper from '@/components/Layout/Wrapper'
import usePrediction from '@/hooks/api/prediction/usePrediction'
import axios from 'axios'
import { PredictionResponse } from '@/hooks/api/prediction/predictionTypes'
import CustomText from '@/components/CustomText'
import { FlexStyles } from '@/constants/Flex'
import { formatDateIntl, formatDateStringIntl, formatDatetoStringYmd } from '@/utils/formatDatetoString'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { FontSize } from '@/constants/Typography'
import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'
import CustomButton from '@/components/CustomButton'

export default function PredictionPage() {
    const { getPredictionByUser } = usePrediction()

    const [predictions, setPredictions] = useState<PredictionResponse[]>([])
    const [getPredictionLoading, setGetPredictionLoading] = useState(false)

    const handleGetDailyCalories = async () => {
        try {
            const res = await getPredictionByUser(setGetPredictionLoading)
            setPredictions(res.data)
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

    const resolveDiabetesResult = (result: number) => {
        if (result == 0) {
            return "Terindikasi Diabetes"
        } else {
            return "Terindikasi Non Diabetes"
        }
    }

    useEffect(() => {
        handleGetDailyCalories()
    }, [])

    return (
        <>
            <CustomHeader title='Riwayat Prediksi' />
            <Wrapper>
                <FlatList
                    data={predictions}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            style={[FlexStyles.flexRow, {
                                justifyContent: 'space-between',
                                marginVertical: 4,
                                borderBottomColor: Colors.light.gray300,
                                borderBottomWidth: index == predictions.length - 1 ? 0 : 1,
                            }]}
                            onPress={() => router.push(`/prediction/${item.id}`)}
                        >
                            <CustomText>{resolveDiabetesResult(item.result)}</CustomText>
                            <View style={[FlexStyles.flexRow, { gap: 4 }]}>
                                <CustomText>{formatDateStringIntl(item.created_at)}</CustomText>
                                <Ionicons name='chevron-forward' size={20} color={Colors.light.primary} />
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => String(item.id)}
                />
                <CustomButton title='Ulangi pengambilan tes' style={{ marginBottom: 20 }} onPress={() => router.push('/prediction/predict')} />
            </Wrapper>
        </>
    )
}