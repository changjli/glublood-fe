import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import * as Yup from 'yup';
import CustomQuantityPicker from '../CustomQuantityPicker';
import CustomButton from '@/components/CustomButton';
import Wrapper from '@/components/Layout';
import axios from 'axios'
import { router } from 'expo-router'
import useAsyncStorage from '@/hooks/useAsyncStorage';
import useGlucoseLog from '@/hooks/api/logs/glucose/useGlucoseLog';
import GlucoseLogForm from './GlucoseLogForm';

export default function AddGlucoseLog() {
    const { storeGlucoseLog } = useGlucoseLog()
    const { getData } = useAsyncStorage()
    const [storeLoading, setStoreLoading] = useState(false)

    const handleStoreGlucoseLog = async (data: StoreGlucoseLogReq) => {
        try {
            console.log("Data: ", data)
            const res = await storeGlucoseLog(setStoreLoading, data)
            router.navigate('/(notes)/glucose-logs')
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
        <ScrollView>
            <Wrapper style={styles.container}>
                <Text style={styles.header}>Tambah log obat</Text>
            
                <GlucoseLogForm
                    formValue={formValue}
                    setFormValue={setFormValue}
                >
                    {({ values, handleSubmit }) => (
                        <CustomButton title='+ Simpan catatan' size='md' onPress={() => {
                            handleSubmit()
                            handleStoreGlucoseLog(values)
                        }} />
                    )}
                </GlucoseLogForm>
            </Wrapper>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#EAF3F4', 
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