import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import SegmentedControl from '@/components/SegmentedControl'
import WeeklyReportPage from './weekly'
import MonthlyReportPage from './monthly'
import CustomReportPage from './custom'
import CustomHeader from '@/components/CustomHeader'

const data = [
    { title: 'Mingguan', page: WeeklyReportPage },
    { title: 'Bulanan', page: MonthlyReportPage },
    { title: 'Kustom', page: CustomReportPage },
]

export default function LogReportPage() {
    return (
        <View style={{ flex: 1 }}>
            <CustomHeader title='Rekam Data' />
            <SegmentedControl
                segmentedControls={data}
            />
        </View>
    )
}