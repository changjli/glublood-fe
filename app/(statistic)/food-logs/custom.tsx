import { View, Text, Alert, ScrollView, Image, StyleSheet } from 'react-native'
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
import { formatDateStringIntl, formatDateStripToSlash, formatDateToDay } from '@/utils/formatDatetoString';
import { Colors } from '@/constants/Colors';

export default function CustomFoodLogStatisticPage() {
    const { getFoodLogReportByDate } = useFoodLog()

    const [range, setRange] = useState('')
    const rangeData = [
        { label: "Harian", value: "Harian" },
        { label: "Mingguan", value: "Mingguan" },
        { label: "Bulanan", value: "Bulanan" },
        { label: "Tahunan", value: "Tahunan" },
    ]
    const [loading, setLoading] = useState({
        getFoodLogReportByDate: false,
    })
    const [foodLogReport, setFoodLogReport] = useState<GetFoodLogReportByDateRes[]>([])
    const [selectedDate, setSelectedDate] = useState<string | string[]>([])
    const [averageCalories, setAverageCalories] = useState(0)

    const handleGetFoodLogReportByDate = async () => {
        try {
            const res = await getFoodLogReportByDate(() => setLoading({ ...loading, getFoodLogReportByDate: true }), selectedDate[0], selectedDate[1])
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
        if (Array.isArray(selectedDate) && selectedDate[0] && selectedDate[1]) {
            handleGetFoodLogReportByDate()
        }
    }, [selectedDate])

    useEffect(() => {
        if (foodLogReport.length > 1) {
            setAverageCalories(foodLogReport.reduce((acc, flr) => acc + flr.avg_calories, 0) / foodLogReport.length)
        } else {
            setAverageCalories(0)
        }
    }, [foodLogReport])

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>

            <Wrapper>
                <CustomCalendarPicker
                    value={selectedDate}
                    setValue={setSelectedDate}
                    enableRangeInput={true}
                />

                <CustomText>Rata-rata Asupan Makanan</CustomText>
                <CustomText size='lg' weight='heavy'>{Number(averageCalories).toFixed(2)} Kalori</CustomText>
            </Wrapper>

            {foodLogReport.length > 1 ? (
                <CustomBarChart
                    data={foodLogReport}
                    x='date'
                    y='avg_calories'
                    average={averageCalories}
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

                {foodLogReport.length > 1 ? (foodLogReport.map((foodLog, index) => (
                    <View style={{ borderBottomWidth: 1, marginBottom: 10 }} id={String(index)}>
                        <CustomText size='md' weight='heavy'>{`Rata-rata: ${Number(foodLog.avg_calories).toFixed(2)} Kalori`}</CustomText>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <CustomText size='sm'>Jumlah asupan: {foodLog.log_count}x</CustomText>
                            <CustomText size='sm'>{formatDateStringIntl(foodLog.date)}</CustomText>
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
