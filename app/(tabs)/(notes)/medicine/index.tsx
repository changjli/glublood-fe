import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import useMedicine from '@/hooks/api/logs/medicine/useMedicineLog';
import axios from 'axios'
import { useIsFocused } from '@react-navigation/native';
import { formatDatetoString } from '@/utils/formatDatetoString';
import useAsyncStorage from '@/hooks/useAsyncStorage';
import CustomCalendar from '@/components/CustomCalendar';
import MedicineLogList from '@/app/logs/medicine/MedicineLogList';
import { FontFamily, FontSize } from '@/constants/Typography';
import Wrapper from '@/components/Layout/Wrapper';
import CustomText from '@/components/CustomText';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function MedicineLogPage() {
    const { getMedicineLogByDate } = useMedicine()
    const { storeData } = useAsyncStorage()
    const [getMedicineLogLoading, setGetMedicineLogLoading] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [medicineLog, setMedicineLog] = useState<GetMedicineLogRes[]>([])
    const isFocused = useIsFocused()

    const handleGetMedicineLog = async (date: string) => {
        try {
            const res = await getMedicineLogByDate(setGetMedicineLogLoading, date)
            setMedicineLog(res.data)
            console.log("[index] -> Medicine Log by Date", res.data)
        } catch (err) {
            setMedicineLog([])
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
        await storeData('medicineLogDate', formatDatetoString(selectedDate))
        router.navigate('/logs/medicine/AddMedicineLog')
    }

    useEffect(() => {
        if (isFocused) {
            handleGetMedicineLog(formatDatetoString(selectedDate))
        }
    }, [selectedDate, isFocused])

    useEffect(() => {
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const year = selectedDate.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;
    }, [selectedDate])

    return (
        <>
            <Wrapper style={{ backgroundColor: 'white', marginBottom: 20 }}>
                <CustomCalendar value={selectedDate} onChange={setSelectedDate} />
            </Wrapper>

            <View style={styles.logContainer}>
                <View style={styles.logHeaderContainer}>
                    <Text style={styles.logHeaderText}>Detail Log Obat</Text>
                    <TouchableOpacity style={styles.headerAddButton} onPress={handleNavigate}>
                        <FontAwesome name='plus' size={16} color="white" />
                    </TouchableOpacity>
                </View>
                {medicineLog.length > 0 ? (
                    <View style={{ width: '100%' }}>
                        <MedicineLogList
                            data={medicineLog}
                        />
                    </View>
                ) : (
                    <View style={styles.notFoundContainer}>
                        <Image source={require('@/assets/images/characters/not-found.png')} />
                        <CustomText style={{ textAlign: 'center', color: Colors.light.gray400 }}>Belum ada nutrisi yang kamu tambahkan</CustomText>
                    </View>
                )}

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