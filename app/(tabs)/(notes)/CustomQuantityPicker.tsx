import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import WheelPickerExpo from 'react-native-wheel-picker-expo'
import { FontAwesome } from '@expo/vector-icons'
import { FontFamily, FontSize } from '@/constants/Typography'
import { Colors } from '@/constants/Colors'

type CustomQuantityPickerProps = {
    qty: number
    size: string
    onChangeQty: (qty: string) => void
    onChangeSize: (size: string) => void

}

export default function CustomQuantityPicker({ qty, size, onChangeQty, onChangeSize }: CustomQuantityPickerProps) {
    const qtyData = [1, 2, 3]
    const sizeData = ["Piring", "Gelas"]

    return (
        <View style={styles.container}>
            <FontAwesome name='play' style={styles.arrow} />
            <WheelPickerExpo
                initialSelectedIndex={0}
                onChange={({ index }) => onChangeQty(String(qtyData[index]))}
                items={qtyData.map(data => ({ label: String(data), value: data }))}
                renderItem={({ label }) => (
                    <View style={[
                        styles.pickerContainer,
                        label == String(qty) && styles.pickerSelected,
                    ]}>
                        <Text style={
                            styles.pickerText
                        }>
                            {label}
                        </Text>
                    </View>
                )}
                flatListProps={{
                    nestedScrollEnabled: true,
                    style: {
                        height: 200
                    }
                }}
            />
            <FontAwesome name='play' style={styles.arrow} />
            <WheelPickerExpo
                initialSelectedIndex={0}
                onChange={({ index }) => onChangeSize(sizeData[index])}
                items={sizeData.map(data => ({ label: data, value: data }))}
                renderItem={({ label }) => (
                    <View style={[
                        styles.pickerContainer,
                        label == String(size) && styles.pickerSelected,
                    ]}>
                        <Text style={
                            styles.pickerText
                        }>
                            {label}
                        </Text>
                    </View>
                )}
                flatListProps={{
                    nestedScrollEnabled: true,
                    style: {
                        height: 200
                    }
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 200,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'white',
    },
    arrow: {
        color: Colors.light.primary,
    },
    pickerContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    pickerText: {
        fontSize: FontSize.lg,
        fontFamily: FontFamily.heavy,
        color: Colors.light.primary,
    },
    pickerSelected: {
        backgroundColor: 'rgba(244, 198, 135, 0.30)',
    }
})