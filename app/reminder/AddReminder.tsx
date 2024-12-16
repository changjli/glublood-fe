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

export default function AddReminder() {
  const { storeObjectData, getAllKeys, deleteDataByKey } = useAsyncStorage()
  const [storeLoading, setStoreLoading] = useState(false)

  const generateUniqueKey = (values: ReminderFormValues): string => {
    const formattedTime = values.time.replace(':', '');
    const formattedRepeatDays = values.repeatDays.sort((a, b) => a - b).join('');
    const reminderType = values.reminderType.sort((a, b) => a - b).join('');

    return `reminders${formattedTime}-${formattedRepeatDays}-${reminderType}`;
  };

  const reminderNotificationsRepeat = async (reminder: ReminderFormValues, day: number, type: number) => {
    const [hours, minutes] = reminder.time.split(':').map(Number);
    var body = ''

    switch (type) {
      case 1:
        body = 'Yuk udah saatnya untuk pengecekan gula darah nih! 🤗';
        break;
      case 2:
        body = 'Jangan lupa untuk makan dan minum yaa! 🤗';
        break;
      case 3:
        body = 'Yuk udah saatnya untuk olahraga biar kesehatan tubuhmu terjaga!🤗';
        break;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Ding! Dong! Waktunya tiba ⏰",
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

  const reminderNotificationsSingle = async (reminder: ReminderFormValues, type: number) => {
    const [hours, minutes] = reminder.time.split(':').map(Number);
    const year = new Date().getFullYear()
    const month = new Date().getMonth()
    const day = new Date().getDate()

    var body = ''

    switch (type) {
      case 1:
        body = 'Yuk udah saatnya untuk pengecekan gula darah nih! 🤗';
        break;
      case 2:
        body = 'Jangan lupa untuk makan dan minum yaa! 🤗';
        break;
      case 3:
        body = 'Yuk udah saatnya untuk olahraga biar kesehatan tubuhmu terjaga!🤗';
        break;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Ding! Dong! Waktunya tiba ⏰",
        body: body,
        data: { id: reminder.id },
      },
      trigger: {
        date: new Date(year, month, day, hours, minutes, 0),
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
        if (key.startsWith('reminder')) {
          reminderKeys.push(key)
        }
      });

      const storedKeys = uniqueKey.replace('reminders', '');
      const [time, repeatDays, type] = storedKeys.split('-');

      function combineUniqueDigits(str1: string, str2: string) {
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

      if (values.repeatDays[0] == 1 && values.repeatDays.length > 1) {
        const rotatedList = values.repeatDays.slice(1).concat(values.repeatDays[0]);
        values.repeatDays = rotatedList
      }

      if (values.repeatDays.length > 0) {
        for (const type of values.reminderType) {
          for (const day of values.repeatDays) {
            values.notificationId.push(await reminderNotificationsRepeat(values, day, type))
          }
        }
      } else {
        for (const type of values.reminderType) {
          values.notificationId.push(await reminderNotificationsSingle(values, type))
        }
      }

      console.log("[AddReminder] Last value: ", values)

      await storeObjectData(uniqueKey, values);
      console.log('Reminder saved successfully!');
      router.navigate('/reminder/');
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
        {({ values, handleSubmit, errors }) => (
          <View style={{ marginHorizontal: 15 }}>
            <CustomButtonNew
              store={true}
              imgSrc={require('@/assets/images/icons/plus.png')}
              label='Simpan Catatan'
              disabled={Object.keys(errors).length > 0}
              onPress={() => {
                handleSaveReminder(values);
              }}
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