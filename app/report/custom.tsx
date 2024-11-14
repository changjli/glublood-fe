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

interface SelectedOptions {
    [key: string]: boolean
}

export default function CustomReportPage() {

    const { getLogReportByDate } = useReport()
    const { session } = useSession()
    const { fetchUserProfile } = useProfile()

    const [loading, setLoading] = useState({
        getLogReportByDate: false,
        getUserProfile: false,
    })
    const [selectedDate, setSelectedDate] = useState<string | string[]>([])
    const [options, setOptions] = useState([
        {
            title: 'Gula darah',
            label: 'glucose_log',
            value: false,
        },
        {
            title: 'Obats',
            label: 'medicine',
            value: false
        },
        {
            title: 'Olahraga',
            label: 'exercise_log',
            value: false
        },
        {
            title: 'Nutrisi',
            label: 'food_log',
            value: false
        }
    ])
    const [selectedOptions, setSelectedOptions] = useState(options.reduce((acc, option) => {
        acc[option.label] = option.value
        return acc
    }, {} as SelectedOptions))

    const handleGetLogReportByDate = async () => {
        try {
            const payload: GetLogReportByDateReq = {
                start_date: selectedDate[0],
                end_date: selectedDate[1],
                food_log: selectedOptions['food_log'] ?? false,
                exercise_log: selectedOptions['exercise_log'] ?? false,
                glucose_log: selectedOptions['glucose_log'] ?? false,
                medicine_log: selectedOptions['medicine_log'] ?? false,
            }

            console.log(payload)

            const res = await getLogReportByDate(() => setLoading({ ...loading, getLogReportByDate: true }), payload)
            return res.data
        } catch (err) {
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
            return []
        }
    }

    const handleGetUserProfile = async () => {
        try {
            const res = await fetchUserProfile(() => setLoading({ ...loading, getUserProfile: true }))
            return res.data
        } catch (err) {
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
            return []
        }
    }

    const handleDownloadOrShare = async (type: string) => {
        const logReports = await handleGetLogReportByDate()
        const userProfile = await handleGetUserProfile()

        if (type == 'download') {
            await downloadPdf(generateHtml(logReports, selectedOptions, userProfile))
        } else {
            await sharePdf(generateHtml(logReports, selectedOptions, userProfile))
        }
    }

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>

            <Wrapper>
                <CustomCalendarPicker
                    value={selectedDate}
                    setValue={setSelectedDate}
                    enableRangeInput={true}
                />

                <View style={{ marginVertical: 20 }}>
                    <CustomText weight='heavy'>Pilih Data yang Diinginkan</CustomText>
                    {options.map((option, idx) => (
                        <View
                            style={[
                                styles.checkboxItemContainer,
                                idx == 0 && { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
                                idx == options.length - 1 && { borderBottomLeftRadius: 20, borderBottomRightRadius: 20, borderBottomWidth: 0 }
                            ]}
                            id={String(idx)}
                        >
                            <CustomText>{option.title}</CustomText>
                            <Checkbox
                                style={styles.checkbox}
                                value={selectedOptions[option.label]}
                                onValueChange={() => {
                                    const temp = { ...selectedOptions }
                                    temp[option.label] = !selectedOptions[option.label]
                                    setSelectedOptions(temp)
                                }}
                                color={selectedOptions[option.label] ? Colors.light.primary : undefined}
                            />
                        </View>
                    ))}
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <CustomText weight='heavy'>Data Kesehatan</CustomText>
                    <TouchableOpacity>
                        <FontAwesome name='share' size={FontSize.md} color={Colors.light.primary} onPress={() => handleDownloadOrShare('share')} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.downloadContainer} onPress={() => handleDownloadOrShare('download')}>
                    <FontAwesome name='download' size={FontSize['2xl']} color={Colors.light.primary} />
                    <CustomText size='sm' style={{ color: Colors.light.gray400 }}>Data akan diunduh dalam format .pdf</CustomText>
                </TouchableOpacity>
            </Wrapper>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    checkboxItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.light.ternary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: Colors.light.gray500
    },
    checkbox: {
        borderColor: Colors.light.primary,
    },
    downloadContainer: {
        width: '100%',
        height: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.light.primary,
        borderRadius: 8,
    },
})
