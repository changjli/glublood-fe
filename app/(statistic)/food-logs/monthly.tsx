import { View, Text, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomDropDown from '@/components/CustomDropDown'
import Wrapper from '@/components/Layout/Wrapper';
import useFoodLog from '@/hooks/api/food_log/useFoodLog';
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

export default function MonthlyFoodLogStatisticPage() {
    const { getFoodLogReportByMonth } = useFoodLog()
    const { showAlert } = useCustomAlert()

    const [loading, setLoading] = useState({
        getFoodLogReport: false,
    })
    const [foodLogReport, setFoodLogReport] = useState<GetFoodLogReportByMonthRes[]>([])
    const date = new Date()
    const [month, setMonth] = useState(date.getMonth())
    const [year, setyear] = useState(date.getFullYear())
    const [averageCalories, setAverageCalories] = useState(0)
    const filterReport = foodLogReport.filter(foodLog => foodLog.avg_calories != 0)

    const handleGetFoodLogReport = async () => {
        try {
            const res = await getFoodLogReportByMonth(() => setLoading({ ...loading, getFoodLogReport: true }), month + 1, year)
            setFoodLogReport(res.data)
        } catch (err) {
            setFoodLogReport([])
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
        handleGetFoodLogReport()
    }, [month, year])

    useEffect(() => {
        if (foodLogReport.length > 1 && filterReport.length > 0) {
            setAverageCalories(foodLogReport.reduce((acc, flr) => acc + flr.avg_calories, 0) / filterReport.length)
        } else {
            setAverageCalories(0)
        }
    }, [foodLogReport])

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>

            <Wrapper>
                <CustomMonthYearPicker
                    month={month}
                    year={year}
                    setMonth={setMonth}
                    setyear={setyear}
                />

                <CustomText>Rata-rata Asupan Makanan</CustomText>
                <CustomText size='lg' weight='heavy'>{Number(averageCalories).toFixed(2)} Kkal</CustomText>
            </Wrapper>

            {foodLogReport.length > 1 &&
                <CustomBarChart
                    data={foodLogReport}
                    x='week_range'
                    y='avg_calories'
                    average={averageCalories}
                    renderLabel={(value, index) => {
                        const dateRange = value ? value.split('~') : []

                        return [formatDateStripToSlash(dateRange[0])]
                    }}
                />
            }

            <Wrapper>
                <CustomText size='lg' weight='heavy'>Detail log</CustomText>

                {foodLogReport.map((foodLog, index) => foodLog.avg_calories != 0 && (
                    <View style={{ borderBottomWidth: 1, marginBottom: 10 }} id={String(index)}>
                        <CustomText size='md' weight='heavy'>{`Rata-rata: ${Number(foodLog.avg_calories).toFixed(2)} Kkal`}</CustomText>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <CustomText size='sm'>Jumlah asupan: {foodLog.log_count}x</CustomText>
                            <CustomText size='sm'>{`Minggu ${resolveNumberToString(index)}`}</CustomText>
                        </View>
                    </View>
                ))}
            </Wrapper>
        </ScrollView>
    )
}
