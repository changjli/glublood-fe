import { Colors } from '@/constants/Colors';
import { FontSize, FontFamily } from '@/constants/Typography';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import CustomMonthYearPicker from './CustomMonthYearPicker';

const today = new Date()
const currentMonth = today.getMonth()
const currentYear = today.getFullYear()

const dayInterpreter = (day: number) => {
    const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    return weekDays.find((weekDay, i) => i == day)
}

const daysInMonth = (month: number, year: number) => {
    const lastDay = new Date(year, month + 1, 0).getDate();

    const days = []

    for (let i = 1; i <= lastDay; i++) {
        days.push(new Date(year, month, i))
    }

    return days
}

type DayItem = {
    id: string,
    day: Date,
}

type DayItemProps = {
    item: DayItem
    onPress: () => void
    backgroundColor: string,
    color: string,
}

const DayItem = ({ item, onPress, backgroundColor, color }: DayItemProps) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.itemContainer, { backgroundColor }]}>
            <Text style={[styles.dayText, { color }]}>
                {dayInterpreter(item.day.getDay())}
            </Text>
            <Text style={[styles.dateText, { color }]}>
                {item.day.getDate()}
            </Text>
        </TouchableOpacity>
    )
}

type CustomCalendarProps = {
    value: Date,
    onChange: (param: Date) => void
}

export default function CustomCalendar({ value, onChange }: CustomCalendarProps) {

    const flatListRef = useRef<FlatList<DayItem>>(null)

    const [days, setDays] = useState(daysInMonth(value.getMonth(), value.getFullYear()))
    const selectDays = days.map((day, i) => ({
        id: String(i),
        day,
    }))

    const [selectedMonth, setSelectedMonth] = useState(value.getMonth())
    const [selectedYear, setSelectedYear] = useState(value.getFullYear())
    const [selectedDay, setSelectedDay] = useState(value.getDate());

    const renderDayItem = ({ item }: { item: DayItem }) => {
        const backgroundColor = item.day.getDate() == selectedDay ? Colors.light.primary : 'transparent'
        const color = item.day.getDate() == selectedDay ? 'white' : Colors.light.primary

        return (<DayItem {...{
            item,
            onPress: () => setSelectedDay(item.day.getDate()),
            backgroundColor,
            color,
        }} />)
    }

    const handleScroll = (index: number) => {
        if (flatListRef.current) {
            try {
                flatListRef.current.scrollToIndex({ index, animated: true });
            } catch (error) {
                console.warn('Index out of range', error);
            }
        }
    }

    useEffect(() => {
        setDays(daysInMonth(selectedMonth, selectedYear))
        setTimeout(() => handleScroll(selectedDay - 1), 1000)
    }, [selectedMonth, selectedYear])

    useEffect(() => {
        onChange(new Date(selectedYear, selectedMonth, selectedDay))
    }, [selectedDay])

    return (
        <View style={{ padding: 16 }}>
            <View style={{ marginBottom: 20 }}>
                <CustomMonthYearPicker
                    month={selectedMonth}
                    year={selectedYear}
                    setMonth={setSelectedMonth}
                    setyear={setSelectedYear}
                />
            </View>
            <FlatList
                ref={flatListRef}
                data={selectDays}
                renderItem={renderDayItem}
                keyExtractor={item => item.id}
                extraData={selectedDay}
                horizontal
            />
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        alignItems: 'center',
        margin: 2,
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 10,
    },
    dayText: {
        fontFamily: FontFamily.medium,
        fontSize: FontSize.md,
    },
    dateText: {
        fontFamily: FontFamily.heavy,
        fontSize: FontSize.lg,
    }
})
