import { Colors } from '@/constants/Colors';
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BarcodeScanner() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false)
    const cameraRef = useRef<CameraView>(null)

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const handleBarcodeScanned = ({ cornerPoints, data, type }: BarcodeScanningResult) => {
        if (scanned) return;

        const { width, height } = Dimensions.get('window');

        if (cornerPoints) {
            // Calculate the centroid of the barcode
            const centroidX = cornerPoints.reduce((sum, point) => sum + point.x, 0) / cornerPoints.length;
            const centroidY = cornerPoints.reduce((sum, point) => sum + point.y, 0) / cornerPoints.length;

            // Define the central area (you can adjust the size as needed)
            const centralArea = {
                minX: width * 0.3,
                maxX: width * 0.7,
                minY: height * 0.3,
                maxY: height * 0.7,
            };

            console.log(centroidX, centroidY, centralArea)

            // Check if the centroid is within the central area
            const isCentroidInCenter =
                centroidX > centralArea.minX &&
                centroidX < centralArea.maxX &&
                centroidY > centralArea.minY &&
                centroidY < centralArea.maxY;

            if (isCentroidInCenter) {
                setScanned(true);
                alert(`Barcode with type ${type} and data ${data} has been scanned!`);
                // Do something with the scanned data
            }
        }
    }

    useEffect(() => {
        return () => {
            if (cameraRef.current) {
                cameraRef.current.pausePreview()
                cameraRef.current.stopRecording()
            }
        };
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <CameraView
                ref={cameraRef}
                style={{ flex: 1, justifyContent: 'center' }}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            />
            <View style={styles.overlay}>
                <View style={styles.guideBox}>
                </View>
            </View>
            {scanned && (
                <TouchableOpacity
                    style={styles.scanAgainButton}
                    onPress={() => setScanned(false)}
                >
                    <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    overlay: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    guideBox: {
        height: 300,
        width: 300,
        borderWidth: 2,
        borderColor: Colors.light.primary,
        borderRadius: 20,
    },
    scanAgainButton: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
    },
    scanAgainText: {
        color: 'white',
        fontSize: 18,
    },
});