import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
    return (
        <Stack>
            <Stack.Screen name='LandingPage' options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name='SplashScreen' options={{ headerShown: false }}></Stack.Screen>
        </Stack>
    )
}