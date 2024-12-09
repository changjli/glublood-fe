import { View, Text, Alert, ScrollView, Image, StyleSheet } from 'react-native'
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
import { formatDateStringIntl, formatDateStripToSlash, formatDateToDay } from '@/utils/formatDatetoString';
import { Colors } from '@/constants/Colors';

export default function CustomGlucoseLogStatisticPage() {
    const { getGlucoseLogReportByDate } = useGlucoseLog()

    const [range, setRange] = useState('')
    const rangeData = [
        { label: "Harian", value: "Harian" },
        { label: "Mingguan", value: "Mingguan" },
        { label: "Bulanan", value: "Bulanan" },
        { label: "Tahunan", value: "Tahunan" },
    ]
    const [loading, setLoading] = useState({
        getGlucoseLogReportByDate: false,
    })
    const [glucoseLogReport, setGlucoseLogReport] = useState<GetGlucoseLogReportByDateRes[]>([])
    const [selectedDate, setSelectedDate] = useState<string | string[]>([])
    const [averageGlucoseRate, setAverageGlucoseRate] = useState(0)
    const filterReport = glucoseLogReport.filter(glucoseLog => glucoseLog.avg_glucose_rate != 0)

    const handleGetGlucoseLogReportByDate = async () => {
        try {
            const res = await getGlucoseLogReportByDate(() => setLoading({ ...loading, getGlucoseLogReportByDate: true }), selectedDate[0], selectedDate[1])
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
        if (Array.isArray(selectedDate) && selectedDate[0] && selectedDate[1]) {
            handleGetGlucoseLogReportByDate()
        }
    }, [selectedDate])

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
                <CustomCalendarPicker
                    value={selectedDate}
                    setValue={setSelectedDate}
                    enableRangeInput={true}
                />

                <CustomText>Rata-rata catatan glukosa</CustomText>
                <CustomText size='lg' weight='heavy'>{Number(averageGlucoseRate).toFixed(2)} mg/dL</CustomText>
            </Wrapper>

            {glucoseLogReport.length > 1 ? (
                <CustomBarChart
                    data={glucoseLogReport}
                    x='date'
                    y='avg_glucose_rate'
                    average={averageGlucoseRate}
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

                {glucoseLogReport.length > 1 ? (filterReport.map((glucoseLog, index) => (
                    <View style={{ borderBottomWidth: 1, marginBottom: 10 }} id={String(index)}>
                        <CustomText size='md' weight='heavy'>{`Rata-rata: ${Number(glucoseLog.avg_glucose_rate).toFixed(2)} mg/dL`}</CustomText>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <CustomText size='sm'>Jumlah pengambilan: {glucoseLog.log_count}x</CustomText>
                            <CustomText size='sm'>{formatDateStringIntl(glucoseLog.date)}</CustomText>
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
