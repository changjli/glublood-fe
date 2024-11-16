import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { FontAwesome } from '@expo/vector-icons';
import CustomTimePicker from '../CustomTimePicker';

interface ReminderFormRenderProps {
    values: ReminderFormValues
    handleSubmit: () => void
}

interface ReminderFormProps {
    formValue: ReminderFormValues
    setFormValue: (formValue: ReminderFormValues) => void
    children: (props: ReminderFormRenderProps) => React.ReactNode
}

const validationSchema = Yup.object().shape({
    reminderType: Yup.string().required('Reminder type is required!'),
    time: Yup.array().of(Yup.string()).min(1, 'Time selection is required!'),
    repeatDays: Yup.array().of(Yup.string()).min(1, 'At least one day must be selected!'),
});

export default function ReminderForm({ formValue, setFormValue, children, ...rest }: ReminderFormProps) {
    return (
        <Formik
            initialValues={formValue}
            validationSchema={validationSchema}
            onSubmit={(values) => console.log('Submitted Values:', values)}
        >
            {({ handleChange, handleSubmit, values, setFieldValue, errors }) => (
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity>
                            <FontAwesome name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Tambah Pengingat</Text>
                        <TouchableOpacity>
                            <FontAwesome name="plus" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Reminder Type Selection */}
                    <Text style={styles.label}>Pilih Jenis Pengingat</Text>
                    <View style={styles.reminderTypeContainer}>
                        {['Olahraga', 'Gula darah', 'Obat'].map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.reminderTypeButton,
                                    values.reminderType.includes(type) && styles.selectedTypeButton, // Highlight selected types
                                ]}
                                onPress={() => {
                                    console.log('Selected Type:', type);

                                    const isSelected = values.reminderType.includes(type);
                                    const newSelectedTypes = isSelected
                                        ? values.reminderType.filter((t) => t !== type) // Remove if already selected
                                        : [...values.reminderType, type]; // Add if not selected
                                    
                                    const cleanedTypes = newSelectedTypes.map(t => t.trim().replace(/^"|"$/g, ""));
                                    setFieldValue('reminderType', cleanedTypes);
                                }}
                            >
                                <Text style={styles.reminderTypeText}>{type}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {errors.reminderType && <Text style={styles.errorText}>{errors.reminderType}</Text>}

                    {/* Time Selection */}
                    <CustomTimePicker
                        value={values.time}
                        onChange={handleChange('time')}
                    />
                    <Text style={styles.label}>Pilih Waktu</Text>
                    {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}

                    {/* Weekly Reminder Selection */}
                    <Text style={styles.label}>Pengingat Berulang</Text>
                    <ScrollView style={styles.daysContainer}>
                        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day) => (
                            <View key={day} style={styles.dayRow}>
                                <Text>{`Setiap ${day}`}</Text>
                                <Switch
                                    value={values.repeatDays.includes(day)}
                                    onValueChange={(isSelected) => {
                                        if (isSelected) {
                                            setFieldValue('repeatDays', [...values.repeatDays, day]);
                                        } else {
                                            setFieldValue(
                                                'repeatDays',
                                                values.repeatDays.filter((d) => d !== day)
                                            );
                                        }
                                    }}
                                />
                            </View>
                        ))}
                    </ScrollView>
                    {errors.repeatDays && <Text style={styles.errorText}>{errors.repeatDays}</Text>}
                    
                    {children({ values, handleSubmit })}
                </View>
            )}
        </Formik>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAF3F4',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#d0663e',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 10,
    },
    reminderTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    reminderTypeButton: {
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    selectedTypeButton: {
        backgroundColor: '#f4a261',
    },
    reminderTypeText: {
        color: '#333',
    },
    timePicker: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 16,
        color: '#333',
    },
    daysContainer: {
        marginVertical: 10,
    },
    dayRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    saveButton: {
        padding: 15,
        backgroundColor: '#DA6E35',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
    },
});
