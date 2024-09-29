import CustomButton, { StyledCustomButton } from '@/components/CustomButton';
import CustomTextInput from '@/components/CustomInput/CustomTextInput';
import CustomModal, { CustomModalProps } from '@/components/CustomModal';
import { Colors } from '@/constants/Colors';
import { Weight } from '@/constants/Typography';
import useDailyCalories from '@/hooks/api/daily_calories/useDailyCalories';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Alert, Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type DailyCaloriesInputProps = CustomModalProps & {
}

export default function DailyCaloriesInput({ ...rest }: DailyCaloriesInputProps) {
    const [dailyCalories, setDailyCalories] = useState("")

    const [storeDailyCaloriesLoading, setStoreDailyCaloriesLoading] = useState(false)

    const { storeDailyCalories } = useDailyCalories()

    const handleStoreDailyCalories = async () => {
        try {
            const payload: StoreDailyCaloriesRequest = {
                date: "08/09/2024",
                total_calories: Number(dailyCalories),
            }

            const res = await storeDailyCalories(setStoreDailyCaloriesLoading, payload)
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

    return (
        <CustomModal
            {...rest}
        >
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                <View>
                    <Text>Atur kalori harian</Text>
                    <CustomTextInput
                        label='Target kalori'
                        placeholder='Contoh: 98'
                        postfix={<Text style={{ color: Colors.light.primary, fontFamily: Weight.heavy }}>Kkal</Text>}
                        value={dailyCalories}
                        onChangeText={setDailyCalories}
                        keyboardType='number-pad'
                    />
                </View>
                <CustomButton title='Tambahkan target' size='md' onPress={handleStoreDailyCalories} />
            </View>
        </CustomModal>
    );
}

