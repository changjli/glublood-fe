import { View, Text } from 'react-native'
import React from 'react'
import { useSession } from '../context/AuthenticationProvider'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'

export default function index() {
    const { signOut, session } = useSession()

    return (
        <View>
            <CustomButton title='Sign out' onPress={() => signOut()} />
            <CustomButton title='Predict' onPress={() => router.replace('prediction')} />
        </View>
    )
}