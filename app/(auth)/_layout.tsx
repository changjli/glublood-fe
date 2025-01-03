import { View, Text, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { Redirect, Slot } from 'expo-router'
import { useSession } from '../context/AuthenticationProvider'

export default function AuthLayout() {
    const { session, isLoading } = useSession()

    if (isLoading) {
        return <Text>Loading...</Text>
    }

    // If not authenticated 
    if (session) {
        return <Redirect href="/(tabs)" />
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Slot />
        </TouchableWithoutFeedback>
    )
}