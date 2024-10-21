import { View, Text, Alert, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import Wrapper from '@/components/Layout'
import CustomText from '@/components/CustomText'
import MedicineLogForm from './MedicineLogForm'
import useMedicineLog from '@/hooks/api/logs/medicine/useMedicineLog'
import { router, useLocalSearchParams } from 'expo-router'
import axios from 'axios'
import CustomButton from '@/components/CustomButton'

export default function ExerciseLogDetailPage() {
    const { id } = useLocalSearchParams()
    const { getMedicineLogDetail, updateMedicineLog, deleteMedicineLog} = useMedicineLog()

    const [formValue, setFormValue] = useState<StoreMedicineLogReq>({
        date: new Date(),
        name: '',
        time: '',
        amount: 0,
        type: '',
        notes: '',
    })
    const [loading, setLoading] = useState(false)

    const handleGetMedicineLogDetail = async (id: number) => {
        try {
            const res = await getMedicineLogDetail(setLoading, id)
            setFormValue(res.data)
        } catch (err) {
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

    const handleUpdateMedicineLog = async (payload: UpdateMEdicineLogReq) => {
        try {
            const res = await updateMedicineLog(setLoading, payload)
            router.navigate('/(notes)/medicine')
        } catch (err) {
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

    const handleDeleteMedicineLog = async (id: number) => {
        try {
            const res = await deleteMedicineLog(setLoading, id)
            router.navigate('/(notes)/medicine')
        } catch (err) {
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
        handleGetMedicineLogDetail(Number(id))
    }, [])

    return (
        <ScrollView>
            <Wrapper style={ styles.container }>
                <CustomText size='xl' weight='heavy'>Tambah log gula darah</CustomText>
                <MedicineLogForm
                    formValue={formValue}
                    setFormValue={setFormValue}
                >
                    {({ values, handleSubmit }) => (
                        <View>
                            <CustomButton
                                title='Simpan perubahan'
                                size='md'
                                style={{ marginBottom: 10 }}
                                disabled={JSON.stringify(values) == JSON.stringify(formValue)}
                                loading={loading}
                                onPress={() => {
                                    handleSubmit()
                                    handleUpdateMedicineLog({
                                        id: Number(id),
                                        ...values,
                                    })
                                }}
                            />
                            <CustomButton
                                title='Hapus log'
                                size='md'
                                loading={loading}
                                onPress={() => handleDeleteMedicineLog(Number(id))}
                            />
                        </View>
                    )}
                </MedicineLogForm>
            </Wrapper>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#EAF3F4', 
    },
});