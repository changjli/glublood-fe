import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import SegmentedControl from '@/components/SegmentedControl'
import WeeklyGlucoseLogStatisticPage from './weekly'
import MonthlyGlucoseLogStatisticPage from './monthly'
import YearlyGlucoseLogStatisticPage from './yearly'
import CustomGlucoseLogStatisticPage from './custom'
import CustomHeader from '@/components/CustomHeader'

const data = [
    { title: 'Mingguan', page: WeeklyGlucoseLogStatisticPage },
    { title: 'Bulanan', page: MonthlyGlucoseLogStatisticPage },
    { title: 'Tahunan', page: YearlyGlucoseLogStatisticPage },
    { title: 'Custom', page: CustomGlucoseLogStatisticPage },
]

export default function FoodLogStatisticPage() {
    return (
        <View style={{ flex: 1 }}>
            <CustomHeader title='Statistik Glukosa' />
            <SegmentedControl
                segmentedControls={data}
            />
        </View>
    )
}