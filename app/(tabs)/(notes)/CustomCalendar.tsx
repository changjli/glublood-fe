import { Colors } from '@/constants/Colors';
import { Size, Weight } from '@/constants/Typography';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import CustomMonthYearPicker from './CustomMonthYearPicker';

const today = new Date()
const currentMonth = today.getMonth()
const currentYear = today.getFullYear()

const dayInterpreter = (day: number) => {
    const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    return weekDays.find((weekDay, i) => i == day)
}

const daysInMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    const days = []

    for (let i = firstDay; i <= lastDay; i.setDate(i.getDate() + 1)) {
        days.push(new Date(i))
    }

    return days
}

type CustomCalendarProps = {
    value: Date,
    onChange: (param: Date) => void
}

const CustomCalendar = ({ value, onChange }: CustomCalendarProps) => {
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

    const [days, setDays] = useState(daysInMonth(8, 2024))
    const selectDays = days.map((day, i) => ({
        id: String(i),
        day,
    }))

    const [selectedMonth, setSelectedMonth] = useState(value.getMonth())
    const [selectedYear, setSelectedYear] = useState(value.getFullYear())
    const [selectedDay, setSelectedDay] = useState(value.getDate());

    const DayItem = ({ item, onPress, backgroundColor, color }: DayItemProps) => {
        const styles = StyleSheet.create({
            container: {
                alignItems: 'center',
                margin: 2,
                paddingHorizontal: 10,
                paddingVertical: 2,
                borderRadius: 10,
            },
            dayText: {
                fontFamily: Weight.medium,
                fontSize: Size.md,
            },
            dateText: {
                fontFamily: Weight.heavy,
                fontSize: Size.lg,
            }
        })

        return (
            <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor }]}>
                <Text style={[styles.dayText, { color }]}>
                    {dayInterpreter(item.day.getDay())}
                </Text>
                <Text style={[styles.dateText, { color }]}>
                    {item.day.getDate()}
                </Text>
            </TouchableOpacity>
        )
    }

    const renderDayItem = ({ item }: { item: DayItem }) => {
        const backgroundColor = item.day.getDate() == selectedDay ? Colors.light.primary : ''
        const color = item.day.getDate() == selectedDay ? 'white' : Colors.light.primary

        return (<DayItem {...{
            item,
            onPress: () => setSelectedDay(item.day.getDate()),
            backgroundColor,
            color,
        }} />)
    }

    useEffect(() => {
        setDays(daysInMonth(selectedMonth, selectedYear))
    }, [selectedMonth, selectedYear])

    useEffect(() => {
        onChange(new Date(selectedYear, selectedMonth, selectedDay))
    }, [selectedYear, selectedMonth - 1, selectedDay])

    return (
        <View>
            <CustomMonthYearPicker
                month={selectedMonth}
                year={selectedYear}
                setMonth={setSelectedMonth}
                setyear={setSelectedYear}
            />
            <FlatList
                data={selectDays}
                renderItem={renderDayItem}
                keyExtractor={item => item.id}
                extraData={selectedDay}
                horizontal
            />
        </View>
    );
};

export default CustomCalendar;