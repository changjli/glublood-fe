import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen';

import "../global.css"
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        'Helvetica': require('../assets/fonts/Helvetica.ttf'),
        'Helvetica-Bold': require('../assets/fonts/Helvetica-Bold.ttf'),
        'Helvetica-Light': require('../assets/fonts/Helvetica-Light.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='(auth)/login' />
        </Stack>
    )
}