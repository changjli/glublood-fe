import { View, Text, Modal, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomTextInput from '@/components/CustomInput/CustomTextInput'
import { Colors } from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { FontSize } from '@/constants/Typography';
import { Link } from 'expo-router';
import CustomText from '@/components/CustomText';
import useMasterExercise from '@/hooks/api/master/exercises/useMasterExercise';
import axios from 'axios';

interface ExercisePickerProps {
    value: string
    onChange: (value: { exerciseName: string, caloriesPerKg: number }) => void
}

export default function ExercisePicker({ value, onChange }: ExercisePickerProps) {
    const { getMasterExercises } = useMasterExercise()

    const [modalVisible, setModalVisible] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('')
    const [masterExercises, setMasterExercises] = useState<GetMasterExerciseRes[]>([])
    const [getLoading, setGetLoading] = useState(false)

    const handleResetModal = () => {
        setModalVisible(false)
        setSearchKeyword('')
        setMasterExercises([])
    }

    const renderItem = ({ item, index }: {
        item: GetMasterExerciseRes
        index: number
    }) => {
        return (
            <TouchableOpacity style={styles.itemContainer} onPress={() => {
                onChange({ exerciseName: item.exercise_name, caloriesPerKg: item.calories_per_kg })
                handleResetModal()
            }}>
                <Text>{item.exercise_name}</Text>
            </TouchableOpacity>
        );
    };

    const handleGetMasterExercises = async (query: string) => {
        try {
            const res = await getMasterExercises(setGetLoading, query)
            const data: GetMasterExerciseRes[] = res.data
            setMasterExercises(data)
        } catch (err) {
            setMasterExercises([])
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    Alert.alert('Bad Request', 'Invalid request. Please check your input.');
                } else if (status === 500) {
                    Alert.alert('Server Error', 'A server error occurred. Please try again later.');
                } else {
                    // Alert.alert('Error', `An error occurred: ${status}. Please try again later.`);
                }
            } else {
                console.log('Unexpected Error:', err);
                Alert.alert('Network Error', 'Please check your internet connection.');
            }
        }
    }

    useEffect(() => {
        if (searchKeyword != '') {
            setTimeout(() => handleGetMasterExercises(searchKeyword), 300)
        } else {
            setMasterExercises([])
        }
    }, [searchKeyword])

    return (
        <View>
            <CustomTextInput
                label='Jenis olahraga'
                placeholder='Tekan untuk memilih aktivitas tubuh'
                onPress={() => setModalVisible(true)}
                value={value}
            />
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeaderContainer}>
                            <TouchableOpacity onPress={handleResetModal}>
                                <Text style={{ color: 'red' }}>Batal</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <CustomTextInput
                                value={searchKeyword}
                                onChangeText={setSearchKeyword}
                                postfix={searchKeyword == '' ? (
                                    <FontAwesome name='search' size={FontSize.md} />
                                ) : (
                                    <FontAwesome name='close' size={FontSize.md} />
                                )}
                            />
                            <FlatList
                                data={masterExercises}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor: 'red'
    },
    modalContainer: {
        width: '100%',
        height: '60%',
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
    },
    itemContainer: {
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'grey',
    }
})
