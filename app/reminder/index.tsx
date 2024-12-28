import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import useAsyncStorage from '@/hooks/useAsyncStorage';
import * as Notifications from 'expo-notifications';
import { FontSize } from '@/constants/Typography';
import { useIsFocused } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import useReminder, { ReminderStorage } from '@/hooks/useReminder';
import CustomButton from '@/components/CustomButton';

export default function ReminderPage() {
  const { getAllReminder, clearAllReminder, toggleReminder } = useReminder()

  const isFocused = useIsFocused()

  const [reminders, setReminders] = useState<ReminderStorage[]>([]);
  const [getLoading, setGetLoading] = useState(false)
  const [toggleLoading, setToggleLoading] = useState(false)

  const handleGetAllReminder = async () => {
    const res = await getAllReminder(setGetLoading)
    setReminders(res ?? [])
  }

  useEffect(() => {
    handleGetAllReminder()
  }, [isFocused]);

  const handleToggleReminder = async (reminder: ReminderStorage) => {
    setToggleLoading(false);
    try {
      const updatedReminders = reminders.map((r) =>
        r.id === reminder.id ? { ...r, isEnabled: !reminder.isEnabled } : r
      );
      setReminders(updatedReminders);
      await toggleReminder(reminder)
    } catch (err) {
      console.log('Error toggle reminder:', err);
    } finally {
      setToggleLoading(false);
    }
  }

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
    1: 'Minggu',
    2: 'Senin',
    3: 'Selasa',
    4: 'Rabu',
    5: 'Kamis',
    6: 'Jumat',
    7: 'Sabtu',
  };

  // Render each reminder item
  const renderItem = ({ item }: { item: ReminderStorage }) => (
    <TouchableOpacity
      style={styles.reminderContainer}
      onPress={() => router.navigate(`/reminder/${item.id}`)}
    >
      <View style={[
        styles.reminderLeft,
        { opacity: item.isEnabled ? 1 : 0.5 }
      ]}
      >
        <View style={styles.categoryContainer}>
          {item.reminderTypes.map((type, index) => (
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
          <Text style={styles.days}>
            {
              item.notes.length > 23 ?
                [item.notes.slice(0, 25), ' ...']
                :
                item.notes
            }
          </Text>
        )}
      </View>

      <View style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}>
        <Switch
          value={item.isEnabled}
          onValueChange={(value) => handleToggleReminder(item)}
          trackColor={{ false: '#767577', true: '#da6e35' }}
          thumbColor={false ? '#ff9800' : '#f4f3f4'}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.buttonNavigate}>
          <TouchableOpacity
            onPress={() => router.back()}
          >
            <Ionicons name='arrow-back' size={FontSize['2xl']} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.navigate('/reminder/AddReminder')}
            style={{
              paddingVertical: 5,
              paddingHorizontal: 7,
              backgroundColor: 'white',
              borderRadius: 5,
            }}
          >
            <FontAwesome name="plus" size={FontSize.lg} color={Colors.light.primary} />
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
      <CustomButton
        title='Hapus semua'
        type='delete'
        disabled={reminders.length == 0}
        onPress={async () => {
          await clearAllReminder()
          handleGetAllReminder()
        }}
        style={{ marginHorizontal: 16, marginBottom: 8 }}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.primary,
  },
  buttonNavigate: {
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: 'white',
    fontSize: FontSize.xl,
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
    backgroundColor: 'white',
    elevation: 3,
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
    backgroundColor: Colors.light.primary,
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
