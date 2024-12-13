import CustomButton, { StyledCustomButton } from '@/components/CustomButton';
import CustomTextInput from '@/components/CustomInput/CustomTextInput';
import CustomModal, { CustomModalProps } from '@/components/CustomModal';
import { Colors } from '@/constants/Colors';
import { FontFamily, FontSize } from '@/constants/Typography';
import useDailyCalories from '@/hooks/api/daily_calories/useDailyCalories';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Button, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProgressBar from './ProgressBar';
import CustomText from '@/components/CustomText';
import { formatDatetoStringYmd } from '@/utils/formatDatetoString';
import { useCustomAlert } from '@/app/context/CustomAlertProvider';

type DailyCaloriesInputProps = {
    selectedDate: Date,
    dailyCalories: GetDailyCaloriesResponse | null
    loading: boolean
    fetchDailyCalories: () => void
}

export default function DailyCaloriesInput({ selectedDate, dailyCalories, loading, fetchDailyCalories }: DailyCaloriesInputProps) {
    const [modalVisible, setModalVisible] = useState(false)
    const [dailyCaloriesInput, setDailyCaloriesInput] = useState("")

    const [storeDailyCaloriesLoading, setStoreDailyCaloriesLoading] = useState(false)
    const { showAlert } = useCustomAlert()

    const { storeDailyCalories } = useDailyCalories()

    const handleStoreDailyCalories = async () => {
        try {
            const payload: StoreDailyCaloriesRequest = {
                date: formatDatetoStringYmd(selectedDate),
                consumed_calories: 0,
                target_calories: Number(dailyCaloriesInput),
            }

            const res = await storeDailyCalories(setStoreDailyCaloriesLoading, payload)
            fetchDailyCalories()
            handleCloseModal()
        } catch (err) {
            handleCloseModal()
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    showAlert('Invalid request. Please check your input.', 'error');
                } else if (status === 500) {
                    showAlert('A server error occurred. Please try again later.', 'error');
                } else {
                    showAlert(`An error occurred: ${status}. Please try again later.`, 'error');
                }
            } else {
                console.log('Unexpected Error:', err);
                showAlert('Please check your internet connection.', 'error');
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
        setDailyCaloriesInput(String(dailyCalories?.target_calories ?? ''))
    }, [dailyCalories])


    return (
        <>
            {/* modal */}
            <CustomModal
                isVisible={modalVisible}
                toggleModal={() => setModalVisible(false)}
            >
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                    <View>
                        <CustomText size='xl' weight='heavy' style={{ marginBottom: 5 }}>Atur kalori harian</CustomText>
                        <CustomTextInput
                            label='Target kalori'
                            placeholder='Contoh: 98'
                            postfix={<Text style={{ color: Colors.light.primary, fontFamily: FontFamily.heavy }}>Kkal</Text>}
                            value={dailyCaloriesInput}
                            onChangeText={setDailyCaloriesInput}
                            keyboardType='number-pad'
                        />
                    </View>
                    <CustomButton
                        title='Tambahkan target'
                        size='md'
                        onPress={handleStoreDailyCalories}
                        disabled={dailyCaloriesInput == ''}
                        loading={storeDailyCaloriesLoading}
                    />
                </View>
            </CustomModal>
            {/* view */}
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
                        <CustomText size='sm' style={{ color: Colors.light.gray400 }}>Belum ada target kalori anda</CustomText>
                    </View>
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    dailyContainer: {
        width: '100%',
        borderWidth: 2,
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

