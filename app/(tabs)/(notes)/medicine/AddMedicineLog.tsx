import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ScrollablePicker from '@/components/ScrollablePicker';
import CustomTimePicker from '../CustomTimePicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Formik, FormikValues } from 'formik';
import useMedicine from '@/hooks/api/medicine_log/useMedicineLog';
import * as Yup from 'yup';
import CustomQuantityPicker from '../CustomQuantityPicker';
import MedicineLogForm from './MedicineLogForm';
import CustomButton from '@/components/CustomButton';
import Wrapper from '@/components/Layout';

export default function AddMedicineLog() {
    const { storeMedicineLog } = useMedicine()
    const [storeLoading, setStoreLoading] = useState(false)

    const handleStoreMedicineLog = async (data: StoreMedicineLogReq) => {
        console.log("[handleStoreUserProfile]", data)
        try {
            const res = await storeMedicineLog(setStoreLoading, data)
            if (res.status == 200) {
                console.log(res.data)
                Alert.alert('success', res.message)
            } else if (res.status == 400) {
                console.log(res)
                console.log(res.message)
                Alert.alert('error', res.message)
            }
        } catch (err) {
            console.log('Axios Error:', err)
            Alert.alert('error', 'Error: Please try again later')
        }
    }

    const [formValue, setFormValue] = useState<StoreMedicineLogReq>({
        date: new Date(),
        name: '',
        time: '',
        amount: 1,
        type: '',
        notes: '',
    })

    return (
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

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#EAF3F4', // Light background color similar to screenshot
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