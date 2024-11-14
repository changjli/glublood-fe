import { View, Text, Alert, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Wrapper from '@/components/Layout/Wrapper';
import axios from 'axios';
import CustomText from '@/components/CustomText';
import CustomBarChart from '@/components/CustomBarChart';
import CustomCalendarPicker from '@/components/CustomCalendarPicker';
import { formatDateIntl, formatDateStripToSlash, formatDateToDay } from '@/utils/formatDatetoString';
import { Colors } from '@/constants/Colors';
import useReport from '@/hooks/api/report/useReport';
import CustomButton from '@/components/CustomButton';
import generateHtml from '../../utils/generateHtml';
import { downloadPdf, sharePdf } from '@/utils/generatePdf';
import Checkbox from 'expo-checkbox';
import { FontAwesome } from '@expo/vector-icons';
import { FontSize } from '@/constants/Typography';
import { useSession } from '../context/AuthenticationProvider';
import useProfile from '@/hooks/api/profile/useProfile';
import LogReportForm from '@/components/LogReportForm';

interface SelectedOptions {
    [key: string]: boolean
}

export default function CustomReportPage() {

    const [selectedDate, setSelectedDate] = useState<string | string[]>([])

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>

            <Wrapper>
                <CustomCalendarPicker
                    value={selectedDate}
                    setValue={setSelectedDate}
                    enableRangeInput={true}
                />

                <LogReportForm
                    startDate={selectedDate[0]}
                    endDate={selectedDate[1]}
                />
            </Wrapper>

        </ScrollView>
    )
}

