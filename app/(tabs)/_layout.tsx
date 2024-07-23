import { View, Text } from 'react-native'
import React from 'react'
import { useSession } from '../context/AuthenticationProvider'
import { Redirect, Stack } from 'expo-router'

export default function TabLayout() {
    const { session, isLoading } = useSession()

    if (isLoading) {
        return <Text>Loading...</Text>
    }

    // If not authenticated 
    if (!session) {
        return <Redirect href="/(auth)/login" />
    }

    return (
        <Stack />
    )
}