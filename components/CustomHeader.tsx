import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import CustomText from './CustomText'
import { Ionicons } from '@expo/vector-icons'
import { FontSize } from '@/constants/Typography'
import { router } from 'expo-router'

interface CustomHeaderProps {
    title: string
}

export default function CustomHeader({ title }: CustomHeaderProps) {
    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name='arrow-back' size={FontSize['2xl']} color={'white'} />
            </TouchableOpacity>
            <CustomText size='xl' weight='heavy' style={{ color: 'white' }}>{title}</CustomText>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        backgroundColor: Colors.light.primary,
        padding: 16,
    }
})