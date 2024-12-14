import useBLE from "@/hooks/useBle";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import CustomText from "@/components/CustomText";
import CustomHeader from "@/components/CustomHeader";
import Wrapper from "@/components/Layout/Wrapper";
import CustomButton from "@/components/CustomButton";
import { FlexStyles } from "@/constants/Flex";
import { router } from "expo-router";
import ConnectModal from "./ConnectModal";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { FontAwesome } from "@expo/vector-icons";
import { FontSize } from "@/constants/Typography";
import { GlucoseReading } from "./GlucoseReadingRx";
import useGlucoseLog from "@/hooks/api/logs/glucose/useGlucoseLog";
import axios from "axios";
import { useCustomAlert } from "../context/CustomAlertProvider";
import useAsyncStorage from "@/hooks/useAsyncStorage";
import { useGlucoseNewEntriesNotification } from "@/hooks/useGlucoseNewEntriesNotification";

export type GlucoseLogNewEntryNotification = {
    date: string
    count: number
}

const BlePage = () => {
    const {
        allDevices,
        connectedDevice,
        connectToDevice,
        glucoseMeasurements,
        requestPermissions,
        scanForPeripherals,
        setAllDevices,
        stopScan,
        scanLoading,
    } = useBLE();
    const { storeGlucoseLogBatch, syncGlucoseLog } = useGlucoseLog()
    const { showAlert } = useCustomAlert()
    const { storeNotifications } = useGlucoseNewEntriesNotification()

    const [modalVisible, setModalVisible] = useState(false)
    const [formValue, setFormValue] = useState<StoreGlucoseLogReq[]>([])
    const [storeLoading, setStoreLoading] = useState(false)
    const [lastSyncDate, setLastSyncDate] = useState('')
    const [syncLoading, setSyncLoading] = useState(false)
    const [filteredGlucoseMeasurements, setFilteredGlucoseMeasurements] = useState<GlucoseReading[]>([])

    const scanForDevices = async () => {
        const isPermissionsEnabled = await requestPermissions();
        if (isPermissionsEnabled) {
            scanForPeripherals();
        }
    };

    const convertGlucoseReadingToLog = (glucoseReading: GlucoseReading[]) => {
        return glucoseReading.map(gr => ({
            date: gr.time.split(' ')[0],
            glucose_rate: gr.mgdl,
            time: gr.time.split(' ')[1],
            type: 'auto',
        })) as StoreGlucoseLogReq[]
    }

    const handleOpenModal = () => {
        scanForDevices()
        setModalVisible(true)
    }

    const handleCloseModal = () => {
        setModalVisible(false)
        setAllDevices([])
        stopScan()
    }

    const handleStoreGlucoseLog = async (data: GlucoseReading[]) => {
        try {
            const payload = convertGlucoseReadingToLog(data)
            const res = await storeGlucoseLogBatch(setStoreLoading, { items: payload })
            await storeNotifications(payload)
            router.navigate('/(tabs)/(notes)')
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    showAlert('Invalid request. Please check your input.', 'error');
                } else if (status === 500) {
                    showAlert('A server error occurred. Please try again later.', 'error');
                } else {
                    // showAlert(`An error occurred: ${status}. Please try again later.`, 'error');
                }
            } else {
                console.log('Unexpected Error:', err);
                showAlert('Please check your internet connection.', 'error');
            }
        }
    }

    const handleSyncGlucoseLog = async () => {
        try {
            const res = await syncGlucoseLog(setSyncLoading)
            if (res.data != ' ') {
                setLastSyncDate(res.data)
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    showAlert('Invalid request. Please check your input.', 'error');
                } else if (status === 500) {
                    showAlert('A server error occurred. Please try again later.', 'error');
                } else {
                    // showAlert(`An error occurred: ${status}. Please try again later.`, 'error');
                }
            } else {
                console.log('Unexpected Error:', err);
                showAlert('Please check your internet connection.', 'error');
            }
        }
    }

    useEffect(() => {
        handleSyncGlucoseLog()
    }, [])

    useEffect(() => {
        if (lastSyncDate != '') {
            setFilteredGlucoseMeasurements(glucoseMeasurements.filter(glucoseMeasurement => new Date(glucoseMeasurement.time) > new Date(lastSyncDate)))
        } else {
            setFilteredGlucoseMeasurements(glucoseMeasurements)
        }
    }, [glucoseMeasurements, lastSyncDate])

    console.log('result', filteredGlucoseMeasurements)

    return (
        <>
            <CustomHeader title="Accu-Chek Instant" />
            <Wrapper style={{ flex: 1, backgroundColor: 'white', justifyContent: 'space-between' }}>
                <View>
                    <Image source={require("@/assets/images/static/accucheck-removebg.png")} style={{ height: 195, width: 195, alignSelf: 'center' }} />

                    {connectedDevice ? (
                        <>
                            <CustomText size="md" weight="heavy">Connected Device</CustomText>
                            <View style={styles.itemContainer}>
                                <FontAwesome name='bluetooth' size={FontSize.md} />
                                <CustomText style={{ color: Colors.light.gray500 }}>{connectedDevice.name ?? connectedDevice.localName ?? 'anonymous'}</CustomText>
                            </View>

                            <CustomText size="md" weight="heavy">Result</CustomText>

                            {filteredGlucoseMeasurements.length > 0 ? (
                                <FlatList
                                    data={filteredGlucoseMeasurements}
                                    renderItem={({ item }) => (
                                        <View style={styles.itemContainer}>
                                            <CustomText style={{ color: Colors.light.gray500 }}>{item.mgdl} mgdl on {item.time}</CustomText>
                                        </View>
                                    )}
                                />
                            ) : (
                                <CustomText>Last synced on {lastSyncDate}</CustomText>
                            )}
                        </>
                    ) : (
                        <>
                            <CustomText size="md" weight="heavy">Cara menyalakan bluetooth:</CustomText>
                            <CustomText>1. Tekan dan tahan tombol yang diberikan tanda panah sedikit lama.</CustomText>
                            <CustomText>2. Tunggu sampai muncul tanda bluetooth dan mata rantai pada alat Accu Check Instant.</CustomText>
                            <CustomText>3. Jika sudah, alat siap untuk dihubungkan ke aplikasi!</CustomText>
                        </>
                    )}
                </View>

                {filteredGlucoseMeasurements.length > 0 ? (
                    <CustomButton title="Masukkan ke log" size="md" style={{ marginBottom: 20 }} onPress={() => handleStoreGlucoseLog(filteredGlucoseMeasurements)} disabled={syncLoading} />
                ) : (
                    <CustomButton title="Mulai konfigurasi" size="md" style={{ marginBottom: 20 }} onPress={handleOpenModal} disabled={syncLoading} />
                )}
            </Wrapper>
            <ConnectModal
                visible={modalVisible}
                toggleModal={handleCloseModal}
                allDevices={allDevices}
                connectToDevice={connectToDevice}
                scanForPeripherals={scanForPeripherals}
                stopScan={stopScan}
                scanLoading={scanLoading}

            />
        </>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        ...FlexStyles.flexRow,
        paddingVertical: 8,
        gap: 4,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.gray300
    }
})

export default BlePage;