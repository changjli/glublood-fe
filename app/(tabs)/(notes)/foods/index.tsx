import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import CustomTimePicker from '../CustomTimePicker';
import CustomCalendar from '../CustomCalendar';
import { Colors } from '@/constants/Colors';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Size, Weight } from '@/constants/Typography';
import DailyCaloriesInput from './DailyCaloriesInput';

export default function Foods() {
    const [city, setCity] = useState('')

    const [selectedDate, setSelectedDate] = useState<Date>(new Date())

    const CITIES = 'Jakarta,Bandung,Sumbawa,Taliwang,Lombok,Bima'.split(',');

    const [modalVisible, setModalVisible] = useState(false)

    return (
        <>
            <DailyCaloriesInput visible={modalVisible} onRequestClose={() => setModalVisible(false)} />
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
                    <FontAwesome name='plus' style={styles.logHeaderIcon} />
                </View>
                <Image source={require('@/assets/images/characters/not-found.png')} />
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
    }
})