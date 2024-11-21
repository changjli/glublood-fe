import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function ExericseLogLayout() {
    return (
        <Stack>
            <Stack.Screen name='index' />
            <Stack.Screen name='create' options={{ headerShown: false }} />
            <Stack.Screen name='[id]' options={{ headerShown: false }} />
        </Stack>
    )
}