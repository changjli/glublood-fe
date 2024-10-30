import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from 'expo-router';
import Wrapper from '@/components/Layout/Wrapper';
import { Colors } from '@/constants/Colors';

export default function index() {

    return (
        <Wrapper>
            <View style={styles.container}>
                <TouchableOpacity style={styles.itemContainer} onPress={() => router.navigate('/(notes)/medicine')}>
                    <Text>Tracking obat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemContainer} onPress={() => router.navigate('/(notes)/food-logs')}>
                    <Text>Tracking nutrisi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemContainer} onPress={() => router.navigate('/(notes)/medicine')}>
                    <Text>Tracking gula darah</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemContainer} onPress={() => router.navigate('/(notes)/exercise-logs')}>
                    <Text>Tracking olahraga</Text>
                </TouchableOpacity>
            </View>
        </Wrapper>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
    },
    itemContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.light.primary,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 40,
    }
})