import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import Modal, { ModalProps } from "react-native-modal";

export default function Loader({ visible }: { visible: boolean }) {
    return (
        <Modal
            isVisible={visible}
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}
            collapsable={false}
        >
            <ActivityIndicator color={Colors.light.primary} size={30} />
        </Modal>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: Colors.light.backdrop,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
})