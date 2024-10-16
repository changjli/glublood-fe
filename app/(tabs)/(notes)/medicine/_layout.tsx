import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
    return (
        <Stack>
            <Stack.Screen name='index' options={{ headerShown: false }}></Stack.Screen>
            {/* <Stack.Screen name='search' options={{ headerTitle: '' }}></Stack.Screen>
            <Stack.Screen name='create' options={{ headerTitle: '' }}></Stack.Screen>
            <Stack.Screen name='[id]' options={{ headerTitle: '' }}></Stack.Screen> */}
        </Stack>
    )
}