import { View, Text, Alert, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native'
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
import useReport from '@/hooks/api/report/useReport';
import Checkbox from 'expo-checkbox';
import { FontAwesome } from '@expo/vector-icons';
import { FontSize } from '@/constants/Typography';
import { downloadPdf, sharePdf } from '@/utils/generatePdf';
import generateHtml from '@/utils/generateHtml';
import useProfile from '@/hooks/api/profile/useProfile';
import LogReportForm from '@/components/LogReportForm';

interface SelectedOptions {
    [key: string]: boolean
}

export default function WeeklyReportPage() {

    const [selectedDate, setSelectedDate] = useState<string | string[]>('')

    const addDate = (date: string) => {
        const initialDate = new Date(date);
        initialDate.setDate(initialDate.getDate() + 7);
        const year = initialDate.getFullYear();
        const month = String(initialDate.getMonth() + 1).padStart(2, '0');
        const day = String(initialDate.getDate()).padStart(2, '0');
        const newDate = `${year}-${month}-${day}`;
        return newDate;
    }

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>

            <Wrapper>
                <CustomCalendarPicker
                    value={selectedDate}
                    setValue={setSelectedDate}
                    enableRangeInput={false}
                />

                <LogReportForm
                    startDate={selectedDate as string}
                    endDate={addDate(selectedDate as string)}
                />
            </Wrapper>

        </ScrollView>
    )
}

