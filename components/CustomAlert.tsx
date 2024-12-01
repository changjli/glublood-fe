import { View, Text, TouchableWithoutFeedback, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import Modal, { ModalProps } from 'react-native-modal'
import CustomText from './CustomText'
import { Colors } from '@/constants/Colors'

interface CustomAlert extends Partial<ModalProps> {
}

export default function CustomAlert({ ...rest }: CustomAlert) {
    const [showAlert, setShowAlert] = useState(true)

    useEffect(() => {
        setTimeout(() => setShowAlert(false), 3000)
    }, [])

    return (
        <Modal
            {...rest}
            isVisible={showAlert}
            style={styles.modalOuterContainer}
            customBackdrop={(
                <TouchableWithoutFeedback onPress={() => setShowAlert(false)}>
                    <View style={styles.modalBackdrop} />
                </TouchableWithoutFeedback>
            )}
        >
            <View style={styles.modalContainer}>
            </View>
        </Modal>
    )
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
