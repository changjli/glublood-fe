import { View, Text, StyleSheet, ViewProps } from 'react-native'
import React from 'react'
import CustomText from './CustomText'
import { Colors } from '@/constants/Colors'
import Wrapper from './Layout/Wrapper'

interface CustomProgressBarProps extends ViewProps {
    current: number
    total: number
}

export default function CustomProgressBar({ current, total, ...rest }: CustomProgressBarProps) {
    return (
        <Wrapper style={{ backgroundColor: Colors.light.primary, padding: 16 }} {...rest}>
            <CustomText size='md' weight='heavy' style={{ color: 'white' }}>Pertanyaan {current} dari {total}</CustomText>
            <View style={styles.progressContainer}>
                <View style={[styles.innerProgressContainer, { width: `${(current / total) * 100}%` }]}></View>
            </View>
        </Wrapper>
    )
}

const styles = StyleSheet.create({
    progressContainer: {
        width: '100%',
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 4,
    },
    innerProgressContainer: {
        height: '100%',
        backgroundColor: Colors.light.green700,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
    }
})