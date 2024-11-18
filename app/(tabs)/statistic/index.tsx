import { View, Text, Alert, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomDropDown from '@/components/CustomDropDown'
import CustomBarChart from './CustomBarChart';
import Wrapper from '@/components/Layout/Wrapper';
import useFoodLog from '@/hooks/api/food_log/useFoodLog';
import axios from 'axios';
import CustomText from '@/components/CustomText';
import { Link, router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { FlexStyles } from '@/constants/Flex';
import { Ionicons } from '@expo/vector-icons';
import { FontSize } from '@/constants/Typography';
import DynamicTextComponent from '@/components/DynamicText';
import CustomImage from '@/components/CustomImage';

export default function StatisticPage() {

    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.darkOrange50 }}>
            <DynamicTextComponent text="Statistik" img={require('@/assets/images/backgrounds/bg-stat.png')} />
            <TouchableOpacity style={[styles.itemContainer, styles.itemBorder]} onPress={() => router.navigate('/(statistic)/food-logs')}>
                <Image source={require('@/assets/images/icons/glucose-meter.png')} style={{ height: 100, width: 76.25 }} />
                <View style={[FlexStyles.flexCol]}>
                    <CustomText style={{ color: Colors.light.primary }}>Statistik</CustomText>
                    <CustomText size='lg' weight='heavy' style={{ color: Colors.light.primary }}>Glukosa</CustomText>
                </View>
                <Ionicons name='chevron-forward' size={40} color={Colors.light.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.itemContainer, styles.itemBorder, { bottom: 10 }]} onPress={() => router.navigate('/(statistic)/exercise-logs')}>
                <Image source={require('@/assets/images/icons/barbell.png')} style={{ height: 100, width: 100 }} />
                <View style={[FlexStyles.flexCol]}>
                    <CustomText style={{ color: Colors.light.primary }}>Statistik</CustomText>
                    <CustomText size='lg' weight='heavy' style={{ color: Colors.light.primary }}>Glukosa</CustomText>
                </View>
                <Ionicons name='chevron-forward' size={40} color={Colors.light.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.itemContainer, { bottom: 20 }]} onPress={() => router.navigate('/(statistic)/exercise-logs')}>
                <Image source={require('@/assets/images/icons/fruits.png')} style={{ height: 100, width: 103 }} />
                <View style={[FlexStyles.flexCol]}>
                    <CustomText style={{ color: Colors.light.primary }}>Statistik</CustomText>
                    <CustomText size='lg' weight='heavy' style={{ color: Colors.light.primary }}>Glukosa</CustomText>
                </View>
                <Ionicons name='chevron-forward' size={40} color={Colors.light.primary} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        ...FlexStyles.flexRow,
        justifyContent: 'center',
        gap: 16,
        flex: 1,
    },
    itemBorder: {
        borderBottomWidth: 2,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: Colors.light.orangeYel300,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
    }
})
