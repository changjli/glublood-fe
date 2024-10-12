import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomTimePicker from '../CustomTimePicker';
import CustomCalendar from '../CustomCalendar';
import { Colors } from '@/constants/Colors';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { FontSize, FontFamily } from '@/constants/Typography';
import DailyCaloriesInput from './DailyCaloriesInput';
import { Link, router } from 'expo-router';
import useFoodLog from '@/hooks/api/food_log/useFoodLog';
import axios, { AxiosError } from 'axios';
import { string } from 'yup';
import FoodLogList from './FoodLogList';
import useDailyCalories from '@/hooks/api/daily_calories/useDailyCalories';
import ProgressBar from './ProgressBar';
import useAsyncStorage from '@/hooks/useAsyncStorage';
import formatDatetoString from '@/utils/formatDatetoString';
import { useIsFocused } from '@react-navigation/native';

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
        router.navigate('/(notes)/food-logs/search')
    }

    useEffect(() => {
        if (isFocused) {
            console.log("selected date", selectedDate)
            handleGetDailyCalories(formatDatetoString(selectedDate))
            handleGetFoodLog(formatDatetoString(selectedDate))
        }
    }, [selectedDate, isFocused])

    return (
        <>
            <View style={{ padding: 16 }}>
                <CustomCalendar
                    value={selectedDate}
                    onChange={setSelectedDate}
                />
                <DailyCaloriesInput
                    selectedDate={selectedDate}
                />
            </View >
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
                    <View style={{ flex: 1, width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                        <Image source={require('@/assets/images/characters/not-found.png')} />
                    </View>

                )}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    dailyContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.light.primary,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 16,
    },
    dailyHeader: {
        fontFamily: FontFamily.heavy,
        fontSize: FontSize.md,
    },
    logContainer: {
        width: '100%',
        padding: 16,
        backgroundColor: '#FFF8E1',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        alignItems: 'center',
        flex: 1,
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
    }
})