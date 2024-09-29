import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { View, Text, Modal, Button, TouchableOpacity, StyleSheet } from 'react-native';
import WheelPickerExpo from 'react-native-wheel-picker-expo';

const CustomTimePicker = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedHour, setSelectedHour] = useState('03');
    const [selectedMinute, setSelectedMinute] = useState('41');
    const [selectedPeriod, setSelectedPeriod] = useState('AM');

    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const periods = ['AM', 'PM'];

    return (
        <View>
            <Button title="Select Time" onPress={() => setModalVisible(true)} />
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeaderContainer}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={{ color: 'red' }}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={{ color: 'orange' }}>Lanjut</Text>
                            </TouchableOpacity>
                        </View>

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
                            <WheelPickerExpo
                                height={200}
                                width={70}
                                initialSelectedIndex={periods.indexOf(selectedPeriod)}
                                items={periods.map(period => ({ label: period, value: period }))}
                                onChange={({ index }) => setSelectedPeriod(periods[index])}
                                renderItem={({ label }) => (
                                    <Text style={[
                                        styles.timePickerText,
                                        label == selectedPeriod && styles.timePickerTextSelected
                                    ]}>
                                        {label}
                                    </Text>
                                )}
                                selectedStyle={styles.timePickerSelected}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
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
        marginBottom: 20
    },
    timePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    timePickerText: {
        color: Colors.light.secondary,
        fontFamily: 'Helvetica-Bold',
        fontSize: 28,
    },
    timePickerSelected: {
        borderWidth: 2,
        borderColor: Colors.light.primary,
    },
    timePickerTextSelected: {
        color: Colors.light.primary,
    }
})

export default CustomTimePicker;