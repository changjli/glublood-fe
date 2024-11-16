import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import ReminderForm from './ReminderForm';
import CustomButton from '@/components/CustomButton';
import useAsyncStorage from '@/hooks/useAsyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function AddReminder() {
  const { storeObjectData } = useAsyncStorage()
  const [storeLoading, setStoreLoading] = useState(false)

  const generateUniqueKey = (values: ReminderFormValues): string => {
    type DayName = "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat" | "Sabtu" | "Minggu";

    const dayMap: Record<DayName, number> = {
      Senin: 1,
      Selasa: 2,
      Rabu: 3,
      Kamis: 4,
      Jumat: 5,
      Sabtu: 6,
      Minggu: 7,
    };

    const repeatDaysInteger = values.repeatDays.map(day => dayMap[day as DayName]);

    const formattedTime = values.time.replace(':', '');
    const formattedRepeatDays = repeatDaysInteger.sort((a, b) => a - b).join('');
    const reminderType = values.reminderType;
    
    return `reminders${formattedTime}-${formattedRepeatDays}-${reminderType}`;
  };

  const handleSaveReminder = async (values: ReminderFormValues) => {
    setStoreLoading(true);
    try {
      const uniqueKey = generateUniqueKey(values);
      
      console.log("Unique Key", uniqueKey)
      console.log("Values", values)
      
      await storeObjectData(uniqueKey, values);
      console.log('Reminder saved successfully!');
      const existingReminders = await AsyncStorage.getItem('reminders0100-13-3');
      console.log("Data", existingReminders)
    } catch (err) {
      console.log('Error saving reminder:', err);
    } finally {
      setStoreLoading(false);
    }
  };

  const [formValue, setFormValue] = useState<ReminderFormValues>({
    reminderType: [],
    time: '',
    repeatDays: [],
  })

  return (
    <View style={styles.container}>
      <ReminderForm
        formValue={formValue}
        setFormValue={setFormValue}
      >
        {({ values, handleSubmit }) => (
          <CustomButton title='+ Simpan catatan' size='md' onPress={() => {
            handleSubmit();
            handleSaveReminder(values);
          }} />
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