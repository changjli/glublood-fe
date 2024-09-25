import { View, Text } from 'react-native'
import React, { useState } from 'react'
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import CustomTimePicker from './CustomTimePicker';
import CustomCalendar from './CustomCalendar';
import CustomMonthYearPicker from './CustomMonthYearPicker';
import DatePicker from 'react-native-modern-datepicker';

export default function index() {

    const [city, setCity] = useState('')

    const [selectedDate, setSelectedDate] = useState<Date>(new Date())

    const CITIES = 'Jakarta,Bandung,Sumbawa,Taliwang,Lombok,Bima'.split(',');

    return (
        <View style={{ padding: 16 }}>
            <CustomTimePicker />
            <CustomCalendar value={selectedDate} onChange={setSelectedDate} />
        </View>
    )
}