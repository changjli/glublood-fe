import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '@/constants/Colors'

export default function FoodLogLayout() {
    return (
        <Stack>
            <Stack.Screen name='index' options={{
                headerShown: false,
            }} />
            <Stack.Screen name='search' options={{
                headerTitle: '',
                headerStyle: {
                    backgroundColor: Colors.light.primary,
                },
                headerShadowVisible: false,
                headerTintColor: 'white',
            }} />
            <Stack.Screen name='create/index' options={{
                headerTitle: '',
                headerTransparent: true,
            }} />
            <Stack.Screen name='create/[id]' options={{
                headerTitle: '',
                headerTransparent: true,
            }} />
            <Stack.Screen name='create/barcode/index' options={{
                headerTitle: '',
                headerTransparent: true,
            }} />
            <Stack.Screen name='create/barcode/[barcode]' options={{
                headerTitle: '',
                headerTransparent: true,
            }} />
            <Stack.Screen name='[id]' options={{
                headerTitle: '',
                headerTransparent: true,
            }} />
        </Stack>
    )
}