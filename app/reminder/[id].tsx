import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router'
import useAsyncStorage from '@/hooks/useAsyncStorage';
import ReminderForm from './ReminderForm';
import CustomButton from '@/components/CustomButton';
import * as Notifications from 'expo-notifications';
import CustomButtonNew from '@/components/CustomButtonNew';
import CustomHeader from '@/components/CustomHeader';
import Wrapper from '@/components/Layout/Wrapper';
import useReminder, { Reminder, ReminderStorage } from '@/hooks/useReminder';
import { useCustomAlert } from '../context/CustomAlertProvider';

export default function ReminderDetail() {
    const { showAlert } = useCustomAlert()
    const { id } = useLocalSearchParams();
    const { getReminderById, updateReminder, clearReminderById } = useReminder()

    const [getLoading, setGetLoading] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [reminder, setReminder] = useState<ReminderStorage>();

    const handleGetReminderDetail = async (id: string) => {
        setGetLoading(false);
        try {
            const res = await getReminderById(setGetLoading, id)
            setReminder(res)
        } catch (err) {
            console.log('Error get reminder:', err);
        } finally {
            setGetLoading(false);
        }
    }

    useEffect(() => {
        handleGetReminderDetail(String(id))
    }, [])

    const handleUpdateReminder = async (reminder: ReminderStorage) => {
        setUpdateLoading(false);
        try {
            const res = await updateReminder(reminder)
            router.navigate('/reminder')
        } catch (err) {
            console.log('Error update reminder:', err);
        } finally {
            setUpdateLoading(false);
        }
    }

    const handleDeleteReminder = async (id: string) => {
        setUpdateLoading(false);
        try {
            const res = await clearReminderById(id)
            router.navigate('/reminder')
        } catch (err) {
            console.log('Error update reminder:', err);
        } finally {
            setUpdateLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <CustomHeader title='Edit Pengingat' />
            <ReminderForm
                formValue={{
                    id: reminder ? reminder.id : '',
                    notifications: reminder ? reminder.notifications : [],
                    time: reminder ? reminder.time : '',
                    repeatDays: reminder ? reminder.repeatDays : [],
                    reminderTypes: reminder ? reminder.reminderTypes : [],
                    notes: reminder ? reminder.notes : '',
                    isEnabled: reminder ? reminder.isEnabled : false,
                }}
                setFormValue={setReminder}
            >
                {({ handleSubmit, disabled }) => (
                    <View style={{ padding: 16 }}>
                        <CustomButton
                            title='Simpan Perubahan'
                            disabled={disabled}
                            onPress={handleSubmit((values) => handleUpdateReminder(values))}
                            style={{ marginBottom: 4 }}
                            loading={updateLoading}
                        />
                        <CustomButton
                            title='Hapus log'
                            type='delete'
                            onPress={handleSubmit((values) => {
                                showAlert('Apakah kamu ingin tetap melanjutkan untuk menghapus catatan ini', 'warning', undefined, () => handleDeleteReminder(values.id))
                            })}
                            loading={deleteLoading}
                        />
                    </View>
                )}
            </ReminderForm>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f8f9',
    },
});
