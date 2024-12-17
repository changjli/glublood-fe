import React, { useEffect, useState } from 'react';
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
import CustomWheelPicker from '@/components/CustomWheelPicker';
import CustomModal from '@/components/CustomModal';
import { FontSize } from '@/constants/Typography';
import { Controller, useForm, UseFormHandleSubmit } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomButton from '@/components/CustomButton';

interface ReminderFormRenderProps {
    handleSubmit: UseFormHandleSubmit<ReminderFormValues, undefined>
    disabled: boolean
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
    // time: Yup.string().required('Time selection is required!'),
    // repeatDays: Yup.array().of(Yup.number()),
    // notes: Yup.string(),
});

export default function ReminderForm({ formValue, setFormValue, children, ...rest }: ReminderFormProps) {
    const { control, handleSubmit, reset, watch, setValue, formState: { errors, isDirty, isValid } } = useForm<ReminderFormValues>({
        defaultValues: formValue,
        resolver: yupResolver(validationSchema),
        mode: 'onChange',
    })

    const [repeatDays, notes, reminderTypeValue] = watch(['repeatDays', 'notes', 'reminderType'])

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
    const [selectedHour, setSelectedHour] = useState(formValue.time.split(":")[0]);
    const [selectedMinute, setSelectedMinute] = useState(formValue.time.split(":")[1]);

    useEffect(() => {
        setSelectedHour(formValue.time.split(":")[0])
        setSelectedMinute(formValue.time.split(":")[1])
    }, [formValue])

    const hours = Array.from({ length: 24 }, (_, i) => (i).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    const [modalWeeklyReminderVisible, setModalWeeklyReminderVisible] = useState<boolean>(false);
    const [modalNotesVisible, setModalNotesVisible] = useState<boolean>(false);

    const handleTimeFieldValue = (setFieldValue: any) => {
        setFieldValue('time', `${selectedHour}:${selectedMinute}`)
    }

    const handleSortRepeatDays = () => {
        const sortedDays = repeatDays.sort((a: number, b: number) => a - b)

        if (sortedDays[0] == 1 && sortedDays.length > 1) {
            const rotatedList = sortedDays.slice(1).concat(sortedDays[0]);
            setValue('repeatDays', rotatedList)
        }
    }

    const renderItem: ListRenderItem<DayItem> = ({ item }) => (

        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => {
                const temp = repeatDays.includes(item.value) ?
                    repeatDays.filter(repeatDay => repeatDay != item.value)
                    : [...repeatDays, item.value]
                setValue('repeatDays', temp)
            }}
        >
            <Text style={styles.itemText}>{item.day}</Text>
            {repeatDays.includes(item.value) && (
                <Text style={styles.checkMark}>✓</Text>
            )}
        </TouchableOpacity>
    );

    useEffect(() => {
        reset(formValue)
    }, [formValue])

    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: 20 }}>
                {/* Time Selection */}
                <View style={styles.timePickerContainer}>
                    <CustomWheelPicker
                        data={hours}
                        width={width * 0.4}
                        itemHeight={40}
                        initialSelectedIndex={hours.indexOf(selectedHour)}
                        onValueChange={({ index, item }) => {
                            setSelectedHour(hours[index])
                            setValue('time', `${hours[index]}:${selectedMinute}`)
                        }}
                    />
                    <CustomWheelPicker
                        data={minutes}
                        width={width * 0.4}
                        itemHeight={40}
                        initialSelectedIndex={minutes.indexOf(selectedMinute)}
                        onValueChange={({ index, item }) => {
                            setSelectedMinute(minutes[index])
                            setValue('time', `${selectedHour}:${minutes[index]}`)
                        }}
                    />
                </View>

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
                                    repeatDays.length > 0 ?
                                        repeatDays.length > 2 ? ['Setiap ', repeatDays.slice(0, 2).map((num) => dayMapping[num]).join(', '), ' ...']
                                            :
                                            ['Setiap ', repeatDays.map((num) => dayMapping[num]).join(', ')]
                                        :
                                        'Sekali'
                                }
                            </Text>
                            <FontAwesome name="chevron-right" size={FontSize.md} color="black" />
                        </TouchableOpacity>
                    </View>

                    <CustomModal
                        isVisible={modalWeeklyReminderVisible}
                        toggleModal={() => setModalWeeklyReminderVisible(false)}
                    >
                        <FlatList
                            data={DAYS}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                            style={{ paddingHorizontal: 12 }}
                        />

                        <CustomButton
                            title='Simpan'
                            onPress={() => {
                                setModalWeeklyReminderVisible(false)
                                handleSortRepeatDays()
                            }}
                        />
                    </CustomModal>
                </View>

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
                            {notes.length == 0 ? 'Tidak ada catatan' : notes.length > 7 ? notes.slice(0, 7) + '...' : notes.slice(0, 7)}
                        </Text>
                    </TouchableOpacity>

                    <CustomModal
                        isVisible={modalNotesVisible}
                        toggleModal={() => setModalNotesVisible(false)}
                    >
                        <View style={{ flex: 1, justifyContent: 'space-between' }}>
                            <CustomTextInput
                                style={styles.textInput}
                                label='Catatan'
                                placeholder='Masukkan catatan di bagian ini'
                                value={notes}
                                onChangeText={(value) => setValue('notes', value)}
                            />

                            <CustomButton
                                title='Simpan'
                                onPress={() => setModalNotesVisible(false)}
                            />
                        </View>
                    </CustomModal>
                </View>

                {/* Reminder Type Selection */}
                <View style={styles.reminderTypeContainer}>
                    <Text style={styles.label}>Jenis Pengingat</Text>
                    <View style={styles.reminderTypeButtonContainer}>
                        {reminderType.map((option) => (
                            <TouchableOpacity
                                key={option.label}
                                style={[
                                    styles.reminderTypeButton,
                                    reminderTypeValue.includes(option.value) && styles.selectedTypeButton,
                                ]}
                                onPress={() => {
                                    if (reminderTypeValue.includes(option.value)) {
                                        setValue(
                                            'reminderType',
                                            reminderTypeValue.filter((item: number) => item !== option.value)
                                        );
                                    } else {
                                        setValue('reminderType', [...reminderTypeValue, option.value]);
                                    }
                                }}
                            >
                                <Text
                                    style={[
                                        styles.reminderTypeText,
                                        reminderTypeValue.includes(option.value) && { color: '#fff' }
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
            {children({ handleSubmit, disabled: false })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'space-between',
    },
    label: {
        marginTop: 12,
        marginBottom: 3,
        fontSize: FontSize.md,
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
        width: '32%',
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
        fontSize: FontSize.md,
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
        fontSize: FontSize.md,
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
        alignItems: 'center',
        gap: 4,
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
