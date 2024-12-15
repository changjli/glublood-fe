import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import Modal, { ModalProps } from "react-native-modal";
import { Colors } from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';

interface CustomImagePickerProps {
    image: string,
    onChange: (value: string) => void
    readOnly?: boolean
    children: React.ReactNode
}

export default function CustomImagePicker({ image, onChange, readOnly = false, children }: CustomImagePickerProps) {
    const [modalVisible, setModalVisible] = useState(false)

    const uploadImage = async (mode: string) => {
        try {
            let result: any
            if (mode === 'gallery') {
                await ImagePicker.requestMediaLibraryPermissionsAsync()
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                })
            } else if (mode === 'camera') {
                await ImagePicker.requestCameraPermissionsAsync()
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                })
            }

            if (!result.canceled) {
                await saveImage(result.assets[0].uri)
            }
        } catch (error) {
            console.log("error uploading image", error)
        }
    }

    const saveImage = async (image: string) => {
        try {
            onChange(image);
            console.log("Image URI: ", image)
        } catch (error) {
            console.log("error saving image")
        }
    }


    return (
        <>
            <Modal
                isVisible={modalVisible}
                style={{
                    alignItems: 'center'
                }}
                customBackdrop={(
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                        <View style={styles.modalBackdrop} />
                    </TouchableWithoutFeedback>
                )}
            >
                <View style={{
                    backgroundColor: 'white',
                    padding: 16,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    borderRadius: 8,
                    width: 250,
                }}>
                    <TouchableOpacity onPress={() => uploadImage('camera')}>
                        <FontAwesome name='camera' size={32} color={Colors.light.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => uploadImage('gallery')}>
                        <FontAwesome name='image' size={32} color={Colors.light.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChange('')}>
                        <FontAwesome name='trash' size={32} color={Colors.light.danger} />
                    </TouchableOpacity>
                </View>
            </Modal>
            <TouchableOpacity
                onPress={() => readOnly ? undefined : setModalVisible(true)}
            >
                {children}
            </TouchableOpacity>
        </>

    )
}

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: Colors.light.backdrop,
    },
})