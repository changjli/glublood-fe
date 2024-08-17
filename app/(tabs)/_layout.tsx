import { View, Text } from 'react-native'
import React from 'react'
import { useSession } from '../context/AuthenticationProvider'
import { Redirect, Stack, Tabs } from 'expo-router'
import { Colors } from '@/constants/Colors'

export default function TabLayout() {
    const { session, isLoading } = useSession()

    if (isLoading) {
        return <Text>Loading...</Text>
    }

    // If not authenticated 
    if (!session) {
        return <Redirect href="(auth)/login" />
    }

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: Colors.light.primary,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    paddingHorizontal: 16,
                    paddingTop: 12,
                    paddingBottom: 16,
                }
            }}
        >

        </Tabs>
    )
}