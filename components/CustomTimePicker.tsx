import CustomTextInput from '@/components/CustomInput/CustomTextInput';
import { Colors } from '@/constants/Colors';
import { FontSize } from '@/constants/Typography';
import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View, Text, Modal, Button, TouchableOpacity, StyleSheet } from 'react-native';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import CustomModal from './CustomModal';
import CustomText from './CustomText';

type CustomTimePickerProps = {
    value: string
    onChange: (value: string) => void
    error?: string | undefined
    label: string
}

const CustomTimePicker = ({ value, onChange, error, label }: CustomTimePickerProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedHour, setSelectedHour] = useState(value != '' ? value.split(':')[0] : '00');
    const [selectedMinute, setSelectedMinute] = useState(value != '' ? value.split(':')[1] : '00');

    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const periods = ['AM', 'PM'];

    const formatTime = () => {
        return `${selectedHour}:${selectedMinute}`
    }

    const handleNext = () => {
        onChange(formatTime())
        setModalVisible(!modalVisible)
    }

    useEffect(() => {
        setSelectedHour(value != '' ? value.split(':')[0] : '00')
        setSelectedMinute(value != '' ? value.split(':')[1] : '00')
    }, [value])

    return (
        <View>
            <CustomTextInput
                label={label}
                placeholder='Tekan untuk pilih waktu'
                postfix={(
                    <FontAwesome name='clock-o' size={FontSize.lg} />
                )}
                value={value}
                onPress={() => setModalVisible(true)}
                error={error}
            />

            <CustomModal
                isVisible={modalVisible}
                toggleModal={() => setModalVisible(false)}
                header={(
                    <View style={styles.modalHeaderContainer}>
                        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                            <CustomText size='sm' style={{ color: Colors.light.danger }}>Batal</CustomText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNext}>
                            <CustomText size='sm' style={{ color: Colors.light.primary }}>Lanjut</CustomText>
                        </TouchableOpacity>
                    </View>
                )}
                style={{ height: '40%' }}
            >
                <View style={styles.timePickerContainer}>
                    <WheelPickerExpo
                        height={200}
                        width={70}
                        initialSelectedIndex={hours.indexOf(selectedHour)}
                        items={hours.map(hour => ({ label: hour, value: hour }))}
                        onChange={({ index }) => setSelectedHour(hours[index])}
                        renderItem={({ label }) => (
                            <Text style={[
                                styles.timePickerText,
                                label == selectedHour && styles.timePickerTextSelected
                            ]}>
                                {label}
                            </Text>
                        )}
                        selectedStyle={styles.timePickerSelected}
                    />
                    <WheelPickerExpo
                        height={200}
                        width={70}
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
                        selectedStyle={styles.timePickerSelected}
                    />
                </View>
            </CustomModal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        width: '100%',
        backgroundColor: 'white',
        padding: 16,
    },
    modalHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    timePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    timePickerText: {
        color: Colors.light.secondary,
        fontFamily: 'Helvetica-Bold',
        fontSize: 24,
    },
    timePickerSelected: {
        borderWidth: 2,
        borderColor: Colors.light.primary,
    },
    timePickerTextSelected: {
        color: Colors.light.primary,
        fontSize: 28,
    }
})

export default CustomTimePicker;