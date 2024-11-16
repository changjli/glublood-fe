import { View, Text, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomDropDown from '@/components/CustomDropDown'
import Wrapper from '@/components/Layout/Wrapper';
import useExerciseLog from '@/hooks/api/logs/exercise/useExerciseLog';
import axios from 'axios';
import CustomText from '@/components/CustomText';
import CustomBarChart from '@/components/CustomBarChart';
import CustomCalendarPicker from '@/components/CustomCalendarPicker';
import { VictoryChart, VictoryScatter, VictoryTheme, VictoryZoomContainer } from 'victory-native';
import SegmentedControl from '@/components/SegmentedControl';
import CustomMonthYearPicker from '@/components/CustomMonthYearPicker';
import { formatDateStripToSlash } from '@/utils/formatDatetoString';
import { resolveMonthAbbreviation } from '@/utils/resolver';

export default function YearlyExerciseLogStatisticPage() {
    const { getExerciseLogReportByYear } = useExerciseLog()

    const years = Array.from({ length: 100 }, (_, i) => ({
        label: `${new Date().getFullYear() - i}`,
        value: new Date().getFullYear() - i,
    }));

    const [loading, setLoading] = useState({
        getExerciseLogReport: false,
    })
    const [exerciseLogReport, setExerciseLogReport] = useState<GetExerciseLogReportByYearhRes[]>([])
    const date = new Date()
    const [selectedYear, setSelectedYear] = useState(date.getFullYear())
    const [averageBurnedCalories, setAverageBurnedCalories] = useState(0)

    const handleGetExerciseLogReport = async () => {
        try {
            const res = await getExerciseLogReportByYear(() => setLoading({ ...loading, getExerciseLogReport: true }), selectedYear)
            setExerciseLogReport(res.data)
        } catch (err) {
            setExerciseLogReport([])
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    Alert.alert('Bad Request', 'Invalid request. Please check your input.');
                } else if (status === 500) {
                    Alert.alert('Server Error', 'A server error occurred. Please try again later.');
                } else {
                    // Alert.alert('Error', `An error occurred: ${status}. Please try again later.`);
                }
            } else {
                console.log('Unexpected Error:', err);
                Alert.alert('Network Error', 'Please check your internet connection.');
            }
        }
    }

    useEffect(() => {
        handleGetExerciseLogReport()
    }, [selectedYear])

    useEffect(() => {
        if (exerciseLogReport.length > 1) {
            setAverageBurnedCalories(exerciseLogReport.reduce((acc, elr) => acc + elr.avg_burned_calories, 0) / exerciseLogReport.length)
        } else {
            setAverageBurnedCalories(0)
        }
    }, [exerciseLogReport])

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>

            <Wrapper>
                <CustomDropDown
                    data={years}
                    value={selectedYear}
                    setValue={setSelectedYear}
                />

                <CustomText>Rata-rata Asupan Makanan</CustomText>
                <CustomText size='lg' weight='heavy'>{Number(averageBurnedCalories).toFixed(2)} Kalori</CustomText>
            </Wrapper>

            {exerciseLogReport.length > 1 &&
                <CustomBarChart
                    data={exerciseLogReport}
                    x='month'
                    y='avg_burned_calories'
                    average={averageBurnedCalories}
                    renderLabel={(value, index) => [resolveMonthAbbreviation(index as number)]}
                />
            }

            <Wrapper>
                <CustomText size='lg' weight='heavy'>Detail log</CustomText>

                {exerciseLogReport.map((exerciseLog, index) => (
                    <View style={{ borderBottomWidth: 1, marginBottom: 10 }} id={String(index)}>
                        <CustomText size='md' weight='heavy'>{`Rata-rata: ${Number(exerciseLog.avg_burned_calories).toFixed(2)} Kalori`}</CustomText>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <CustomText size='sm'>Jumlah asupan: {exerciseLog.log_count}x</CustomText>
                            <CustomText size='sm'>{resolveMonthAbbreviation(index)}</CustomText>
                        </View>
                    </View>
                ))}
            </Wrapper>

        </ScrollView>
    )
}
