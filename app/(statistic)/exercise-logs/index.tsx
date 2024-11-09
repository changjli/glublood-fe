import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import SegmentedControl from '@/components/SegmentedControl'
import WeeklyExerciseLogStatisticPage from './weekly'
import MonthlyExerciseLogStatisticPage from './monthly'
import YearlyExerciseLogStatisticPage from './yearly'
import CustomExerciseLogStatisticPage from './custom'

const data = [
    { title: 'Mingguan', page: WeeklyExerciseLogStatisticPage },
    { title: 'Bulanan', page: MonthlyExerciseLogStatisticPage },
    { title: 'Tahunan', page: YearlyExerciseLogStatisticPage },
    { title: 'Custom', page: CustomExerciseLogStatisticPage },
]

export default function ExerciseLogStatisticPage() {
    return (
        <View style={{ flex: 1 }}>
            <SegmentedControl
                segmentedControls={data}
            />
        </View>
    )
}