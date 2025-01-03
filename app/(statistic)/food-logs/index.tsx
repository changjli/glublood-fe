import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import SegmentedControl from '@/components/SegmentedControl'
import CustomFoodLogStatisticPage from './custom'
import MonthlyFoodLogStatisticPage from './monthly'
import YearlyFoodLogStatisticPage from './yearly'
import WeeklyFoodLogStatisticPage from './weekly'
import CustomHeader from '@/components/CustomHeader'

const data = [
    { title: 'Mingguan', page: WeeklyFoodLogStatisticPage },
    { title: 'Bulanan', page: MonthlyFoodLogStatisticPage },
    { title: 'Tahunan', page: YearlyFoodLogStatisticPage },
    { title: 'Custom', page: CustomFoodLogStatisticPage },
]

export default function FoodLogStatisticPage() {
    return (
        <View style={{ flex: 1 }}>
            <CustomHeader title='Statistik Nutrisi' />
            <SegmentedControl
                segmentedControls={data}
            />
        </View>
    )
}