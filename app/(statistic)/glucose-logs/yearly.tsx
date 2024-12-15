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
import { useCustomAlert } from '@/app/context/CustomAlertProvider';

export default function YearlyGlucoseLogStatisticPage() {
    const { getGlucoseLogReportByYear } = useGlucoseLog()
    const { showAlert } = useCustomAlert()

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
    const filterReport = glucoseLogReport.filter(glucoseLog => glucoseLog.avg_glucose_rate != 0)

    const handleGetGlucoseLogReport = async () => {
        try {
            const res = await getGlucoseLogReportByYear(() => setLoading({ ...loading, getGlucoseLogReport: true }), selectedYear)
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
    }, [selectedYear])

    useEffect(() => {
        if (glucoseLogReport.length > 1 && filterReport.length > 0) {
            setAverageGlucoseRate(glucoseLogReport.reduce((acc, glr) => acc + glr.avg_glucose_rate, 0) / filterReport.length)
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

                <CustomText>Rata-rata catatan glukosa</CustomText>
                <CustomText size='lg' weight='heavy'>{Number(averageGlucoseRate).toFixed(2)} mg/dL</CustomText>
            </Wrapper>

            {glucoseLogReport.length > 1 &&
                <CustomBarChart
                    data={glucoseLogReport}
                    x='month'
                    y='avg_glucose_rate'
                    average={averageGlucoseRate}
                    renderLabel={(value, index) => [value.slice(0, 3)]}
                />
            }

            <Wrapper>
                <CustomText size='lg' weight='heavy'>Detail log</CustomText>

                {filterReport.map((glucoseLog, index) => (
                    <View style={{ borderBottomWidth: 1, marginBottom: 10 }} id={String(index)}>
                        <CustomText size='md' weight='heavy'>{`Rata-rata: ${Number(glucoseLog.avg_glucose_rate).toFixed(2)} mg/dL`}</CustomText>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <CustomText size='sm'>Jumlah pengambilan: {glucoseLog.log_count}x</CustomText>
                            <CustomText size='sm'>{glucoseLog.month.slice(0, 3)}</CustomText>
                        </View>
                    </View>
                ))}
            </Wrapper>

        </ScrollView>
    )
}
