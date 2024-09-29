import { Colors } from '@/constants/Colors';
import { Weight } from '@/constants/Typography';
import React, { useState } from 'react'
import { Button, Modal, ModalProps, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type CustomModalProps = ModalProps & {
}

export default function CustomModal(props: CustomModalProps) {
    return (
        <View>
            <Modal
                {...props}
                transparent={true}
                animationType="fade"
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeaderContainer}>
                            <TouchableOpacity onPress={props.onRequestClose}>
                                <Text style={{ color: 'red' }}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={props.onRequestClose}>
                                <Text style={{ color: 'orange' }}>Lanjut</Text>
                            </TouchableOpacity>
                        </View>
                        {props.children}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '100%',
        height: '50%',
        backgroundColor: 'white',
        padding: 16,
    },
    modalHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
})
