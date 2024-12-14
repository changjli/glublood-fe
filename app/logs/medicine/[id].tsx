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
import { useCustomAlert } from '@/app/context/CustomAlertProvider'

export default function MedicineLogDetailPage() {
    const { id } = useLocalSearchParams()
    const { getMedicineLogDetail, updateMedicineLog, deleteMedicineLog } = useMedicineLog()
    const { showAlert } = useCustomAlert()

    const [formValue, setFormValue] = useState<StoreMedicineLogReq>({
        date: '',
        name: '',
        time: '',
        amount: 0,
        type: '',
        notes: '',
    })
    const [loading, setLoading] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const handleGetMedicineLogDetail = async (id: number) => {
        try {
            const res = await getMedicineLogDetail(setLoading, id)
            setFormValue(res.data)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    showAlert('Invalid request. Please check your input.', 'error');
                } else if (status === 500) {
                    showAlert('A server error occurred. Please try again later.', 'error');
                } else {
                    // showAlert(`An error occurred: ${status}. Please try again later.`, 'error');
                }
            } else {
                console.log('Unexpected Error:', err);
                showAlert('Please check your internet connection.', 'error');
            }
        }
    }

    const handleUpdateMedicineLog = async (payload: UpdateMEdicineLogReq) => {
        try {
            const res = await updateMedicineLog(setUpdateLoading, payload)
            router.navigate('/(tabs)/(notes)')
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    showAlert('Invalid request. Please check your input.', 'error');
                } else if (status === 500) {
                    showAlert('A server error occurred. Please try again later.', 'error');
                } else {
                    // showAlert(`An error occurred: ${status}. Please try again later.`, 'error');
                }
            } else {
                console.log('Unexpected Error:', err);
                showAlert('Please check your internet connection.', 'error');
            }
        }
    }

    const handleDeleteMedicineLog = async (id: number) => {
        try {
            const res = await deleteMedicineLog(setDeleteLoading, id)
            router.navigate('/(tabs)/(notes)')
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    showAlert('Invalid request. Please check your input.', 'error');
                } else if (status === 500) {
                    showAlert('A server error occurred. Please try again later.', 'error');
                } else {
                    // showAlert(`An error occurred: ${status}. Please try again later.`, 'error');
                }
            } else {
                console.log('Unexpected Error:', err);
                showAlert('Please check your internet connection.', 'error');
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
                            <CustomButton
                                title='Simpan perubahan'
                                size='md'
                                style={{ marginBottom: 10 }}
                                disabled={disabled || deleteLoading}
                                loading={updateLoading}
                                onPress={handleSubmit(data => handleUpdateMedicineLog({
                                    id: Number(id),
                                    ...data,
                                }))}
                            />
                            <CustomButton
                                title='Hapus log'
                                size='md'
                                type='delete'
                                disabled={updateLoading}
                                loading={deleteLoading}
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