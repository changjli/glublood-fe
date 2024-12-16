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
import { useCustomAlert } from '@/app/context/CustomAlertProvider';

export default function MonthlyGlucoseLogStatisticPage() {
    const { getGlucoseLogReportByMonth } = useGlucoseLog()
    const { showAlert } = useCustomAlert()

    const [loading, setLoading] = useState({
        getGlucoseLogReport: false,
    })
    const [glucoseLogReport, setGlucoseLogReport] = useState<GetGlucoseLogReportByMonthRes[]>([])
    const date = new Date()
    const [month, setMonth] = useState(date.getMonth())
    const [year, setyear] = useState(date.getFullYear())
    const [averageGlucoseRate, setAverageGlucoseRate] = useState(0)
    const filterReport = glucoseLogReport.filter(glucoseLog => glucoseLog.avg_glucose_rate != 0)

    const handleGetGlucoseLogReport = async () => {
        try {
            const res = await getGlucoseLogReportByMonth(() => setLoading({ ...loading, getGlucoseLogReport: true }), month, year)
            setGlucoseLogReport(res.data)
        } catch (err) {
            setGlucoseLogReport([])
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
        handleGetGlucoseLogReport()
    }, [month, year])

    useEffect(() => {
        if (glucoseLogReport.length > 1 && filterReport.length > 0) {
            setAverageGlucoseRate(glucoseLogReport.reduce((acc, glr) => acc + glr.avg_glucose_rate, 0) / filterReport.length)
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

                <CustomText>Rata-rata catatan glukosa</CustomText>
                <CustomText size='lg' weight='heavy'>{Number(averageGlucoseRate).toFixed(2)} mg/dL</CustomText>
            </Wrapper>

            {glucoseLogReport.length > 1 &&
                <CustomBarChart
                    data={glucoseLogReport}
                    x='week_range'
                    y='avg_glucose_rate'
                    average={averageGlucoseRate}
                    renderLabel={(value, index) => {
                        const dateRange = value ? value.split('~') : []

                        return [formatDateStripToSlash(dateRange[0])]
                    }}
                />
            }

            <Wrapper>
                <CustomText size='lg' weight='heavy'>Detail log</CustomText>

                {filterReport.map((glucoseLog, index) => (
                    <View style={{ borderBottomWidth: 1, marginBottom: 10 }} id={String(index)}>
                        <CustomText size='md' weight='heavy'>{`Rata-rata: ${Number(glucoseLog.avg_glucose_rate).toFixed(2)} mg/dL`}</CustomText>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <CustomText size='sm'>Jumlah pengambilan: {glucoseLog.log_count}x</CustomText>
                            <CustomText size='sm'>{`Minggu ${resolveNumberToString(index)}`}</CustomText>
                        </View>
                    </View>
                ))}
            </Wrapper>
        </ScrollView>
    )
}
