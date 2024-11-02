import { View, Text, KeyboardAvoidingView } from 'react-native'
import React, { useEffect } from 'react'
import { Slot, Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen';

import "../global.css"
import { useFonts } from 'expo-font';
import { SessionProvider } from './context/AuthenticationProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'nativewind';
import ThemeProvider from './context/ThemeProvider';

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
        <SessionProvider>
            <ThemeProvider>
                <SafeAreaView style={{ flex: 1 }}>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                        }}>
                        <Stack.Screen name='(tabs)' />
                        <Stack.Screen name='(auth)' />
                        <Stack.Screen name='food-logs' />
                    </Stack>
                </SafeAreaView>
            </ThemeProvider>
        </SessionProvider>
    )
}
