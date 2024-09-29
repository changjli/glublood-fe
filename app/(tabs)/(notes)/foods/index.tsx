import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomTimePicker from '../CustomTimePicker';
import CustomCalendar from '../CustomCalendar';
import { Colors } from '@/constants/Colors';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Size, Weight } from '@/constants/Typography';
import DailyCaloriesInput from './DailyCaloriesInput';
import { Link } from 'expo-router';
import useFoodLog from '@/hooks/api/food_log/useFoodLog';
import axios, { AxiosError } from 'axios';
import { string } from 'yup';
import FoodLogList from './FoodLogList';
import useDailyCalories from '@/hooks/api/daily_calories/useDailyCalories';

export default function Foods() {
    const { getFoodLogByDate } = useFoodLog()
    const { getDailyCaloriesByDate } = useDailyCalories()

    const [selectedDate, setSelectedDate] = useState<Date>(new Date())

    const [modalVisible, setModalVisible] = useState(false)

    const [foodLogLoading, setFoodLogLoading] = useState(false)

    const [foodLogs, setFoodLogs] = useState<GetFoodLogResponse[]>([])

    const handleGetFoodLog = async (date: string) => {
        try {
            const res = await getFoodLogByDate(setFoodLogLoading, date)
            const data: GetFoodLogResponse[] = res.data
            setFoodLogs(data)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                // Log detailed Axios error information
                console.log('Axios Error:', err.message);
                console.log('Error Response Data:', err.response?.data);

                // Handle different status codes (e.g., 400, 401, 404, 500)
                if (status === 400) {
                    Alert.alert('Bad Request', 'Invalid request. Please check your input.');
                } else if (status === 401) {
                    Alert.alert('Unauthorized', 'You are not authorized to perform this action.');
                } else if (status === 404) {
                    Alert.alert('Not Found', 'Requested resource not found.');
                } else if (status === 500) {
                    Alert.alert('Server Error', 'A server error occurred. Please try again later.');
                } else {
                    // Fallback for any other status codes
                    Alert.alert('Error', `An error occurred: ${status}. Please try again later.`);
                }
            } else {
                // Handle non-Axios errors (e.g., network issues)
                console.log('Unexpected Error:', err);
                Alert.alert('Network Error', 'Please check your internet connection.');
            }
        }
    }

    useEffect(() => {
        handleGetFoodLog("08/09/2024")
    }, [])

    useEffect(() => {
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const year = selectedDate.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        console.log(formattedDate)

        handleGetFoodLog(formattedDate)
    }, [selectedDate])

    return (
        <>
            <DailyCaloriesInput
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            />
            <View style={{ padding: 16 }}>
                <CustomCalendar value={selectedDate} onChange={setSelectedDate} />
                <View style={styles.dailyContainer}>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <View className='flex flex-row justify-between items-center mb-4'>
                            <Text style={styles.dailyHeader}>Kalori Harian Anda</Text>
                            <Ionicons name='chevron-forward-outline' style={styles.dailyHeader} />
                        </View>
                    </TouchableOpacity>
                    <View className='flex flex-col items-center'>
                        <Image source={require('@/assets/images/characters/body-blood.png')} />
                        <Text>Belum ada target kalori anda</Text>
                    </View>
                </View>
            </View>
            <View style={styles.logContainer}>
                <View style={styles.logHeaderContainer}>
                    <Text style={styles.logHeaderText}>Detail log nutrisi</Text>
                    <Link href='/(notes)/foods/create' style={styles.logHeaderIcon}>
                        <FontAwesome name='plus' />
                    </Link>
                </View>
                {/* <Image source={require('@/assets/images/characters/not-found.png')} /> */}
                <View className='w-full'>
                    <FoodLogList data={foodLogs} />
                </View>
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
        fontFamily: Weight.heavy,
        fontSize: Size.md,
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
        fontSize: Size.lg,
        fontFamily: Weight.heavy,
    },
    logHeaderIcon: {
        color: 'white',
        fontSize: Size.md,
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
        fontSize: Size.md,
        color: Colors.light.primary,
        fontFamily: Weight.heavy,
    },
    foodLogBodyText: {
        fontSize: Size.sm,
        color: Colors.light.primary,
    }
})