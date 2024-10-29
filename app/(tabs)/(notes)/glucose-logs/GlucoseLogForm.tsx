import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { Children, useEffect, useState } from 'react'
import { Formik, FormikProps } from 'formik'
import CustomTimePicker from '../CustomTimePicker'
import * as Yup from 'yup';
import CustomQuantityPicker from '../CustomQuantityPicker'
import CustomTextInput from '@/components/CustomInput/CustomTextInput';
import { FontFamily, FontSize } from '@/constants/Typography';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface GlucoseLogFormRenderProps {
    values: StoreGlucoseLogReq
    handleSubmit: () => void
}

interface GlucoseLogFormProps {
    formValue: StoreGlucoseLogReq
    setFormValue: (formValue: StoreGlucoseLogReq) => void
    children: (props: GlucoseLogFormRenderProps) => React.ReactNode
}

const validationSchema = Yup.object().shape({
    date: Yup.date(),
    glucose_rate: Yup.number().required('Tekanan gula darah wajib diisi!'),
    time: Yup.string().required('Waktu pengambilan wajib diisi!'),
    timeSelection: Yup.string(),
    note: Yup.string(),
});

const doseTypes = ["Sesudah Makan", "Sebelum Makan", "Puasa", "Sebelum Tidur"];

export default function GlucoseLogForm({ formValue, setFormValue, children, ...rest }: GlucoseLogFormProps) {
    return (
        <Formik
            initialValues={formValue}
            validationSchema={validationSchema}
            onSubmit={(values) => { }}
            enableReinitialize
        >
            {({ handleChange, setFieldValue, handleSubmit, values, errors }) => (
                <View>
                    <View style={{ marginBottom: 20 }}>
                        <CustomTextInput
                            label='Gula Darahmu'
                            placeholder='Contoh: 98'
                            postfix={(
                                <Text style={{ fontFamily: FontFamily.heavy, fontSize: FontSize.md, color: '#DA6E35'}}>mg/dL</Text>
                            )}
                            value={values.glucose_rate ? String(values.glucose_rate) : ''}
                            onChangeText={handleChange('glucose_rate')}
                        />
                    </View>

                    <View style={{ marginBottom: 20 }}>
                        <CustomTimePicker
                            value={values.time}
                            onChange={handleChange('time')}
                        />
                    </View>

                    <View style={{ marginBottom:20 }}>
                        <Text style={styles.labelText}>Kondisi Pengambilan</Text>
                        <CustomQuantityPicker
                            widthSize={200}
                            size={values.time_selection}
                            onChangeSize={handleChange('time_selection')}
                            typeData={doseTypes}
                            showQtyPicker={false}
                        />
                    </View>

                    <View style={{ marginBottom: 10 }}>
                        <CustomTextInput
                            style={styles.catatanInput}
                            label='Catatan'
                            placeholder='Masukkan catatan di bagian ini'
                            value={values.notes}
                            onChangeText={handleChange('notes')}
                        />
                    </View>

                    {children({ values, handleSubmit })}
                </View>
            )}
        </Formik>
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