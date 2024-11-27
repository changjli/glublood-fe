import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
    return (
        <Stack>
            <Stack.Screen name='index' options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name='create' options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name='[id]' options={{ headerShown: false }}></Stack.Screen>
        </Stack>
    )
}