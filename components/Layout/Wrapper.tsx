import { View, Text, StyleSheet, ViewProps } from 'react-native'
import React from 'react'

interface WrapperProps extends ViewProps {
    children: React.ReactNode
}

export default function Wrapper({ children, style, ...rest }: WrapperProps) {
    return (
        <View style={[styles.container, style]} {...rest}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
        paddingHorizontal: 16,
    }
})