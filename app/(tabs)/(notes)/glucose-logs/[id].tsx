import { View, Text, Alert, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomText from '@/components/CustomText'
import { router, useLocalSearchParams } from 'expo-router'
import axios from 'axios'
import CustomButton from '@/components/CustomButton'
import useGlucoseLog from '@/hooks/api/logs/glucose/useGlucoseLog'
import GlucoseLogForm from './GlucoseLogForm'
import Wrapper from '@/components/Layout/Wrapper'

export default function GlucoseLogDetailPage() {
    const { id } = useLocalSearchParams()
    const { getGlucoseLogDetail, updateGlucoseLog, deleteGlucoseLog } = useGlucoseLog()

    const [formValue, setFormValue] = useState<StoreGlucoseLogReq>({
        date: '',
        glucose_rate: 0,
        time: '',
        time_selection: '',
        notes: '',
    })
    const [loading, setLoading] = useState(false)

    const handleGetGlucoseLogDetail = async (id: number) => {
        try {
            const res = await getGlucoseLogDetail(setLoading, id)
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

    const handleUpdateGlucoseLog = async (payload: UpdateGlucoseLogReq) => {
        try {
            const res = await updateGlucoseLog(setLoading, payload)
            router.navigate('/(notes)/glucose-logs')
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

    const handleDeleteGlucoseLog = async (id: number) => {
        try {
            const res = await deleteGlucoseLog(setLoading, id)
            router.navigate('/(notes)/glucose-logs')
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
        handleGetGlucoseLogDetail(Number(id))
    }, [])

    return (
        <ScrollView>
            <Wrapper style={styles.container}>
                <CustomText size='xl' weight='heavy'>Tambah log gula darah</CustomText>
                <GlucoseLogForm
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
                                    handleUpdateGlucoseLog({
                                        id: Number(id),
                                        ...values,
                                    })
                                }}
                            />
                            <CustomButton
                                title='Hapus log'
                                size='md'
                                loading={loading}
                                onPress={() => handleDeleteGlucoseLog(Number(id))}
                            />
                        </View>
                    )}
                </GlucoseLogForm>
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