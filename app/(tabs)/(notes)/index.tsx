import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Link } from 'expo-router';

export default function index() {

    const [city, setCity] = useState('')

    const [selectedDate, setSelectedDate] = useState<Date>(new Date())

    const CITIES = 'Jakarta,Bandung,Sumbawa,Taliwang,Lombok,Bima'.split(',');

    return (
        <View style={{ padding: 16 }}>
            <Link href="/(notes)/food-logs">food</Link>
            <Link href="/(notes)/exercise-logs">exercise</Link>
            <Link href="/(notes)/medicine">medicine</Link>
        </View>
    )
}