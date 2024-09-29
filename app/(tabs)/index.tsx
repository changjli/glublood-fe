import { View, Text, Modal, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useSession } from '../context/AuthenticationProvider'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'
import DateTimePicker from '@react-native-community/datetimepicker';

export default function index() {
    const { signOut, session } = useSession()

    const [modal, setModal] = useState(false)

    return (
        <>
            <Modal
                animationType="slide"
                visible={modal}
                transparent={true}
            >
                <View className='flex-1 flex-col justify-end'>
                    <View style={{
                        height: 300,
                        backgroundColor: 'white'
                    }}>
                        <CustomButton title='modal' onPress={() => setModal(!modal)} />
                    </View>
                </View>
            </Modal>
            <View>
                <CustomButton title='Sign out' onPress={() => signOut()} />
                <CustomButton title='modal' onPress={() => setModal(!modal)} />
            </View>
        </>
    )
}

