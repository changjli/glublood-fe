import { View, Text, StyleSheet, ViewProps } from 'react-native'
import React from 'react'

interface LayoutProps extends ViewProps {
    children: React.ReactNode
}

export default function Wrapper({ children, style }: LayoutProps) {
    return (
        <View style={[styles.container, style]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'white',
        flex: 1,
    }
})