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

export default function AddGlucoseLog() {
    const { storeGlucoseLog } = useGlucoseLog()
    const { getData } = useAsyncStorage()
    const [storeLoading, setStoreLoading] = useState(false)

    const handleStoreGlucoseLog = async (data: StoreGlucoseLogReq) => {
        try {
            console.log("Data: ", data)
            const res = await storeGlucoseLog(setStoreLoading, data)
            router.navigate('/(tabs)/(notes)')
        } catch (err) {
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
                        <CustomButton
                            title='+ Simpan catatan'
                            size='md'
                            disabled={disabled}
                            onPress={handleSubmit((data) => handleStoreGlucoseLog(data))} />
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