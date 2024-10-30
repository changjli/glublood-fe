import { View, Text } from 'react-native'
import React from 'react'
import BarcodeScanner from '@/app/(tabs)/scan/BarcodeScanner'

export default function BarcodeScanPage() {
    return (
        <View style={{ flex: 1 }}>
            <BarcodeScanner />
        </View>
    )
}