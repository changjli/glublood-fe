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
import { resolveNumberToString } from '@/utils/resolver';

export default function MonthlyGlucoseLogStatisticPage() {
    const { getGlucoseLogReportByMonth } = useGlucoseLog()

    const [loading, setLoading] = useState({
        getGlucoseLogReport: false,
    })
    const [glucoseLogReport, setGlucoseLogReport] = useState<GetGlucoseLogReportByMonthRes[]>([])
    const date = new Date()
    const [month, setMonth] = useState(date.getMonth())
    const [year, setyear] = useState(date.getFullYear())
    const [averageGlucoseRate, setAverageGlucoseRate] = useState(0)

    const handleGetGlucoseLogReport = async () => {
        try {
            const res = await getGlucoseLogReportByMonth(() => setLoading({ ...loading, getGlucoseLogReport: true }), month, year)
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
    }, [month, year])

    useEffect(() => {
        if (glucoseLogReport.length > 1) {
            setAverageGlucoseRate(glucoseLogReport.reduce((acc, glr) => acc + glr.avg_glucose_rate, 0) / glucoseLogReport.length)
        } else {
            setAverageGlucoseRate(0)
        }
    }, [glucoseLogReport])

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
                <CustomText size='lg' weight='heavy'>{Number(averageGlucoseRate).toFixed(2)} Kalori</CustomText>
            </Wrapper>

            {glucoseLogReport.length > 1 &&
                <CustomBarChart
                    data={glucoseLogReport}
                    x='week_range'
                    y='avg_calories'
                    renderLabel={(value, index) => {
                        const dateRange = value.split('~')

                        return ['Minggu', resolveNumberToString(index as number), formatDateStripToSlash(dateRange[0]), formatDateStripToSlash(dateRange[1])]
                    }}
                />
            }

            <Wrapper>
                <CustomText size='lg' weight='heavy'>Detail log</CustomText>

                {glucoseLogReport.map((glucoseLog, index) => (
                    <View style={{ borderBottomWidth: 1, marginBottom: 10 }} id={String(index)}>
                        <CustomText size='md' weight='heavy'>{`Rata-rata: ${Number(glucoseLog.avg_glucose_rate).toFixed(2)} Kalori`}</CustomText>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <CustomText size='sm'>Jumlah asupan: {glucoseLog.log_count}</CustomText>
                            <CustomText size='sm'>{`Minggu ${resolveNumberToString(index)}`}</CustomText>
                        </View>
                    </View>
                ))}
            </Wrapper>
        </ScrollView>
    )
}
