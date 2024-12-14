import { View, Text, Alert, ScrollView, Image, StyleSheet } from 'react-native'
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
import { formatDateStringIntl, formatDateStripToSlash, formatDateToDay } from '@/utils/formatDatetoString';
import { Colors } from '@/constants/Colors';
import { useCustomAlert } from '@/app/context/CustomAlertProvider';

export default function CustomExerciseLogStatisticPage() {
    const { getExerciseLogReportByDate } = useExerciseLog()
    const { showAlert } = useCustomAlert()

    const [range, setRange] = useState('')
    const rangeData = [
        { label: "Harian", value: "Harian" },
        { label: "Mingguan", value: "Mingguan" },
        { label: "Bulanan", value: "Bulanan" },
        { label: "Tahunan", value: "Tahunan" },
    ]
    const [loading, setLoading] = useState({
        getExerciseLogReportByDate: false,
    })
    const [exerciseLogReport, setExerciseLogReport] = useState<GetExerciseLogReportByDateRes[]>([])
    const [selectedDate, setSelectedDate] = useState<string | string[]>([])
    const [averageBurnedCalories, setAverageBurnedCalories] = useState(0)
    const filterReport = exerciseLogReport.filter(exerciseLog => exerciseLog.avg_burned_calories != 0)

    const handleGetExerciseLogReportByDate = async () => {
        try {
            const res = await getExerciseLogReportByDate(() => setLoading({ ...loading, getExerciseLogReportByDate: true }), selectedDate[0], selectedDate[1])
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
        if (Array.isArray(selectedDate) && selectedDate[0] && selectedDate[1]) {
            handleGetExerciseLogReportByDate()
        }
    }, [selectedDate])

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
                <CustomCalendarPicker
                    value={selectedDate}
                    setValue={setSelectedDate}
                    enableRangeInput={true}
                />

                <CustomText>Rata-rata Kalori Terbakar</CustomText>
                <CustomText size='lg' weight='heavy'>{Number(averageBurnedCalories).toFixed(2)} Kkal</CustomText>
            </Wrapper>

            {exerciseLogReport.length > 1 ? (
                <CustomBarChart
                    data={exerciseLogReport}
                    x='date'
                    y='avg_burned_calories'
                    average={averageBurnedCalories}
                    renderLabel={(value) => [formatDateStripToSlash(value), formatDateToDay(value)]}
                />) : (
                <Wrapper>
                    <View style={styles.notFoundContainer}>
                        <CustomText weight='heavy'>Diagram batang</CustomText>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Image source={require('@/assets/images/characters/body-blood.png')} />
                            <CustomText>Tidak ada diagram batang</CustomText>
                        </View>
                    </View>
                </Wrapper>)
            }

            <Wrapper>
                <CustomText size='lg' weight='heavy'>Detail log</CustomText>

                {exerciseLogReport.length > 1 ? (filterReport.map((exerciseLog, index) => (
                    <View style={{ borderBottomWidth: 1, marginBottom: 10 }} id={String(index)}>
                        <CustomText size='md' weight='heavy'>{`Rata-rata: ${Number(exerciseLog.avg_burned_calories).toFixed(2)} Kkal`}</CustomText>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <CustomText size='sm'>Jumlah aktivitas: {exerciseLog.log_count}x</CustomText>
                            <CustomText size='sm'>{formatDateStringIntl(exerciseLog.date)}</CustomText>
                        </View>
                    </View>
                ))) : (
                    <Text style={{ textAlign: 'center' }}>Belum ada detail log</Text>
                )}
            </Wrapper>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    notFoundContainer: {
        backgroundColor: 'white',
        padding: 8,
        borderColor: Colors.light.primary,
        borderWidth: 1,
        borderRadius: 10,
        gap: 8,
    }
})
