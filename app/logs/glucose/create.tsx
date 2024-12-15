import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import * as Yup from 'yup';
import CustomButton from '@/components/CustomButton';
import axios from 'axios'
import { router } from 'expo-router'
import useAsyncStorage from '@/hooks/useAsyncStorage';
import useGlucoseLog from '@/hooks/api/logs/glucose/useGlucoseLog';
import GlucoseLogForm from './GlucoseLogForm';
import Wrapper from '@/components/Layout/Wrapper';
import CustomHeader from '@/components/CustomHeader';
import CustomButtonNew from '@/components/CustomButtonNew';
import { useCustomAlert } from '@/app/context/CustomAlertProvider';

export default function AddGlucoseLog() {
    const { storeGlucoseLog } = useGlucoseLog()
    const { getData } = useAsyncStorage()
    const [storeLoading, setStoreLoading] = useState(false)
    const { showAlert } = useCustomAlert()

    const handleStoreGlucoseLog = async (data: StoreGlucoseLogReq) => {
        try {
            console.log("Data: ", data)
            const res = await storeGlucoseLog(setStoreLoading, data)
            router.navigate('/(tabs)/(notes)')
        } catch (err) {
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

    const [formValue, setFormValue] = useState<StoreGlucoseLogReq>({
        date: '',
        glucose_rate: 0,
        time: '',
        time_selection: '',
        notes: '',
        type: 'manual',
    })

    const handlePopulateFormValue = async () => {
        const date = await getData('glucoseLogDate')
        setFormValue({
            ...formValue,
            date: date ?? '',
        })
    }

    useEffect(() => {
        handlePopulateFormValue()
    }, [])

    return (
        <>
            <CustomHeader title='Tambah log gula darah' />
            <Wrapper style={styles.container}>
                <GlucoseLogForm
                    formValue={formValue}
                    setFormValue={setFormValue}
                >
                    {({ handleSubmit, disabled }) => (
                        <CustomButtonNew
                            store={true}
                            imgSrc={require('@/assets/images/icons/plus.png')}
                            label='Simpan Catatan'
                            onPress={handleSubmit((data) => handleStoreGlucoseLog(data))}
                            disabled={disabled}
                        />
                    )}
                </GlucoseLogForm>
            </Wrapper>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'white',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    saveButton: {
        padding: 15,
        backgroundColor: '#DA6E35',
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',
    },
});