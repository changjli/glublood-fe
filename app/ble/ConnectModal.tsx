import { View, Text, Image, ListRenderItemInfo, TouchableOpacity, FlatList, StyleSheet, ViewStyle } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import CustomHeader from '@/components/CustomHeader'
import Wrapper from '@/components/Layout/Wrapper'
import useBLE from '@/hooks/useBle';
import { Device } from 'react-native-ble-plx';
import CustomText from '@/components/CustomText';
import { Colors } from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { FlexStyles } from '@/constants/Flex';
import { FontSize } from '@/constants/Typography';
import Modal from 'react-native-modal';
import CustomButton from '@/components/CustomButton';

interface ConnectModalProps {
    visible: boolean
    toggleModal: () => void
    allDevices: Device[];
    connectToDevice: (device: Device) => void;
    scanForPeripherals: () => void
    stopScan: () => void
    scanLoading: boolean
}

interface BleItemProps {
    item: Device;
    connectToDevice: (device: Device) => void;
    toggleModal: () => void
}

export default function ConnectModal({ visible, toggleModal, allDevices, connectToDevice, scanForPeripherals, stopScan, scanLoading }: ConnectModalProps) {

    const renderBleItemCallback = useCallback(({ item, index }: ListRenderItemInfo<Device>) => (
        <BleItem item={item} connectToDevice={connectToDevice} toggleModal={toggleModal} />
    ), [connectToDevice])

    return (
        <Modal
            isVisible={visible}
            animationIn={'slideInLeft'}
            animationOut={'slideOutLeft'}
            style={{ margin: 0 }}
        >
            <CustomHeader title='Konfigurasi Alat' back={toggleModal} />
            <Wrapper style={{ flex: 1, backgroundColor: 'white', justifyContent: 'space-between' }}>
                <Image source={require("@/assets/images/static/accucheck-behind-removebg.png")} style={{ height: 222, width: 222, alignSelf: 'center' }} />
                {scanLoading && (<CustomText weight='heavy'>Mencari alat...</CustomText>)}
                <FlatList
                    data={allDevices}
                    renderItem={renderBleItemCallback}
                />
                {scanLoading ? (
                    <CustomButton title='Hentikan pemindaian' type='outline' size='md' style={{ marginBottom: 20 }} onPress={stopScan} />
                ) : (
                    <CustomButton title='Cari ulang' type='outline' size='md' style={{ marginBottom: 20 }} onPress={scanForPeripherals} />
                )}
            </Wrapper>
        </Modal>
    )
}

const BleItem = ({ item, connectToDevice, toggleModal }: BleItemProps) => {
    const handleConnect = useCallback(() => {
        connectToDevice(item)
        toggleModal()
    }, [item, connectToDevice, toggleModal]);

    return (
        <TouchableOpacity onPress={handleConnect} style={bleItemStyles.itemContainer}>
            <FontAwesome name='bluetooth' size={FontSize.md} />
            <CustomText style={{ color: Colors.light.gray500 }}>{item.name ?? item.localName ?? 'anonymous'}</CustomText>
        </TouchableOpacity>
    )
}

const bleItemStyles = StyleSheet.create({
    itemContainer: {
        ...FlexStyles.flexRow,
        paddingVertical: 8,
        gap: 4,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.gray300
    }
})