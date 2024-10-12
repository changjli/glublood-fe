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

export default function AddMedicineLog() {
    const { storeMedicineLog } = useMedicine()
    const [storeLoading, setStoreLoading] = useState(false)

    const handleStoreUserProfile = async (data: FormValues) => {
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

    interface FormValues {
        date: Date,
        name: string,
        time: string,
        amount: number,
        type: string,
        notes: string,
    }

    const [namaObat, setNamaObat] = useState('');
    const [selectedTime, setSelectedTime] = useState<Date | undefined>(new Date());
    const [selectedDoseValue, setSelectedDoseValue] = useState(1);
    const [selectedDoseTypeValue, setSelectedDoseTypeValue] = useState(1);
    const [catatan, setCatatan] = useState('');
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [initialFormValues, setInitialFormValues] = useState({
        date: '',
        medicineName: '',
        timeConsumption: '',
        dose: 0,
        doseType: '',
        note: '',
    });

    const validationSchema = Yup.object().shape({
        date: Yup.date(),
        medicineName: Yup.string().required('Nama obat wajib diisi!'),
        timeConsumption: Yup.date().required('Waktu konsumsi wajib diisi!'),
        dose: Yup.number(),
        doseType: Yup.string(),
        note: Yup.string(),
    });

    const doses = Array.from({ length: 100 }, (_, i) => i + 1);
    const doseTypes = ["Tablet", "Kaplet", "Kapsul", "IU", "mL", "Tetes", "Sachet"];

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Tambah log obat</Text>

            <Formik
                initialValues={initialFormValues}
                // validationSchema={validationSchema}
                onSubmit={async (values) => {
                    const mappedValues: FormValues = {
                        date: new Date(),
                        name: values.medicineName,
                        time: values.timeConsumption,
                        amount: Number(values.dose),
                        type: values.doseType,
                        notes: values.note,
                    };

                    await handleStoreUserProfile(mappedValues);

                    console.log(values.timeConsumption)
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
                    <View>
                        <View style={{ marginBottom:20 }}>
                            <Text style={styles.labelText}>Nama Obat</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Cth: Insulin"
                                value={values.medicineName}
                                onChangeText={handleChange('medicineName')}
                            />
                        </View>

                        {/* Waktu Selection */}
                        <View style={{ marginBottom: 20 }}>
                            <CustomTimePicker
                                value={values.timeConsumption}
                                onChange={handleChange('timeConsumption')}
                            />
                            {/* <Text style={styles.labelText}>Pilih Waktu</Text>
                            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.timePicker}>
                                <Text style={styles.timeText}>
                                    {selectedTime ? selectedTime.toLocaleTimeString() : 'Tekan untuk pilih waktu'}
                                </Text>
                            </TouchableOpacity> */}
                        </View>
                        {/* {showTimePicker && (
                            <DateTimePicker
                                value={selectedTime || new Date(values.date)}
                                mode="time"
                                display="default"
                                onChange={handleTimeChange}
                            />
                        )} */}

                        {/* Scrollable Dosis Picker */}
                        <View style={{ marginBottom:20 }}>
                            <Text style={styles.labelText}>Dosis</Text>
                            <CustomQuantityPicker
                                qty={values.dose}
                                size={values.doseType}
                                onChangeQty={handleChange('dose')}
                                onChangeSize={handleChange('doseType')}
                                qtyData={doses}
                                typeData={doseTypes}
                            />
                        </View>

                        {/* Catatan Input */}
                        <View style={{ marginBottom:20 }}>
                            <Text style={styles.labelText}>Catatan</Text>
                            <TextInput
                                style={styles.catatanInput}
                                placeholder="Masukkan catatan di bagian ini"
                                value={values.note}
                                onChangeText={handleChange('note')}
                                multiline
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => handleSubmit()}
                        >
                            <Text style={styles.saveButtonText}>+ Simpan catatan</Text>
                        </TouchableOpacity>
                    </View>
                )}
            
            </Formik>
            {/* Nama Obat Input */}

            {/* Simpan Button */}
            
        </View>
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
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    labelText: {
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',
    },
    timePicker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fff',
    },
    timeText: {
        fontSize: 16,
        color: '#333',
    },
    scrollablePickerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dosisContainer: {
        marginBottom: 20,
    },
    pickerLabel: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    dosisPicker: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    dosisPickerContent: {
        alignItems: 'center',
    },
    dosisItem: {
        height: 40, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    dosisText: {
        fontSize: 18,
        color: '#DA6E35',
    },
    selectedDosisText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#DA6E35',
    },
    unitButton: {
        backgroundColor: '#F4B084', // Button color as per screenshot
        padding: 10,
        borderRadius: 5,
    },
    unitText: {
        fontSize: 16,
        color: '#fff',
    },
    catatanInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
        height: 100,
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