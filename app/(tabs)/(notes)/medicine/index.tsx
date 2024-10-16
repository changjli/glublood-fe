import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import CustomCalendar from '../CustomCalendar';
import DynamicTextComponent from '../../../../components/TrackingBackground';
import { Link, router } from 'expo-router';

export default function Medicine() {
  const [hasLog, setHasLog] = useState(false); // Assume no logs by default
  const [medicineLog, setMedicineLog] = useState({
    time: '09:41 AM',
    name: 'Nodiabet',
    dosage: '2 Tablet', 
    instructions: 'Dimakan sebelum sarapan',
  });
    
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    
  useEffect(() => {
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();

      const formattedDate = `${day}/${month}/${year}`;

      console.log(formattedDate)

      // handleGetDailyCalories(formattedDate)
      // handleGetFoodLog(formattedDate)
  }, [selectedDate])

  return (
    <View style={{ height: '100%' }}>
      <DynamicTextComponent text="Obat" />
      <CustomCalendar value={selectedDate} onChange={setSelectedDate} />
      <View style={styles.logContainer}>
        <View style={styles.logHeaderContainer}>
          <Text style={{ fontSize: 24, fontFamily: 'Helvetica-Bold'}}>Detail Log Obat</Text>
          <TouchableOpacity style={styles.headerAddButton} onPress={() => router.navigate('/(notes)/medicine/AddMedicineLog')}>
            <FontAwesome name='plus' size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logContainer: {
      width: '100%',
      padding: 16,
      backgroundColor: '#FFF8E1',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      alignItems: 'center',
      flex: 1,
  },
  logHeaderContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  logHeaderText: {
      fontSize: 20,
      fontFamily: 'Helvetica-Bold',
  },
    headerAddButton: {
      padding: 8,
      width: 30,
      height: 30,
      backgroundColor: '#DA6E35',
      borderRadius: 5,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
  },
})