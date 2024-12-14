import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { FontSize, FontFamily } from '@/constants/Typography';
import { Link, router } from 'expo-router';
import useFoodLog from '@/hooks/api/food_log/useFoodLog';
import axios, { AxiosError } from 'axios';
import { string } from 'yup';
import useDailyCalories from '@/hooks/api/daily_calories/useDailyCalories';
import useAsyncStorage from '@/hooks/useAsyncStorage';
import { useIsFocused } from '@react-navigation/native';
import useExerciseLog from '@/hooks/api/logs/exercise/useExerciseLog';
import DynamicTextComponent from '@/components/DynamicText';
import Wrapper from '@/components/Layout/Wrapper'
import { formatDatetoStringYmd } from '@/utils/formatDatetoString';
import CustomCalendar from '@/components/CustomCalendar';
import ExerciseLogList from '@/components/ExerciseLogList';
import { useCustomAlert } from '@/app/context/CustomAlertProvider';

export default function ExerciseLogPage() {
    const { getExerciseLogByDate } = useExerciseLog()
    const { getDailyCaloriesByDate } = useDailyCalories()
    const { storeData } = useAsyncStorage()
    const isFocused = useIsFocused()
    const { showAlert } = useCustomAlert()

    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [exerciseLogs, setExerciseLogs] = useState<GetExerciseLogRes[]>([])

    const [getExerciseLogLoading, setGetExerciseLogLoading] = useState(false)

    const handleGetExerciseLog = async (date: string) => {
        try {
            const res = await getExerciseLogByDate(setGetExerciseLogLoading, date)
            const data: GetExerciseLogRes[] = res.data
            setExerciseLogs(data)
        } catch (err) {
            setExerciseLogs([])
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
        await storeData('foodLogDate', formatDatetoStringYmd(selectedDate))
        router.navigate('/logs/exercise/create')
    }

    useEffect(() => {
        if (isFocused) {
            console.log("selected date", selectedDate)
            handleGetExerciseLog(formatDatetoStringYmd(selectedDate))
        }
    }, [selectedDate, isFocused])

    return (
        <>
            <CustomCalendar
                value={selectedDate}
                onChange={setSelectedDate}
            />
            <View style={styles.logContainer}>
                <View style={styles.logHeaderContainer}>
                    <Text style={styles.logHeaderText}>Detail log olahraga</Text>
                    <TouchableOpacity onPress={handleNavigate} style={styles.logHeaderIcon}>
                        <FontAwesome name='plus' size={16} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={{ width: '100%' }}>
                    <ExerciseLogList
                        data={exerciseLogs}
                        loading={getExerciseLogLoading}
                    />
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