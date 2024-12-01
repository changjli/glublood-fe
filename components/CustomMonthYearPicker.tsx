import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'
import { FontSize, FontFamily } from '@/constants/Typography'
import { Ionicons } from '@expo/vector-icons'
import DatePicker from 'react-native-modern-datepicker';

type CustomMonthYearPickerProps = {
    month: number,
    year: number,
    setMonth: (value: number) => void,
    setyear: (value: number) => void,
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function CustomMonthYearPicker({ month, year, setMonth, setyear }: CustomMonthYearPickerProps) {
    const [pickerVisible, setPickerVisible] = useState(false)

    return (
        <>
            <TouchableOpacity style={styles.inputContainer} onPress={() => setPickerVisible(!pickerVisible)}>
                <Text style={styles.inputText}>{months[month]} {year}</Text>
                <Ionicons name='chevron-down-sharp' style={styles.inputText} />
            </TouchableOpacity>
            {pickerVisible &&
                <View style={styles.pickerContainer}>
                    <DatePicker
                        mode="monthYear"
                        selectorStartingYear={2000}
                        options={{
                            mainColor: Colors.light.primary,
                            headerFont: FontFamily.heavy,
                            defaultFont: FontFamily.medium,
                            textDefaultColor: Colors.light.primary,
                        }}
                        onMonthYearChange={(e) => {
                            const monhtYear = e.split(' ')
                            setyear(Number(monhtYear[0]))
                            setMonth(Number(monhtYear[1]) - 1)
                            setPickerVisible(false)
                        }}
                        current={`${year}/${month + 1}`}
                    />
                </View>
            }
        </>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 2,
        borderColor: Colors.light.primary,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        alignSelf: 'flex-start',
    },
    inputText: {
        color: Colors.light.primary,
        fontSize: FontSize.md,
        fontFamily: FontFamily.heavy,
    },
    pickerContainer: {
        position: 'absolute',
        top: 50, // Adjust this value according to where you want the picker to appear
        left: 0,
        right: 0,
        zIndex: 3, // Ensure it appears above other elements
        backgroundColor: 'white', // Optional: add background if needed
        borderRadius: 8,
        shadowColor: '#000', // Optional: add shadow for a floating effect
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // For Android shadow
    },
})