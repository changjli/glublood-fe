import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { FontSize, FontFamily } from '@/constants/Typography';
import { Link, router, useNavigation } from 'expo-router';
import useFoodLog from '@/hooks/api/food_log/useFoodLog';
import axios, { AxiosError } from 'axios';
import { string } from 'yup';
import useDailyCalories from '@/hooks/api/daily_calories/useDailyCalories';
import useAsyncStorage from '@/hooks/useAsyncStorage';
import { useIsFocused } from '@react-navigation/native';
import Wrapper from '@/components/Layout/Wrapper'
import DynamicTextComponent from '@/components/DynamicText';
import { formatDatetoStringYmd } from '@/utils/formatDatetoString';
import CustomCalendar from '@/components/CustomCalendar';
import CustomText from '@/components/CustomText';
import DailyCaloriesInput from '@/app/logs/food/DailyCaloriesInput';
import FoodLogList from '@/components/FoodLogList';
import { useCustomAlert } from '@/app/context/CustomAlertProvider';

export default function FoodLogPage() {

    const { getFoodLogByDate } = useFoodLog()
    const { getDailyCaloriesByDate } = useDailyCalories()
    const { storeData } = useAsyncStorage()
    const isFocused = useIsFocused()
    const { showAlert } = useCustomAlert()

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

    const handleNavigate = async () => {
        if (dailyCalories && Number(dailyCalories.consumed_calories) > Number(dailyCalories.target_calories)) {
            showAlert('Kamu sudah melebihi kalori harian!', 'warning')
            return
        }
        await storeData('foodLogDate', formatDatetoStringYmd(selectedDate))
        router.navigate('/logs/food/search')
    }

    useEffect(() => {
        if (isFocused) {
            console.log("selected date", selectedDate)
            handleGetDailyCalories(formatDatetoStringYmd(selectedDate))
            handleGetFoodLog(formatDatetoStringYmd(selectedDate))
        }
    }, [selectedDate, isFocused])

    return (
        <>
            <CustomCalendar
                value={selectedDate}
                onChange={setSelectedDate}
            />
            <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
                <DailyCaloriesInput
                    selectedDate={selectedDate}
                    dailyCalories={dailyCalories}
                    loading={dailyCaloriesLoading}
                    fetchDailyCalories={() => handleGetDailyCalories(formatDatetoStringYmd(selectedDate))}
                />
            </View>
            <View style={styles.logContainer}>
                <View style={styles.logHeaderContainer}>
                    <Text style={styles.logHeaderText}>Detail log nutrisi</Text>
                    <TouchableOpacity onPress={handleNavigate} style={styles.logHeaderIcon}>
                        <FontAwesome name='plus' size={16} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={{ width: '100%' }}>
                    <FoodLogList data={foodLogs} loading={foodLogLoading} />
                </View>
            </View>
        </>
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
        padding: 8,
        width: 30,
        height: 30,
        backgroundColor: '#DA6E35',
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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