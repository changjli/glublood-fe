import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import DynamicTextComponent from '../../../../components/DynamicText';
import { Link, router } from 'expo-router';
import useGlucose from '@/hooks/api/logs/glucose/useGlucoseLog';
import axios from 'axios'
import { useIsFocused } from '@react-navigation/native';
import useAsyncStorage from '@/hooks/useAsyncStorage';
import { formatDatetoStringYmd } from '@/utils/formatDatetoString';
import GlucoseLogList from '@/components/GlucoseLogList';
import CustomCalendar from '@/components/CustomCalendar';
import Wrapper from '@/components/Layout/Wrapper';
import { FontFamily, FontSize } from '@/constants/Typography';
import CustomText from '@/components/CustomText';
import { Colors } from '@/constants/Colors';
import { GlucoseLogNewEntryNotification } from '@/app/ble';
import { useGlucoseNewEntriesNotification } from '@/hooks/useGlucoseNewEntriesNotification';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useCustomAlert } from '@/app/context/CustomAlertProvider';

export default function GlucoseLogPage() {
    const { getGlucoseLogByDate } = useGlucose()
    const { storeData } = useAsyncStorage()
    const [glucoseLogLoading, setGlucoseLogLoading] = useState(false)
    const [glucoseLog, setGlucoseLog] = useState<GetGlucoseLogRes[]>([])
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const isFocused = useIsFocused()
    const { getNotifications, notifications, getNotificationByDate, deleteNotificationByDate } = useGlucoseNewEntriesNotification()
    const { profile } = useUserProfile()
    const { showAlert } = useCustomAlert()

    const handleGetGlucoseLog = async (date: string) => {
        try {
            const res = await getGlucoseLogByDate(setGlucoseLogLoading, date)
            setGlucoseLog(res.data)
            console.log("[index] -> Glucose Log by Date", res.data)
        } catch (err) {
            setGlucoseLog([])
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
        await storeData('glucoseLogDate', formatDatetoStringYmd(selectedDate))
        router.navigate('/logs/glucose/create')
    }

    useEffect(() => {
        getNotifications()
    }, [])

    useEffect(() => {
        if (isFocused) {
            handleGetGlucoseLog(formatDatetoStringYmd(selectedDate))
        }
    }, [selectedDate, isFocused])

    return (
        <>
            <CustomCalendar
                value={selectedDate}
                onChange={setSelectedDate}
                notifications={notifications}
                getNotificationByDate={getNotificationByDate}
                deleteNotificationByDate={deleteNotificationByDate}
            />
            <View style={styles.logContainer}>
                <View style={styles.logHeaderContainer}>
                    <Text style={styles.logHeaderText}>Detail Log Gula Darah</Text>
                    <TouchableOpacity style={styles.headerAddButton} onPress={handleNavigate}>
                        <FontAwesome name='plus' size={16} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={{ width: '100%' }}>
                    <GlucoseLogList
                        data={glucoseLog}
                        loading={glucoseLogLoading}
                        age={profile?.age ?? 0}
                    />
                </View>
            </View>
        </>
    );
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
    headerAddButton: {
        padding: 8,
        width: 30,
        height: 30,
        backgroundColor: '#DA6E35',
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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