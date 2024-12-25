import { View, Text, StyleSheet, ViewProps, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React from 'react'

interface WithKeyboardProps extends ViewProps {
    children: React.ReactNode
}

export default function WithKeyboard({ children, style }: WithKeyboardProps) {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
            keyboardVerticalOffset={0}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
