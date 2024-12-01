import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '@/constants/Colors'

export default function _layout() {
    return (
        <Stack>
            <Stack.Screen name='index' options={{ headerShown: false }} />
        </Stack>
    )
}