import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import ReminderForm from './ReminderForm';
import CustomButton from '@/components/CustomButton';
import useAsyncStorage from '@/hooks/useAsyncStorage';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import CustomButtonNew from '@/components/CustomButtonNew';
import CustomHeader from '@/components/CustomHeader';
import useReminder, { Reminder } from '@/hooks/useReminder';
import { useCustomAlert } from '../context/CustomAlertProvider';

export default function AddReminder() {
  const [storeLoading, setStoreLoading] = useState(false)
  const { createReminder } = useReminder()
  const { showAlert } = useCustomAlert()

  const [formValue, setFormValue] = useState<Reminder>({
    reminderTypes: [],
    time: '00:00',
    repeatDays: [],
    notes: '',
    isEnabled: true,
  })

  const handleCreateReminder = async (value: Reminder) => {
    setStoreLoading(true);
    try {
      const res = await createReminder(value)
      router.navigate('/reminder')
    } catch (err) {
      showAlert('Error creating reminder', 'error')
      console.log('Error create reminder:', err);
    } finally {
      setStoreLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <CustomHeader title='Tambahkan Pengingat' />
      <ReminderForm
        formValue={formValue}
        setFormValue={setFormValue}
      >
        {({ handleSubmit, disabled }) => (
          <View style={{ marginHorizontal: 15 }}>
            <CustomButton
              title='Simpan Catatan'
              disabled={disabled}
              onPress={handleSubmit((values) => handleCreateReminder(values))}
              style={{ marginBottom: 16 }}
              loading={storeLoading}
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