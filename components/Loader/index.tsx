import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

export default function Loader() {
    return (
        <View style={styles.backdrop}>
            <ActivityIndicator color={'white'} size={30} />
        </View>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: Colors.light.backdrop,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
})