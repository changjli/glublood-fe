import { Colors } from '@/constants/Colors';
import { FontFamily } from '@/constants/Typography';
import React, { useState } from 'react'
import { Button, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import CustomText from './CustomText';
import Modal, { ModalProps } from "react-native-modal";

export type CustomModalProps = Partial<ModalProps> & {
    toggleModal: () => void
    header?: React.ReactNode
}

export default function CustomModal({ toggleModal, header = null, ...rest }: CustomModalProps) {
    return (
        <View>
            <Modal
                {...rest}
                style={styles.modalOuterContainer}
                customBackdrop={(
                    <TouchableWithoutFeedback onPress={toggleModal}>
                        <View style={styles.modalBackdrop} />
                    </TouchableWithoutFeedback>
                )}
            >
                <View style={[styles.modalContainer, rest.style]}>
                    {header ? (
                        header
                    ) : (
                        <View style={styles.modalHeaderContainer}>
                            <TouchableOpacity onPress={toggleModal}>
                                <CustomText size='sm' style={{ color: Colors.light.danger }}>Batal</CustomText>
                            </TouchableOpacity>
                        </View>
                    )}
                    {rest.children}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: Colors.light.backdrop,
    },
    modalOuterContainer: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    modalContainer: {
        width: '100%',
        height: '60%',
        backgroundColor: 'white',
        padding: 16,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
    },
    modalHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
})
