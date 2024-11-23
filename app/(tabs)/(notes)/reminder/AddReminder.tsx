import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import ReminderForm from './ReminderForm';
import CustomButton from '@/components/CustomButton';
import useAsyncStorage from '@/hooks/useAsyncStorage';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function AddReminder() {
  const { storeObjectData, getAllKeys, deleteDataByKey } = useAsyncStorage()
  const [storeLoading, setStoreLoading] = useState(false)

  const generateUniqueKey = (values: ReminderFormValues): string => {
    const formattedTime = values.time.replace(':', '');
    const formattedRepeatDays = values.repeatDays.sort((a, b) => a - b).join('');
    const reminderType = values.reminderType.sort((a, b) => a - b).join('');
    
    return `reminders${formattedTime}-${formattedRepeatDays}-${reminderType}`;
  };

  const reminderNotifications = async (reminder: ReminderFormValues, day: number) => {
    const [hours, minutes] = reminder.time.split(':').map(Number);
    const title = reminder.reminderType.join(' ');
    const body = reminder.notes;
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: { id: reminder.id },
      },
      trigger: {
        weekday: day,
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });

    return notificationId
  };

  const handleSaveReminder = async (values: ReminderFormValues) => {
    setStoreLoading(true);
    try {
      var uniqueKey = generateUniqueKey(values);
      
      console.log("Unique Key", uniqueKey)
      console.log("Values", values)

      const keys = await getAllKeys();
      const reminderKeys: string[] = []
      
      keys.forEach((key) => {
        if (key.startsWith('reminder')){
          reminderKeys.push(key)
        }
      });

      const storedKeys = uniqueKey.replace('reminders', '');
      const [time, repeatDays, type] = storedKeys.split('-');

      function combineUniqueDigits(str1:string, str2:string) {
        const combinedDigits = new Set();
      
        for (const digit of str1) {
          combinedDigits.add(digit);
        }
      
        for (const digit of str2) {
          combinedDigits.add(digit);
        }
      
        return Array.from(combinedDigits).join('');
      }

      var previousKey = ''

      keys.forEach((key) => {
        const tempKey = key.replace('reminders', '')
        if (tempKey.split('-')[0] === time) {
          if (tempKey.split('-')[1] === repeatDays && tempKey.split('-')[2] !== type) {
            previousKey = key;

            const combinedType = combineUniqueDigits(type, tempKey.split('-')[2])
            values.reminderType = combinedType.split('').map(Number)

            uniqueKey = generateUniqueKey(values);
            console.log("uniqueKey: ", uniqueKey);

          } else if (tempKey.split('-')[2] === type && tempKey.split('-')[1] !== repeatDays) {
            previousKey = key;

            const combinedRepeatDays = combineUniqueDigits(repeatDays, tempKey.split('-')[1])
            values.repeatDays = combinedRepeatDays.split('').map(Number)
            
            uniqueKey = generateUniqueKey(values);
            console.log("uniqueKey: ", uniqueKey);

          } else {
            console.log("elseee")
            return
          }
        }
      });

      previousKey !== '' ? await deleteDataByKey(previousKey) : '';

      values.id = uniqueKey
      values.reminderType = values.reminderType.sort((a, b) => a - b);
      values.repeatDays = values.repeatDays.sort((a, b) => a - b);

      console.log("last value: ", values)
      
      for (const day of values.repeatDays) { 
        values.notificationId.push(await reminderNotifications(values, day))
      }

      await storeObjectData(uniqueKey, values);
      console.log('Reminder saved successfully!');
      // console.log(await AsyncStorage.getAllKeys())
      // await AsyncStorage.clear();
    } catch (err) {
      console.log('Error saving reminder:', err);
    } finally {
      setStoreLoading(false);
    }
  };

  const [formValue, setFormValue] = useState<ReminderFormValues>({
    id: '',
    notificationId: [],
    reminderType: [],
    time: '',
    repeatDays: [],
    notes: '',
    isEnabled: true,
  })

  return (
    <View style={styles.container}>
      <ReminderForm
        formValue={formValue}
        setFormValue={setFormValue}
      >
        {({ values, handleSubmit }) => (
          <CustomButton title='Tambahkan Pengingat' size='lg'
            disabled={false}
            onPress={() => {
              handleSubmit();
              handleSaveReminder(values);
              router.navigate('/(notes)/reminder/');
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