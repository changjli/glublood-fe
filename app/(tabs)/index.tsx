import { View, Text } from 'react-native'
import React from 'react'
import { useSession } from '../context/AuthenticationProvider'
import CustomButton from '@/components/CustomButton'

export default function index() {
    const { signOut } = useSession()

    return (
        <View>
            <CustomButton title='Sign out' onPress={() => signOut()} />
        </View>
    )
}