import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Reminder {
  id: string;
  time: string;
  days: string;
  description: string;
  category: string;
  isEnabled: boolean;
}

export default function App() {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', time: '08.41', days: 'Senin, Selasa, Rabu, Kamis, Jumat, Sabtu', description: 'Setiap Senin, Selasa, Rabu, Kamis, Jumat, Sabtu', category: 'Gula darah', isEnabled: false },
    { id: '2', time: '13.41', days: '', description: 'Setiap hari', category: 'Olahraga', isEnabled: true },
    { id: '3', time: '10.41', days: '', description: 'Setelah makan abis itu ambil darah', category: 'Gula darah', isEnabled: true },
    { id: '4', time: '17.20', days: 'Senin, Selasa, Rabu, Kamis, Jumat, Sabtu', description: 'Setiap Senin, Selasa, Rabu, Kamis, Jumat, Sabtu', category: 'Gula darah', isEnabled: false },
    { id: '5', time: '17.20', days: 'Senin, Selasa, Rabu, Kamis, Jumat, Sabtu', description: 'Setiap Senin, Selasa, Rabu, Kamis, Jumat, Sabtu', category: 'Olahraga', isEnabled: false },
  ]);

  // Toggle switch function
  const toggleSwitch = (id: string) => {
    setReminders((prevReminders) =>
      prevReminders.map((reminder) =>
        reminder.id === id ? { ...reminder, isEnabled: !reminder.isEnabled } : reminder
      )
    );
  };

  // Group reminders by time
  const groupRemindersByTime = () => {
    const grouped = reminders.reduce((acc, reminder) => {
      if (!acc[reminder.time]) {
        acc[reminder.time] = [];
      }
      acc[reminder.time].push(reminder);
      return acc;
    }, {} as { [key: string]: Reminder[] });

    return Object.entries(grouped).map(([time, reminders]) => ({ time, reminders }));
  };

  const handleNavigate = async () => {
    // await storeData('glucoseLogDate', formatDatetoString(selectedDate))
    router.navigate('/(notes)/reminder/AddReminder')
  }

  // Render each reminder item
  const renderItem = ({ item }: { item: { time: string; reminders: Reminder[] } }) => (
    <View style={styles.reminderContainer}>
      <View style={styles.reminderLeft}>
        {/* Render categories if there are multiple */}
        <View style={styles.categoryContainer}>
          {item.reminders.map((reminder) => (
            <Text key={reminder.id} style={styles.category}>
              {reminder.category}
            </Text>
          ))}
        </View>
        <Text style={styles.time}>{item.time}</Text>
        <Text style={styles.description}>{item.reminders[0].description}</Text>
        {item.reminders[0].days && <Text style={styles.days}>{item.reminders[0].days}</Text>}
      </View>
      {/* Render the switch for the first item in the grouped reminders */}
      <Switch
        value={item.reminders[0].isEnabled}
        onValueChange={() => toggleSwitch(item.reminders[0].id)}
        trackColor={{ false: '#767577', true: '#f4b400' }}
        thumbColor={item.reminders[0].isEnabled ? '#ff9800' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <FontAwesome name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengingat</Text>
        <TouchableOpacity onPress={handleNavigate}>
          <FontAwesome name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Jadwal Pengingat</Text>

      <FlatList
        data={groupRemindersByTime()}
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
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#d0663e',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
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
