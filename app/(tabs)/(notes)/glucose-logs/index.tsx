import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import CustomCalendar from '../CustomCalendar';
import DynamicTextComponent from '@/components/TrackingBackground';
import { Link, router } from 'expo-router';
import useGlucose from '@/hooks/api/logs/glucose/useGlucoseLog';
import axios from 'axios'
import { useIsFocused } from '@react-navigation/native';
import { formatDatetoString } from '@/utils/formatDatetoString';
import GlucoseLogList from './GlucoseLogList';
import useAsyncStorage from '@/hooks/useAsyncStorage';

export default function Glucose() {
  const { getGlucoseLogByDate } = useGlucose()
  const { storeData } = useAsyncStorage()
  const [glucoseLogLoading, setGlucoseLogLoading] = useState(false)
  const [glucoseLog, setGlucoseLog] = useState<GetGlucoseLogRes[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const isFocused = useIsFocused()

  const handleGetGlucoseLog = async (date: string) => {
    try {
        const res = await getGlucoseLogByDate(setGlucoseLogLoading, date)
        setGlucoseLog(res.data)
        console.log("[index] -> Glucose Log by Date", res.data)
    } catch (err) {
      setGlucoseLog([])
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

  const handleNavigate = async () => {
    await storeData('glucoseLogDate', formatDatetoString(selectedDate))
    router.navigate('/(notes)/glucose-logs/AddGlucoseLog')
  }

  useEffect(() => {
    if (isFocused) {
      handleGetGlucoseLog(formatDatetoString(selectedDate))
    }
  }, [selectedDate, isFocused])
    
  useEffect(() => {
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();

      const formattedDate = `${day}/${month}/${year}`;
  }, [selectedDate])

  return (
    <ScrollView style={{ height: '100%' }}>
      <DynamicTextComponent img="" text="Gula Darah" />
      <CustomCalendar value={selectedDate} onChange={setSelectedDate} />
      <View style={styles.logContainer}>
        <View style={styles.logHeaderContainer}>
          <Text style={{ fontSize: 24, fontFamily: 'Helvetica-Bold'}}>Detail Log Gula Darah</Text>
          <TouchableOpacity style={styles.headerAddButton} onPress={handleNavigate}>
            <FontAwesome name='plus' size={16} color="white" />
          </TouchableOpacity>
        </View>
        <View style={{ width: '100%'}}>
          <GlucoseLogList
              data={glucoseLog}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  logContainer: {
      width: '100%',
      height: '100%',
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