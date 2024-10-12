import CustomButton, { StyledCustomButton } from '@/components/CustomButton';
import CustomTextInput from '@/components/CustomInput/CustomTextInput';
import CustomModal, { CustomModalProps } from '@/components/CustomModal';
import { Colors } from '@/constants/Colors';
import { FontFamily, FontSize } from '@/constants/Typography';
import useDailyCalories from '@/hooks/api/daily_calories/useDailyCalories';
import formatDatetoString from '@/utils/formatDatetoString';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Alert, Button, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProgressBar from './ProgressBar';

type DailyCaloriesInputProps = {
    selectedDate: Date
}

export default function DailyCaloriesInput({ selectedDate }: DailyCaloriesInputProps) {
    const [modalVisible, setModalVisible] = useState(false)
    const [dailyCalories, setDailyCalories] = useState<GetDailyCaloriesResponse | null>(null)
    const [dailyCaloriesInput, setDailyCaloriesInput] = useState("")

    const [dailyCaloriesLoading, setDailyCaloriesLoading] = useState(false)
    const [storeDailyCaloriesLoading, setStoreDailyCaloriesLoading] = useState(false)

    const { getDailyCaloriesByDate, storeDailyCalories } = useDailyCalories()

    const handleGetDailyCalories = async () => {
        try {
            const res = await getDailyCaloriesByDate(setDailyCaloriesLoading, formatDatetoString(selectedDate))
            const data: GetDailyCaloriesResponse = res.data
            setDailyCalories(data)
            setDailyCaloriesInput(String(data.target_calories))
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

    const handleStoreDailyCalories = async () => {
        try {
            const payload: StoreDailyCaloriesRequest = {
                date: formatDatetoString(selectedDate),
                consumed_calories: 0,
                target_calories: Number(dailyCaloriesInput),
            }

            const res = await storeDailyCalories(setStoreDailyCaloriesLoading, payload)
            handleGetDailyCalories()
            handleCloseModal()
        } catch (err) {
            handleCloseModal()
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

    const handleCloseModal = () => {
        if (!dailyCalories) {
            setDailyCaloriesInput("")
        }
        setModalVisible(!modalVisible)
    }

    useEffect(() => {
        setDailyCaloriesInput("")
        handleGetDailyCalories()
    }, [selectedDate])


    return (
        <>
            <CustomModal
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                    <View>
                        <Text>Atur kalori harian</Text>
                        <CustomTextInput
                            label='Target kalori'
                            placeholder='Contoh: 98'
                            postfix={<Text style={{ color: Colors.light.primary, fontFamily: FontFamily.heavy }}>Kkal</Text>}
                            value={dailyCaloriesInput}
                            onChangeText={setDailyCaloriesInput}
                            keyboardType='number-pad'
                        />
                    </View>
                    <CustomButton title='Tambahkan target' size='md' onPress={handleStoreDailyCalories} />
                </View>
            </CustomModal>
            <View style={styles.dailyContainer}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={styles.dailyHeader}>Kalori Harian Anda</Text>
                        <Ionicons name='chevron-forward-outline' style={styles.dailyHeader} />
                    </View>
                </TouchableOpacity>
                {dailyCalories ? (
                    <ProgressBar data={dailyCalories} />
                ) : (
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <Image source={require('@/assets/images/characters/body-blood.png')} />
                        <Text>Belum ada target kalori anda</Text>
                    </View>
                )}
            </View>
        </>

    );
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
})

