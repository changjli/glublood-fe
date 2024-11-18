import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import useMedicine from '@/hooks/api/logs/medicine/useMedicineLog';
import * as Yup from 'yup';
import MedicineLogForm from './MedicineLogForm';
import CustomButton from '@/components/CustomButton';
import Wrapper from '@/components/Layout/Wrapper'
import axios from 'axios'
import { router } from 'expo-router'
import useAsyncStorage from '@/hooks/useAsyncStorage';

export default function AddMedicineLog() {
    const { storeMedicineLog } = useMedicine()
    const { getData } = useAsyncStorage()
    const [storeLoading, setStoreLoading] = useState(false)

    const handleStoreMedicineLog = async (data: StoreMedicineLogReq) => {
        try {
            console.log("Data: ", data)
            const res = await storeMedicineLog(setStoreLoading, data)
            router.navigate('/(notes)/medicine')
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

    const [formValue, setFormValue] = useState<StoreMedicineLogReq>({
        date: '',
        name: '',
        time: '',
        amount: 1,
        type: '',
        notes: '',
    })

    const handlePopulateFormValue = async () => {
        const date = await getData('medicineLogDate')
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

                <MedicineLogForm
                    formValue={formValue}
                    setFormValue={setFormValue}
                >
                    {({ values, handleSubmit }) => (
                        <CustomButton title='+ Simpan catatan' size='md' onPress={() => {
                            handleSubmit()
                            handleStoreMedicineLog(values)
                        }} />
                    )}
                </MedicineLogForm>
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