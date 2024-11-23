import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import useAsyncStorage from '@/hooks/useAsyncStorage';
import * as Notifications from 'expo-notifications';
import { FontSize } from '@/constants/Typography';

export default function ReminderPage() {
  const { getAllKeys, getAllObjectData, storeObjectData } = useAsyncStorage()

  const [reminders, setReminders] = useState<ReminderFormValues[]>([]);

  useEffect(() => {
    const fetchReminders = async () => {
      const reminderData = await getAllReminderData();
      if (reminderData) {
        const remindersArray = Object.values(reminderData) as ReminderFormValues[];
        setReminders(remindersArray);
      }
    };

    fetchReminders();
  }, []);

  const getAllReminderData = async () => { 
    const keys = await getAllKeys();
    const reminderKeys: string[] = []
    
    keys.forEach((key) => {
        if (key.startsWith('reminder')){
        reminderKeys.push(key)
        }
    });

    const reminderData = await getAllObjectData(reminderKeys);
    
    return reminderData;
  }

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

    return notificationId;
  }

  const cancelNotifications = async (notificationIds: string[]) => {
    for (const id of notificationIds) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
  };

  const handleSwitchToggle = async (id: string, value: boolean) => {
    // Update the reminders state
    const updatedReminders = reminders.map((reminder) =>
      reminder.id === id ? { ...reminder, isEnabled: value } : reminder
    );
    setReminders(updatedReminders);

    const updatedReminder = updatedReminders.find((reminder) => reminder.id === id);

    if (updatedReminder) {
      if (value) {
        for (const day of updatedReminder.repeatDays) { 
          updatedReminder.notificationId.push(await reminderNotifications(updatedReminder, day))
        }

        await storeObjectData(updatedReminder.id, updatedReminder)
      } else {
        await cancelNotifications(updatedReminder.notificationId);
        updatedReminder.notificationId = [];
      }
    }
  };

  const mapReminderType = (value: number) => {
    switch (value) {
      case 1:
        return 'Gula Darah';
      case 2:
        return 'Obat';
      case 3:
        return 'Olahraga';
    }
  }

  const dayMapping: { [key: number]: string } = {
    1: 'Senin',
    2: 'Selasa',
    3: 'Rabu',
    4: 'Kamis',
    5: 'Jumat',
    6: 'Sabtu',
    7: 'Minggu'
  };

  // Render each reminder item
  const renderItem = ({ item }: { item: ReminderFormValues }) => (
    <TouchableOpacity
      style={styles.reminderContainer}
      onPress={() => router.navigate(`/(notes)/reminder/${item.id}`)}
      // onPress={() => router.navigate('/(notes)/reminder/TestNotification')}
    >
      <View style={styles.reminderLeft}>
        <View style={styles.categoryContainer}>
          {item.reminderType.map((type, index) => (
            <Text key={index} style={styles.category}>
              {mapReminderType(type)}
            </Text>
          ))}
        </View>
  
        <Text style={styles.time}>{item.time}</Text>
  
        {item.repeatDays.length > 0 &&
          (item.repeatDays.length == 7 ? <Text style={styles.days}>Setiap Hari</Text> : <Text style={styles.days}>Setiap {item.repeatDays.map((num) => dayMapping[num]).join(', ')}</Text>)
        }
        {item.notes && (
          <Text style={styles.days}>{item.notes}</Text>
        )}
      </View>
  
      <Switch
        value={item.isEnabled}
        onValueChange={(value) => handleSwitchToggle(item.id, value)}
        trackColor={{ false: '#767577', true: '#f4b400' }}
        thumbColor={false ? '#ff9800' : '#f4f3f4'}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.buttonNavigate}>
          <TouchableOpacity
            onPress={() => router.back()}  
          >
            <Ionicons name='arrow-back' size={40} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.navigate('/(notes)/reminder/AddReminder')}
            style={{
              paddingVertical: 5,
              paddingHorizontal: 7,
              backgroundColor: 'white',
              borderRadius: 5,
            }}
          >
            <FontAwesome name="plus" size={24} color="#DA6E35" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Pengingat</Text>
      </View>

      <Text style={styles.subtitle}>Jadwal Pengingat</Text>

      <FlatList
        data={reminders}
        renderItem={renderItem}
        keyExtractor={(item) => item.time}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f8f9',
  },
  header:{
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#d0663e',
  },
  buttonNavigate: {
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: 'white',
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
  },
  subtitle: {
    marginVertical: 15,
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e9f1f3',
    marginHorizontal: 20,
    marginVertical: 5,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  reminderLeft: {
    flex: 1,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  category: {
    backgroundColor: '#f4a261',
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginRight: 5,
  },
  time: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    color: '#555',
    fontSize: 14,
  },
  days: {
    color: '#555',
    fontSize: 14,
    marginTop: 4,
  },
});