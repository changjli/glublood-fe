import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { useSession } from '../context/AuthenticationProvider'
import { Redirect, Stack, Tabs } from 'expo-router'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { Weight } from '@/constants/Typography'

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
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: 'white',
                tabBarStyle: {
                    height: 76,
                    backgroundColor: Colors.light.primary,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    paddingBottom: 16,
                    paddingTop: 12,
                    paddingHorizontal: 16
                },
                tabBarLabelStyle: {
                    fontFamily: Weight.heavy,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Ionicons name='home' size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="statistic"
                options={{
                    title: 'Statistic',
                    tabBarIcon: ({ color }) => <Ionicons name='stats-chart' size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="notes"
                options={{
                    title: 'Notes',
                    tabBarIcon: ({ color }) => <Ionicons name='clipboard' size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="scan"
                options={{
                    title: 'Scan',
                    tabBarIcon: ({ color }) => <Ionicons name='scan' size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <Ionicons name='person' size={28} color={color} />,
                }}
            />
        </Tabs>
    )
}