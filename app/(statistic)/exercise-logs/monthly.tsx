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
import { resolveNumberToString } from '@/utils/resolver';
import { useCustomAlert } from '@/app/context/CustomAlertProvider';

export default function MonthlyExerciseLogStatisticPage() {
    const { getExerciseLogReportByMonth } = useExerciseLog()
    const { showAlert } = useCustomAlert()

    const [loading, setLoading] = useState({
        getExerciseLogReport: false,
    })
    const [exerciseLogReport, setExerciseLogReport] = useState<GetExerciseLogReportByMonthRes[]>([])
    const date = new Date()
    const [month, setMonth] = useState(date.getMonth())
    const [year, setyear] = useState(date.getFullYear())
    const [averageBurnedCalories, setAverageBurnedCalories] = useState(0)
    const filterReport = exerciseLogReport.filter(exerciseLog => exerciseLog.avg_burned_calories != 0)

    const handleGetExerciseLogReport = async () => {
        try {
            const res = await getExerciseLogReportByMonth(() => setLoading({ ...loading, getExerciseLogReport: true }), month + 1, year)
            setExerciseLogReport(res.data)
        } catch (err) {
            setExerciseLogReport([])
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    showAlert('Invalid request. Please check your input.', 'error');
                } else if (status === 500) {
                    showAlert('A server error occurred. Please try again later.', 'error');
                } else {
                    // showAlert(`An error occurred: ${status}. Please try again later.`, 'error');
                }
            } else {
                console.log('Unexpected Error:', err);
                showAlert('Please check your internet connection.', 'error');
            }
        }
    }

    useEffect(() => {
        handleGetExerciseLogReport()
    }, [month, year])

    useEffect(() => {
        if (exerciseLogReport.length > 1 && filterReport.length > 0) {
            setAverageBurnedCalories(exerciseLogReport.reduce((acc, elr) => acc + elr.avg_burned_calories, 0) / filterReport.length)
        } else {
            setAverageBurnedCalories(0)
        }
    }, [exerciseLogReport])

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>

            <Wrapper>
                <CustomMonthYearPicker
                    month={month}
                    year={year}
                    setMonth={setMonth}
                    setyear={setyear}
                />

                <CustomText>Rata-rata Kalori Terbakar</CustomText>
                <CustomText size='lg' weight='heavy'>{Number(averageBurnedCalories).toFixed(2)} Kkal</CustomText>
            </Wrapper>

            {exerciseLogReport.length > 1 &&
                <CustomBarChart
                    data={exerciseLogReport}
                    x='week_range'
                    y='avg_burned_calories'
                    average={averageBurnedCalories}
                    renderLabel={(value, index) => {
                        const dateRange = value ? value.split('~') : []

                        return [formatDateStripToSlash(dateRange[0])]
                    }}
                />
            }

            <Wrapper>
                <CustomText size='lg' weight='heavy'>Detail log</CustomText>

                {filterReport.map((exerciseLog, index) => (
                    <View style={{ borderBottomWidth: 1, marginBottom: 10 }} id={String(index)}>
                        <CustomText size='md' weight='heavy'>{`Rata-rata: ${Number(exerciseLog.avg_burned_calories).toFixed(2)} Kkal`}</CustomText>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <CustomText size='sm'>Jumlah aktivitas: {exerciseLog.log_count}x</CustomText>
                            <CustomText size='sm'>{`Minggu ${resolveNumberToString(index)}`}</CustomText>
                        </View>
                    </View>
                ))}
            </Wrapper>
        </ScrollView>
    )
}
