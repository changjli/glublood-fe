import { View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomDropDown from '@/components/CustomDropDown'
import CustomBarChart from './CustomBarChart';
import Wrapper from '@/components/Layout/Wrapper';
import useFoodLog from '@/hooks/api/food_log/useFoodLog';
import axios from 'axios';
import CustomText from '@/components/CustomText';
import { Link, router } from 'expo-router';

export default function index() {

    return (
        <View style={{ backgroundColor: 'white' }}>
            <TouchableOpacity onPress={() => router.navigate('/(statistic)/food-logs')}>
                <Text>Statistik makakan</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.navigate('/(statistic)/exercise-logs')}>
                <Text>Statistik olahraga</Text>
            </TouchableOpacity>
        </View>
    )
}
