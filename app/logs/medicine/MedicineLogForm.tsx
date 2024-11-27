import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { Children, useEffect, useState } from 'react'
import { Formik, FormikProps } from 'formik'
import * as Yup from 'yup';
import CustomTextInput from '@/components/CustomInput/CustomTextInput';
import { FontFamily, FontSize } from '@/constants/Typography';
import CustomTimePicker from '@/components/CustomTimePicker';
import CustomQuantityPicker from '@/components/CustomQuantityPicker';
import { Controller, useForm, UseFormHandleSubmit } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface MedicineLogFormRenderProps {
    handleSubmit: UseFormHandleSubmit<StoreMedicineLogReq, undefined>
    disabled: boolean
}

interface MedicineLogFormProps {
    formValue: StoreMedicineLogReq
    setFormValue: (formValue: StoreMedicineLogReq) => void
    children: (props: MedicineLogFormRenderProps) => React.ReactNode
}

const medicineLogSchema = Yup.object().shape({
    name: Yup.string().required('Nama obat wajib diisi!'),
    time: Yup.string().required('Waktu konsumsi wajib diisi!'),
    amount: Yup.number().required('Jumlah dosis wajib diisi'),
    type: Yup.string().required('Tipe dosis wajib dipilih'),
    note: Yup.string(),
});

// TODO: ambil dari db 
const doses = Array.from({ length: 100 }, (_, i) => i + 1);
const doseTypes = ["Tablet", "Kaplet", "Kapsul", "IU", "mL", "Tetes", "Sachet"];

export default function MedicineLogForm({ formValue, setFormValue, children, ...rest }: MedicineLogFormProps) {

    const { control, handleSubmit, reset, watch, setValue, formState: { errors, isDirty, isValid } } = useForm<StoreMedicineLogReq>({
        defaultValues: formValue,
        resolver: yupResolver(medicineLogSchema),
        mode: 'onChange',
    })

    const [type] = watch(['type'])

    useEffect(() => {
        reset(formValue)
    }, [formValue])

    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
            <View>
                <Controller
                    control={control}
                    name='name'
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <CustomTextInput
                            label='Nama Obat'
                            placeholder='Cth: Insulin'
                            value={value}
                            onChangeText={onChange}
                            error={errors.name ? errors.name.message : ''}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name='time'
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <CustomTimePicker
                            value={value}
                            onChange={onChange}
                            label='Pilih waktu'
                            error={errors.time ? errors.time.message : ''}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name='amount'
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <>
                            <Text style={styles.labelText}>Dosis</Text>
                            <CustomQuantityPicker
                                qty={value}
                                size={type}
                                onChangeQty={onChange}
                                onChangeSize={(v) => setValue('type', v)}
                                qtyData={doses}
                                typeData={doseTypes}
                            />
                        </>
                    )}
                />

                <Controller
                    control={control}
                    name='notes'
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <CustomTextInput
                            style={styles.catatanInput}
                            label='Catatan'
                            placeholder='Masukkan catatan di bagian ini'
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                />

            </View>
            {children({ handleSubmit, disabled: !isDirty || !isValid })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#EAF3F4',
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
        height: 100,
        textAlignVertical: 'top',
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