import { View, Text, Alert, ScrollView, StyleSheet, Image } from 'react-native'
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
import { formatDateIntl, formatDateStripToSlash, formatDateToDay } from '@/utils/formatDatetoString';
import { FlatList } from 'react-native-reanimated/lib/typescript/Animated';
import { Colors } from '@/constants/Colors';

export default function WeeklyFoodLogStatisticPage() {
    const { getFoodLogReportByDate } = useFoodLog()

    const [loading, setLoading] = useState({
        getFoodLogReportByDate: false,
    })
    const [foodLogReport, setFoodLogReport] = useState<GetFoodLogReportByDateRes[]>([])
    const [selectedDate, setSelectedDate] = useState<string | string[]>('')
    const [averageCalories, setAverageCalories] = useState(0)

    const addDate = (date: string) => {
        const initialDate = new Date(date);
        initialDate.setDate(initialDate.getDate() + 7);
        const year = initialDate.getFullYear();
        const month = String(initialDate.getMonth() + 1).padStart(2, '0');
        const day = String(initialDate.getDate()).padStart(2, '0');
        const newDate = `${year}-${month}-${day}`;
        return newDate;
    }

    const handleGetFoodLogReportByDate = async () => {
        try {
            const res = await getFoodLogReportByDate(() => setLoading({ ...loading, getFoodLogReportByDate: true }), selectedDate as string, addDate(selectedDate as string))
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
        if (selectedDate != '') {
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
                    enableRangeInput={false}
                />

                <CustomText>Rata-rata Asupan Makanan</CustomText>
                <CustomText size='lg' weight='heavy'>{Number(averageCalories).toFixed(2)} Kalori</CustomText>
            </Wrapper>

            {foodLogReport.length > 1 ? (
                <CustomBarChart
                    data={foodLogReport}
                    x='date'
                    y='avg_calories'
                    renderLabel={(value) => [formatDateStripToSlash(value), formatDateToDay(value)]}
                />) : (<Wrapper>
                    <View style={styles.notFoundContainer}>
                        <CustomText weight='heavy'>Diagram batang</CustomText>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Image source={require('@/assets/images/characters/body-blood.png')} />
                            <CustomText>Tidak ada diagram batang</CustomText>
                        </View>
                    </View>
                </Wrapper>)}

            <Wrapper>
                <CustomText size='lg' weight='heavy'>Detail log</CustomText>

                {foodLogReport.length > 1 ? (foodLogReport.map((foodLog, index) => (
                    <View style={{ borderBottomWidth: 1, marginBottom: 10 }} id={String(index)}>
                        <CustomText size='md' weight='heavy'>{`Rata-rata: ${Number(foodLog.avg_calories).toFixed(2)} Kalori`}</CustomText>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <CustomText size='sm'>Jumlah asupan: 3x</CustomText>
                            <CustomText size='sm'>{formatDateIntl(foodLog.date)}</CustomText>
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
