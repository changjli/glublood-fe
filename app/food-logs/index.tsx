import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { FontSize, FontFamily } from '@/constants/Typography';
import DailyCaloriesInput from './DailyCaloriesInput';
import { Link, router, useNavigation } from 'expo-router';
import useFoodLog from '@/hooks/api/food_log/useFoodLog';
import axios, { AxiosError } from 'axios';
import { string } from 'yup';
import FoodLogList from './FoodLogList';
import useDailyCalories from '@/hooks/api/daily_calories/useDailyCalories';
import ProgressBar from './ProgressBar';
import useAsyncStorage from '@/hooks/useAsyncStorage';
import { useIsFocused } from '@react-navigation/native';
import Wrapper from '@/components/Layout/Wrapper'
import DynamicTextComponent from '@/components/DynamicText';
import { formatDatetoString } from '@/utils/formatDatetoString';
import CustomCalendar from '@/components/CustomCalendar';
import CustomText from '@/components/CustomText';

export default function Foods() {

    const { getFoodLogByDate } = useFoodLog()
    const { getDailyCaloriesByDate } = useDailyCalories()
    const { storeData } = useAsyncStorage()
    const isFocused = useIsFocused()

    const [foodLogLoading, setFoodLogLoading] = useState(false)
    const [dailyCaloriesLoading, setDailyCaloriesLoading] = useState(false)

    const [modalVisible, setModalVisible] = useState(false)

    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [dailyCalories, setDailyCalories] = useState<GetDailyCaloriesResponse | null>(null)
    const [foodLogs, setFoodLogs] = useState<GetFoodLogResponse[]>([])

    const handleGetDailyCalories = async (date: string) => {
        try {
            const res = await getDailyCaloriesByDate(setDailyCaloriesLoading, date)
            const data: GetDailyCaloriesResponse = res.data
            setDailyCalories(data)
        } catch (err) {
            setDailyCalories(null)
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

    const handleGetFoodLog = async (date: string) => {
        try {
            const res = await getFoodLogByDate(setFoodLogLoading, date)
            const data: GetFoodLogResponse[] = res.data
            setFoodLogs(data)
        } catch (err) {
            setFoodLogs([])
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

    const handleNavigate = async () => {
        await storeData('foodLogDate', formatDatetoString(selectedDate))
        router.navigate('/food-logs/search')
    }

    useEffect(() => {
        if (isFocused) {
            console.log("selected date", selectedDate)
            handleGetDailyCalories(formatDatetoString(selectedDate))
            handleGetFoodLog(formatDatetoString(selectedDate))
        }
    }, [selectedDate, isFocused])

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <DynamicTextComponent text='Nutrisi' img='tes' />
            <Wrapper style={{ backgroundColor: 'white', marginBottom: 20 }}>
                <View style={{ marginTop: 10, marginBottom: 20 }}>
                    <CustomCalendar
                        value={selectedDate}
                        onChange={setSelectedDate}
                    />
                </View>
                <DailyCaloriesInput
                    selectedDate={selectedDate}
                    dailyCalories={dailyCalories}
                    fetchDailyCalories={() => handleGetDailyCalories(formatDatetoString(selectedDate))}
                />
            </Wrapper>
            <View style={styles.logContainer}>
                <View style={styles.logHeaderContainer}>
                    <Text style={styles.logHeaderText}>Detail log nutrisi</Text>
                    <TouchableOpacity onPress={handleNavigate} style={styles.logHeaderIcon}>
                        <FontAwesome name='plus' />
                    </TouchableOpacity>
                </View>
                {foodLogs.length > 0 ? (
                    <View style={{ width: '100%' }}>
                        <FoodLogList data={foodLogs} />
                    </View>
                ) : (
                    <View style={styles.notFoundContainer}>
                        <Image source={require('@/assets/images/characters/not-found.png')} />
                        <CustomText style={{ textAlign: 'center', color: Colors.light.gray400 }}>Belum ada nutrisi yang kamu tambahkan</CustomText>
                    </View>

                )}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    logContainer: {
        width: '100%',
        padding: 16,
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        alignItems: 'center',
        flex: 1,
        elevation: 5,
    },
    logHeaderContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logHeaderText: {
        fontSize: FontSize.lg,
        fontFamily: FontFamily.heavy,
    },
    logHeaderIcon: {
        color: 'white',
        fontSize: FontSize.md,
        backgroundColor: Colors.light.primary,
        padding: 8,
        borderRadius: 4,
    },
    foodLogContainer: {
        borderWidth: 1,
        borderColor: Colors.light.primary,
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    foodLogHeaderText: {
        fontSize: FontSize.md,
        color: Colors.light.primary,
        fontFamily: FontFamily.heavy,
    },
    foodLogBodyText: {
        fontSize: FontSize.sm,
        color: Colors.light.primary,
    },
    notFoundContainer: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        gap: 8,
    }
})