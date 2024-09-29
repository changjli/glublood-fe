import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BarcodeScanner from './BarcodeScanner';

export default function index() {

    return (
        <View style={{ flex: 1 }}>
            <BarcodeScanner />
        </View>
    );
}

