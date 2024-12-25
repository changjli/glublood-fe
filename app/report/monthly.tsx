import { View, Text, Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
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
import { formatDateStripToSlash, formatDatetoStringYmd, getFirstAndLastDayOfMonth } from '@/utils/formatDatetoString';
import { resolveNumberToString } from '@/utils/resolver';
import useReport from '@/hooks/api/report/useReport';
import { downloadPdf, sharePdf } from '@/utils/generatePdf';
import generateHtml from '@/utils/generateHtml';
import { Colors } from '@/constants/Colors';
import Checkbox from 'expo-checkbox';
import { FontAwesome } from '@expo/vector-icons';
import { FontSize } from '@/constants/Typography';
import useProfile from '@/hooks/api/profile/useProfile';
import LogReportForm from '@/components/LogReportForm';

interface SelectedOptions {
    [key: string]: boolean
}

export default function MonthlyReportPage() {

    const date = new Date()
    const [month, setMonth] = useState(date.getMonth())
    const [year, setyear] = useState(date.getFullYear())

    return (
        <Wrapper style={{ flex: 1, backgroundColor: 'white' }}>
            <View>
                <CustomMonthYearPicker
                    month={month}
                    year={year}
                    setMonth={setMonth}
                    setyear={setyear}
                />
            </View>
            <LogReportForm
                startDate={formatDatetoStringYmd(new Date(year, month, 1))}
                endDate={formatDatetoStringYmd(new Date(year, month + 1, 0))}
            />
        </Wrapper>
    )
}


