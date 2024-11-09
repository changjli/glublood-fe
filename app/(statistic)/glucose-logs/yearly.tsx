import { View, Text, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomDropDown from '@/components/CustomDropDown'
import Wrapper from '@/components/Layout/Wrapper';
import useGlucoseLog from '@/hooks/api/logs/glucose/useGlucoseLog';
import axios from 'axios';
import CustomText from '@/components/CustomText';
import CustomBarChart from '@/components/CustomBarChart';
import CustomCalendarPicker from '@/components/CustomCalendarPicker';
import { VictoryChart, VictoryScatter, VictoryTheme, VictoryZoomContainer } from 'victory-native';
import SegmentedControl from '@/components/SegmentedControl';
import CustomMonthYearPicker from '@/components/CustomMonthYearPicker';
import { formatDateStripToSlash } from '@/utils/formatDatetoString';
import { resolveMonthAbbreviation } from '@/utils/resolver';

export default function YearlyGlucoseLogStatisticPage() {
    const { getGlucoseLogReportByYear } = useGlucoseLog()

    const years = Array.from({ length: 100 }, (_, i) => ({
        label: `${new Date().getFullYear() - i}`,
        value: new Date().getFullYear() - i,
    }));

    const [loading, setLoading] = useState({
        getGlucoseLogReport: false,
    })
    const [glucoseLogReport, setGlucoseLogReport] = useState<GetGlucoseLogReportByYearhRes[]>([])
    const date = new Date()
    const [selectedYear, setSelectedYear] = useState(date.getFullYear())
    const [averageGlucoseRate, setAverageGlucoseRate] = useState(0)

    const handleGetGlucoseLogReport = async () => {
        try {
            const res = await getGlucoseLogReportByYear(() => setLoading({ ...loading, getGlucoseLogReport: true }), selectedYear)
            setGlucoseLogReport(res.data)
        } catch (err) {
            setGlucoseLogReport([])
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
        handleGetGlucoseLogReport()
    }, [selectedYear])

    useEffect(() => {
        if (glucoseLogReport.length > 1) {
            setAverageGlucoseRate(glucoseLogReport.reduce((acc, glr) => acc + glr.avg_glucose_rate, 0) / glucoseLogReport.length)
        } else {
            setAverageGlucoseRate(0)
        }
    }, [glucoseLogReport])

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>

            <Wrapper>
                <CustomDropDown
                    data={years}
                    value={selectedYear}
                    setValue={setSelectedYear}
                />

                <CustomText>Rata-rata Asupan Makanan</CustomText>
                <CustomText size='lg' weight='heavy'>{Number(averageGlucoseRate).toFixed(2)} Kalori</CustomText>
            </Wrapper>

            {glucoseLogReport.length > 1 &&
                <CustomBarChart
                    data={glucoseLogReport}
                    x='month'
                    y='avg_calories'
                    renderLabel={(value, index) => [resolveMonthAbbreviation(index as number)]}
                />
            }

            <Wrapper>
                <CustomText size='lg' weight='heavy'>Detail log</CustomText>

                {glucoseLogReport.map((glucoseLog, index) => (
                    <View style={{ borderBottomWidth: 1, marginBottom: 10 }} id={String(index)}>
                        <CustomText size='md' weight='heavy'>{`Rata-rata: ${Number(glucoseLog.avg_glucose_rate).toFixed(2)} Kalori`}</CustomText>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <CustomText size='sm'>Jumlah asupan: {glucoseLog.log_count}</CustomText>
                            <CustomText size='sm'>{resolveMonthAbbreviation(index)}</CustomText>
                        </View>
                    </View>
                ))}
            </Wrapper>

        </ScrollView>
    )
}
