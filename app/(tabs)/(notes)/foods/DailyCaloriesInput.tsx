import CustomButton, { StyledCustomButton } from '@/components/CustomButton';
import CustomTextInput from '@/components/CustomInput/CustomTextInput';
import CustomModal, { CustomModalProps } from '@/components/CustomModal';
import { Colors } from '@/constants/Colors';
import { Weight } from '@/constants/Typography';
import React, { useState } from 'react'
import { Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type DailyCaloriesInputProps = CustomModalProps & {
}

export default function DailyCaloriesInput(props: DailyCaloriesInputProps) {
    const [dailyCalories, setDailyCalories] = useState("")

    return (
        <CustomModal
            {...props}
        >
            <View className='flex flex-col justify-between h-full'>
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
                <CustomButton title='Tambahkan target' size='md' />
            </View>
        </CustomModal>
    );
}

