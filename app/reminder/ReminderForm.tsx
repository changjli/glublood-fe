import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Modal, FlatList, ListRenderItem, Image, TextInput, Dimensions, ScrollViewBase } from 'react-native';
import { Formik, Field, FormikConsumer, FormikErrors } from 'formik';
import * as Yup from 'yup';
import { FontAwesome } from '@expo/vector-icons';
import CustomTimePicker from '@/components/CustomTimePicker';
import CustomTextInput from '@/components/CustomInput/CustomTextInput';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import { Colors } from '@/constants/Colors';
import CustomHeader from '@/components/CustomHeader';
import Wrapper from '@/components/Layout/Wrapper';

interface ReminderFormRenderProps {
    values: ReminderFormValues
    handleSubmit: () => void
    errors: FormikErrors<ReminderFormValues>
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
    { id: 1, day: 'Senin', value: 2 },
    { id: 2, day: 'Selasa', value: 3 },
    { id: 3, day: 'Rabu', value: 4 },
    { id: 4, day: 'Kamis', value: 5 },
    { id: 5, day: 'Jumat', value: 6 },
    { id: 6, day: 'Sabtu', value: 7 },
    { id: 7, day: 'Minggu', value: 1 }
];

const dayMapping: { [key: number]: string } = {
    2: 'Senin',
    3: 'Selasa',
    4: 'Rabu',
    5: 'Kamis',
    6: 'Jumat',
    7: 'Sabtu',
    1: 'Minggu',
};

const validationSchema = Yup.object().shape({
    reminderType: Yup.array().of(Yup.number()).min(1, 'Reminder type is required!'),
    time: Yup.string().required('Time selection is required!'),
    repeatDays: Yup.array().of(Yup.number()),
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

    const hours = Array.from({ length: 24 }, (_, i) => (i).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    const [modalWeeklyReminderVisible, setModalWeeklyReminderVisible] = useState<boolean>(false);
    const [modalNotesVisible, setModalNotesVisible] = useState<boolean>(false);

    const handleTimeFieldValue = (setFieldValue: any) => {
        setFieldValue('time', `${selectedHour}:${selectedMinute}`)
    }

    const handleSortRepeatDays = (values: ReminderFormValues) => {
        const sortedDays = values.repeatDays.sort((a: number, b: number) => a - b)

        if (sortedDays[0] == 1 && sortedDays.length > 1) {
            const rotatedList = sortedDays.slice(1).concat(sortedDays[0]);
            values.repeatDays = rotatedList
        }
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
                    onPress={() => toggleDaySelection(item.value, values, setFieldValue)}
                >
                    <Text style={styles.itemText}>{item.day}</Text>
                    {values.repeatDays.includes(item.value) && (
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
                    <CustomHeader title='Tambahkan Pengingat' />

                    <View style={{ paddingHorizontal: 20 }}>
                        {/* Time Selection */}
                        <View style={styles.timePickerContainer}>
                            <WheelPickerExpo
                                height={height * 0.3}
                                width={width * 0.3}
                                backgroundColor='#eaf3f4'
                                initialSelectedIndex={hours.indexOf(selectedHour)}
                                items={hours.map(hour => ({ label: hour, value: hour }))}
                                onChange={({ index }) => {
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
                                flatListProps={{
                                    nestedScrollEnabled: true,
                                }}
                            />
                            <WheelPickerExpo
                                height={height * 0.3}
                                width={width * 0.3}
                                backgroundColor='#eaf3f4'
                                initialSelectedIndex={minutes.indexOf(selectedMinute)}
                                items={minutes.map(minute => ({ label: minute, value: minute }))}
                                onChange={({ index }) =>
                                    {
                                        setSelectedMinute(minutes[index])
                                        handleTimeFieldValue(setFieldValue)
                                    }
                                }
                                renderItem={({ label }) => (
                                    <Text style={[
                                        styles.timePickerText,
                                        label == selectedMinute && styles.timePickerTextSelected
                                    ]}>
                                        {label}
                                    </Text>
                                )}
                                flatListProps={{
                                    nestedScrollEnabled: true,
                                }}
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
                                    <Text style={styles.openModalText2}>
                                        {
                                            values.repeatDays.length > 0 ? 
                                                values.repeatDays.length > 2 ? ['Setiap ', values.repeatDays.slice(0, 2).map((num) => dayMapping[num]).join(', '), ' ...']
                                                    :
                                                ['Setiap ', values.repeatDays.map((num) => dayMapping[num]).join(', ')]
                                                :
                                                'Sekali'
                                        }
                                    </Text>
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
                                                <Text style={{ color: '#969696', fontFamily: 'Helvetica', fontSize: 12 }}>Kembali</Text>
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
                                            onPress={() => {
                                                setModalWeeklyReminderVisible(false)
                                                handleSortRepeatDays(values)
                                            }}
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
                                        { color: '#969696' }
                                    ]}
                                >
                                    {values.notes.length == 0 ? 'Tidak ada catatan' : values.notes.length > 7 ? values.notes.slice(0, 7) + '...' : values.notes.slice(0, 7)}
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
                                                <Text style={{ color: '#969696', fontFamily: 'Helvetica', fontSize: 12 }}>Kembali</Text>
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
                        <View style={styles.reminderTypeContainer}>
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
                                                    values.reminderType.filter((item: number) => item !== option.value)
                                                );
                                            } else {
                                                setFieldValue('reminderType', [...values.reminderType, option.value]);
                                            }
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.reminderTypeText,
                                                values.reminderType.includes(option.value) && { color: '#fff' }
                                            ]}
                                        >
                                            {option.title}
                                        </Text>
                                        <Image
                                            source={option.imgPath}
                                            style={{ marginTop: 10, width: 55, height: 55 }}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                    {children({ values, handleSubmit, errors })}
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
    label: {
        marginTop: 12,
        marginBottom: 3,
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',
        color: '#333',
    },
    reminderTypeContainer: {
        marginBottom: 40,
        paddingHorizontal: 5,
    },
    reminderTypeButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    reminderTypeButton: {
        paddingTop: 20,
        width: 110,
        height: 130,
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
        borderColor: '#DBDFEA',
        borderBottomWidth: 2,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    openModalText: {
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',
    },
    openModalButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    openModalText2: {
        marginRight: 7,
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
        flexDirection: 'column',
        justifyContent: 'center'
    },
    modalHeader: {
        marginTop: -28,
        marginHorizontal: 'auto',
        fontSize: 16,
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
