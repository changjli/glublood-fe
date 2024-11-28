import { useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";
import {
    BleError,
    BleManager,
    Characteristic,
    Device,
} from "react-native-ble-plx";
import { GlucoseReading, parseGlucoseReading } from "@/app/ble/GlucoseReadingRx";

// from nRF Connect
const DEVICE_NAME = "meter+14771407"
const GLUCOSE_SERVICE = '00001808-0000-1000-8000-00805f9b34fb'
const MEASUREMENT_CHARACTERISTIC = '00002a18-0000-1000-8000-00805f9b34fb'
const RECORD_CHARACTERISTIC = '00002a52-0000-1000-8000-00805f9b34fb'

const bleManager = new BleManager();

function useBLE() {
    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
    const [glucoseMeasurements, setGlucoseMeasurements] = useState<GlucoseReading[]>([]);

    const requestAndroid31Permissions = async () => {
        const bluetoothScanPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );
        const bluetoothConnectPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );
        const fineLocationPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );

        return (
            bluetoothScanPermission === "granted" &&
            bluetoothConnectPermission === "granted" &&
            fineLocationPermission === "granted"
        );
    };

    const requestPermissions = async () => {
        if (Platform.OS === "android") {
            if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Location Permission",
                        message: "Bluetooth Low Energy requires Location",
                        buttonPositive: "OK",
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } else {
                const isAndroid31PermissionsGranted =
                    await requestAndroid31Permissions();

                return isAndroid31PermissionsGranted;
            }
        } else {
            return true;
        }
    };

    const connectToDevice = async (device: Device) => {
        try {
            const deviceConnection = await bleManager.connectToDevice(device.id);
            setConnectedDevice(deviceConnection);
            const services = await deviceConnection.discoverAllServicesAndCharacteristics();
            const characteristics = await device.services();
            bleManager.stopDeviceScan();

            startStreamingData(deviceConnection);
        } catch (e) {
            console.log("FAILED TO CONNECT", e);
        }
    };

    const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
        devices.findIndex((device) => nextDevice.id === device.id) > -1;

    const scanForPeripherals = () =>
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
            }

            if (
                device &&
                (device.localName === DEVICE_NAME || device.name === DEVICE_NAME)
            ) {
                setAllDevices((prevState: Device[]) => {
                    if (!isDuplicteDevice(prevState, device)) {
                        return [...prevState, device];
                    }
                    return prevState;
                });
            }
        });

    const onDataUpdate = (
        error: BleError | null,
        characteristic: Characteristic | null
    ) => {
        if (error) {
            console.error("Error enabling notifications", error)
            return
        }
        // Parse and process the glucose measurement data
        if (characteristic && characteristic.value) {
            const base64Data = characteristic.value
            const binaryData = base64.decode(base64Data)
            const byteArray = Uint8Array.from(binaryData, (char) => char.charCodeAt(0));
            const result = parseGlucoseReading(byteArray)
            console.log(result)
            setGlucoseMeasurements(prev => {
                if (result) {
                    prev.push(result)
                }
                console.log(prev)
                return prev
            })
        } else {
            console.log('no data found')
            return
        }
    };

    async function enableGlucoseMeasurementNotifications(device: Device) {
        device.monitorCharacteristicForService(
            GLUCOSE_SERVICE,
            MEASUREMENT_CHARACTERISTIC,
            onDataUpdate,
        );
    }

    async function requestAllGlucoseRecords(device: Device) {
        const command = base64.encode(String.fromCharCode(0x01, 0x01));
        console.log("Base64 command:", command);

        await device.writeCharacteristicWithResponseForService(
            GLUCOSE_SERVICE,
            RECORD_CHARACTERISTIC,
            command
        );

        console.log("Requested all glucose records");
    }

    const startStreamingData = async (device: Device) => {
        if (device) {
            try {
                await enableGlucoseMeasurementNotifications(device);
                await requestAllGlucoseRecords(device);
            } catch (error) {
                console.error("Error fetching glucose records", error);
            }
        } else {
            console.log("No Device Connected");
        }
    };

    return {
        connectToDevice,
        allDevices,
        connectedDevice,
        glucoseMeasurements,
        requestPermissions,
        scanForPeripherals,
        startStreamingData,
    };
}

export default useBLE;