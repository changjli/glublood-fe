import { View, Text, Alert, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import Wrapper from '@/components/Layout/Wrapper'
import CustomText from '@/components/CustomText'
import MedicineLogForm from './MedicineLogForm'
import useMedicineLog from '@/hooks/api/logs/medicine/useMedicineLog'
import { router, useLocalSearchParams } from 'expo-router'
import axios from 'axios'
import CustomButton from '@/components/CustomButton'
import CustomHeader from '@/components/CustomHeader'
import CustomButtonNew from '@/components/CustomButtonNew'

export default function MedicineLogDetailPage() {
    const { id } = useLocalSearchParams()
    const { getMedicineLogDetail, updateMedicineLog, deleteMedicineLog } = useMedicineLog()

    const [formValue, setFormValue] = useState<StoreMedicineLogReq>({
        date: '',
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
            router.navigate('/(tabs)/(notes)')
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
            router.navigate('/(tabs)/(notes)')
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
        <>
            <CustomHeader title='Edit log obat' />
            <Wrapper style={styles.container}>
                <MedicineLogForm
                    formValue={formValue}
                    setFormValue={setFormValue}
                >
                    {({ handleSubmit, disabled }) => (
                        <View>
                            <CustomButtonNew
                                store={true}
                                imgSrc={require('@/assets/images/icons/pencil.png')}
                                label='Simpan Perubahan'
                                onPress={handleSubmit(data => handleUpdateMedicineLog({
                                    id: Number(id),
                                    ...data,
                                }))}
                                disabled={disabled}
                            />
                            <CustomButtonNew
                                store={false}
                                imgSrc={require('@/assets/images/icons/trash-bin.png')}
                                label='Hapus log'
                                onPress={() => handleDeleteMedicineLog(Number(id))}
                            />
                        </View>
                    )}
                </MedicineLogForm>
            </Wrapper>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'white',
    },
});