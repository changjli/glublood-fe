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
import { resolveMonthAbbreviation } from '@/utils/resolver';

export default function YearlyFoodLogStatisticPage() {
    const { getFoodLogReportByYear } = useFoodLog()

    const years = Array.from({ length: 100 }, (_, i) => ({
        label: `${new Date().getFullYear() - i}`,
        value: new Date().getFullYear() - i,
    }));

    const [loading, setLoading] = useState({
        getFoodLogReport: false,
    })
    const [foodLogReport, setFoodLogReport] = useState<GetFoodLogReportByYearhRes[]>([])
    const date = new Date()
    const [selectedYear, setSelectedYear] = useState(date.getFullYear())
    const [averageCalories, setAverageCalories] = useState(0)
    const filterReport = foodLogReport.filter(foodLog => foodLog.avg_calories != 0)

    const handleGetFoodLogReport = async () => {
        try {
            const res = await getFoodLogReportByYear(() => setLoading({ ...loading, getFoodLogReport: true }), selectedYear)
            setFoodLogReport(res.data)
        } catch (err) {
            setFoodLogReport([])
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
        handleGetFoodLogReport()
    }, [selectedYear])

    useEffect(() => {
        if (foodLogReport.length > 1 && filterReport.length > 0) {
            setAverageCalories(foodLogReport.reduce((acc, flr) => acc + flr.avg_calories, 0) / filterReport.length)
        } else {
            setAverageCalories(0)
        }
    }, [foodLogReport])

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>

            <Wrapper>
                <CustomDropDown
                    data={years}
                    value={selectedYear}
                    setValue={setSelectedYear}
                />

                <CustomText>Rata-rata Asupan Makanan</CustomText>
                <CustomText size='lg' weight='heavy'>{Number(averageCalories).toFixed(2)} Kkal</CustomText>
            </Wrapper>

            {foodLogReport.length > 1 &&
                <CustomBarChart
                    data={foodLogReport}
                    x='month'
                    y='avg_calories'
                    average={averageCalories}
                    renderLabel={(value, index) => [resolveMonthAbbreviation(index as number)]}
                />
            }

            <Wrapper>
                <CustomText size='lg' weight='heavy'>Detail log</CustomText>

                {filterReport.map((foodLog, index) => (
                    <View style={{ borderBottomWidth: 1, marginBottom: 10 }} id={String(index)}>
                        <CustomText size='md' weight='heavy'>{`Rata-rata: ${Number(foodLog.avg_calories).toFixed(2)} Kkal`}</CustomText>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <CustomText size='sm'>Jumlah asupan: {foodLog.log_count}x</CustomText>
                            <CustomText size='sm'>{resolveMonthAbbreviation(index)}</CustomText>
                        </View>
                    </View>
                ))}
            </Wrapper>

        </ScrollView>
    )
}
