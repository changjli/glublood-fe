import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Modal, FlatList, ListRenderItem, Image, TextInput, Dimensions, ScrollViewBase } from 'react-native';
import { Formik, Field, FormikConsumer } from 'formik';
import * as Yup from 'yup';
import { FontAwesome } from '@expo/vector-icons';
import CustomTimePicker from '../CustomTimePicker';
import CustomTextInput from '@/components/CustomInput/CustomTextInput';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import { Colors } from '@/constants/Colors';

interface ReminderFormRenderProps {
    values: ReminderFormValues
    handleSubmit: () => void
}

interface ReminderFormProps {
    formValue: ReminderFormValues
    setFormValue: (formValue: ReminderFormValues) => void
    children: (props: ReminderFormRenderProps) => React.ReactNode
}

interface Option {
    title: string;
    label: string;
    value: string; 
}

const DAYS: DayItem[] = [
    { id: 1, day: 'Senin' },
    { id: 2, day: 'Selasa' },
    { id: 3, day: 'Rabu' },
    { id: 4, day: 'Kamis' },
    { id: 5, day: 'Jumat' },
    { id: 6, day: 'Sabtu' },
    { id: 7, day: 'Minggu' }
];

const validationSchema = Yup.object().shape({
    reminderType: Yup.array().of(Yup.number()).min(1, 'Reminder type is required!'),
    time: Yup.string().required('Time selection is required!'),
    repeatDays: Yup.array().of(Yup. number()).min(1, 'At least one day must be selected!'),
    notes: Yup.string(),
});

export default function ReminderForm({ formValue, setFormValue, children, ...rest }: ReminderFormProps) {
    const [reminderType, setReminderType] = useState([
        {
            title: 'Olahraga',
            label: 'exercise_log',
            value: 3,
            imgPath: require('@/assets/images/reminder/karakter-olahraga.png'),
        },
        {
            title: 'Gula darah',
            label: 'glucose_log',
            value: 1,
            imgPath: require('@/assets/images/reminder/indikasi-terkena.png'),
        },
        {
            title: 'Obat',
            label: 'medicine',
            value: 2,
            imgPath: require('@/assets/images/reminder/karakter-obat.png'),
        },
    ]);

    // Wheel Time Picker
    const { width, height } = Dimensions.get('window');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedHour, setSelectedHour] = useState('01');
    const [selectedMinute, setSelectedMinute] = useState('00');

    const hours = Array.from({ length: 24 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    const [modalWeeklyReminderVisible, setModalWeeklyReminderVisible] = useState<boolean>(false);
    const [modalNotesVisible, setModalNotesVisible] = useState<boolean>(false);

    const handleTimeFieldValue = (setFieldValue: any) => {
        setFieldValue('time', `${selectedHour}:${selectedMinute}`)
    } 

    const toggleDaySelection = (dayId: number, values: any, setFieldValue: (field: string, value: any) => void) => {
        const updatedDays = values.repeatDays.includes(dayId)
            ? values.repeatDays.filter((selectedDayId: number) => selectedDayId !== dayId)
            : [...values.repeatDays, dayId];
    
        setFieldValue('repeatDays', updatedDays);
    };
    
    const renderItem: ListRenderItem<DayItem> = ({ item }) => (
        <FormikConsumer>
            {({ values, setFieldValue }) => (
                <TouchableOpacity
                    style={styles.itemContainer}
                    onPress={() => toggleDaySelection(item.id, values, setFieldValue)}
                >
                    <Text style={styles.itemText}>{item.day}</Text>
                    {values.repeatDays.includes(item.id) && (
                        <Text style={styles.checkMark}>✓</Text>
                    )}
                </TouchableOpacity>
            )}
        </FormikConsumer>
    );
    
    return (
        <Formik
            initialValues={formValue}
            validationSchema={validationSchema}
            onSubmit={(values) => console.log('Submitted Values:', values)}
            enableReinitialize
        >
            {({ handleChange, handleSubmit, handleBlur, values, setFieldValue, errors }) => (
                <ScrollView style={styles.container}>
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

                    {/* Time Selection */}
                    <View style={styles.timePickerContainer}>
                        <WheelPickerExpo
                            height={height * 0.3}
                            width={width * 0.3}
                            backgroundColor='#eaf3f4'
                            initialSelectedIndex={hours.indexOf(selectedHour)}
                            items={hours.map(hour => ({ label: hour, value: hour }))}
                            onChange={({ index }) =>
                                {
                                    setSelectedHour(hours[index])
                                    handleTimeFieldValue(setFieldValue)
                                }
                            }
                            renderItem={({ label }) => (
                                <Text style={[
                                    styles.timePickerText,
                                    label == selectedHour && styles.timePickerTextSelected
                                ]}>
                                    {label}
                                </Text>
                            )}
                        />
                        <WheelPickerExpo
                            height={height * 0.3}
                            width={width * 0.3}
                            backgroundColor='#eaf3f4'
                            initialSelectedIndex={minutes.indexOf(selectedMinute)}
                            items={minutes.map(minute => ({ label: minute, value: minute }))}
                            onChange={({ index }) => setSelectedMinute(minutes[index])}
                            renderItem={({ label }) => (
                                <Text style={[
                                    styles.timePickerText,
                                    label == selectedMinute && styles.timePickerTextSelected
                                ]}>
                                    {label}
                                </Text>
                            )}
                        />
                    </View>
                    {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}

                    {/* Weekly Reminder Selection */}
                    <View style={styles.weeklyReminderContainer}>
                        <View
                            style={styles.openModal}
                        >
                            <Text style={styles.openModalText}>Berulang</Text>
                            <TouchableOpacity
                                style={styles.openModalButton}
                                onPress={() => setModalWeeklyReminderVisible(true)}
                            >
                                <Text style={styles.openModalText2}>Sekali</Text>
                                <FontAwesome name="chevron-right" size={20} color="black" />
                            </TouchableOpacity>
                        </View>

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalWeeklyReminderVisible}
                            onRequestClose={() => setModalWeeklyReminderVisible(false)}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContent}>
                                    <View style={styles.modalTitle}>
                                        <TouchableOpacity
                                            onPress={() => setModalWeeklyReminderVisible(false)}
                                        >
                                            <Text style={{ color: '#969696',fontFamily: 'Helvetica' }}>Kembali</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.modalHeader}>Berulang</Text>
                                    </View>
                                    
                                    <FlatList
                                        data={DAYS}
                                        renderItem={renderItem}
                                        keyExtractor={(item) => item.id.toString()}
                                        style={{ paddingHorizontal: 12 }}
                                    />
                                    
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setModalWeeklyReminderVisible(false)}
                                    >
                                        <Text style={styles.closeButtonText}>Simpan</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>
                    {errors.repeatDays && <Text style={styles.errorText}>{errors.repeatDays}</Text>}

                    {/* Notes */}
                    <View style={styles.weeklyReminderContainer}>
                        <TouchableOpacity
                            style={styles.openModal}
                            onPress={() => setModalNotesVisible(true)}
                        >
                            <Text style={styles.openModalText}>Catatan</Text>
                            <Text
                                style={[
                                    styles.openModalText2,
                                    {color: '#969696'}
                                ]}
                            >
                                {values.notes.length == 0 ? 'Tidak ada catatan' : values.notes.length > 7 ? values.notes.slice(0, 7)+'...' : values.notes.slice(0, 7)}
                            </Text>
                        </TouchableOpacity>

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalNotesVisible}
                            onRequestClose={() => setModalNotesVisible(false)}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContent}>
                                    <View style={styles.modalTitle}>
                                        <TouchableOpacity
                                            onPress={() => setModalNotesVisible(false)}
                                        >
                                            <Text style={{ color: '#969696',fontFamily: 'Helvetica' }}>Kembali</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.modalHeader}>Berulang</Text>
                                    </View>

                                    <CustomTextInput
                                        style={styles.textInput}
                                        label='Catatan'
                                        placeholder='Masukkan catatan di bagian ini'
                                        value={values.notes}
                                        onChangeText={handleChange('notes')}
                                    />
                                    
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setModalNotesVisible(false)}
                                    >
                                        <Text style={styles.closeButtonText}>Simpan</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>
                    {errors.notes && <Text style={styles.errorText}>{errors.notes}</Text>}
                    
                    {/* Reminder Type Selection */}
                    <View style={ styles.reminderTypeContainer }>
                        <Text style={styles.label}>Jenis Pengingat</Text>
                        <View style={styles.reminderTypeButtonContainer}>
                            {reminderType.map((option) => (
                                <TouchableOpacity
                                    key={option.label}
                                    style={[
                                        styles.reminderTypeButton,
                                        values.reminderType.includes(option.value) && styles.selectedTypeButton,
                                    ]}
                                    onPress={() => {
                                        if (values.reminderType.includes(option.value)) {
                                            setFieldValue(
                                            'reminderType',
                                            values.reminderType.filter((item:number) => item !== option.value)
                                            );
                                        } else {
                                            setFieldValue('reminderType', [...values.reminderType, option.value]);
                                        }
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.reminderTypeText,
                                            values.reminderType.includes(option.value) && {color: '#fff'}
                                        ]}
                                    >
                                        {option.title}
                                    </Text>
                                    <Image
                                        source={option.imgPath}
                                        style={{ marginTop: 15, width: 64, height: 60}}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        {errors.reminderType && <Text style={styles.errorText}>{errors.reminderType}</Text>}
                    </View>

                    {children({ values, handleSubmit })}
                </ScrollView>
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
        marginTop: 12,
        marginBottom: 3,
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',
        color: '#333',
    },
    reminderTypeContainer: {
        marginBottom: 40,
    },
    reminderTypeButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    reminderTypeButton: {
        paddingTop: 20,
        width: 120,
        height: 140,
        borderWidth: 1,
        borderColor: '#DA6E35',
        borderRadius: 10,
        alignItems: 'center',
    },
    selectedTypeButton: {
        backgroundColor: '#f4a261',
    },
    reminderTypeText: {
        color: '#DA6E35',
        fontSize: 12,
        fontFamily: 'Helvetica'
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

    // Repeat Days Style
    weeklyReminderContainer: {
    },
    openModal: {
        width: '100%',
        marginVertical: 5,
        paddingVertical: 10,
        borderBottomWidth: 2,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    openModalText: {
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',
    },
    openModalButton: {
        width: 65,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    openModalText2: {
        fontSize: 16,
        fontFamily: 'Helvetica',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 20,
    },
    modalTitle: {
        marginTop: 10,
        marginBottom: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    modalHeader: {
        marginLeft: 135,
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    itemText: {
        fontSize: 18,
    },
    checkMark: {
        fontSize: 18,
        color: '#DA6E35',
    },
    closeButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#DA6E35',
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',
    },
    textInput: {
        height: 180,
        borderRadius: 8,
        textAlignVertical: 'top', 
        fontSize: 16,
        fontFamily: 'Helvetica',
    },

    // Wheel Time Picker Style
    timePickerContainer: {
        marginVertical: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    timePickerText: {
        color: Colors.light.secondary,
        fontSize: 32,
        fontFamily: 'Helvetica',
        textAlign: 'center',
    },
    timePickerTextSelected: {
        color: Colors.light.primary,
        fontSize: 32,
        fontFamily: 'Helvetica-Bold',
    },
});
