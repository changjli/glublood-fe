import { View, Text } from 'react-native'
import React, { useCallback } from 'react'
import BarcodeScanner from '@/app/(tabs)/scan/BarcodeScanner'
import { useFocusEffect } from 'expo-router'
import useAsyncStorage from '@/hooks/useAsyncStorage'

export default function BarcodeScanPage() {
    const { storeData } = useAsyncStorage()

    useFocusEffect(
        useCallback(() => {
            storeData('barcodeDate', 'select')
        }, [])
    )

    return (
        <View style={{ flex: 1 }}>
            <BarcodeScanner />
        </View>
    )
}