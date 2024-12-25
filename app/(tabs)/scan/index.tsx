import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useCallback, useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BarcodeScanner from './BarcodeScanner';
import useAsyncStorage from '@/hooks/useAsyncStorage';
import { useFocusEffect } from 'expo-router';

export default function index() {
    const { storeData } = useAsyncStorage()

    useFocusEffect(
        useCallback(() => {
            storeData('barcodeDate', 'now')
        }, [])
    )

    return (
        <View style={{ flex: 1 }}>
            <BarcodeScanner />
        </View>
    );
}

