import { View, Text } from 'react-native'
import React, { useState } from 'react'

export default function index() {

    const [city, setCity] = useState('')

    const [selectedDate, setSelectedDate] = useState<Date>(new Date())

    const CITIES = 'Jakarta,Bandung,Sumbawa,Taliwang,Lombok,Bima'.split(',');

    return (
        <View style={{ padding: 16 }}>
            {/* <CustomTimePicker />
            <CustomCalendar value={selectedDate} onChange={setSelectedDate} /> */}
        </View>
    )
}