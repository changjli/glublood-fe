import { View, Text, Alert, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Wrapper from '@/components/Layout/Wrapper';
import axios from 'axios';
import CustomText from '@/components/CustomText';
import CustomBarChart from '@/components/CustomBarChart';
import CustomCalendarPicker from '@/components/CustomCalendarPicker';
import { formatDateStringIntl, formatDateStripToSlash, formatDateToDay } from '@/utils/formatDatetoString';
import { Colors } from '@/constants/Colors';
import useReport from '@/hooks/api/report/useReport';
import CustomButton from '@/components/CustomButton';
import { downloadPdf, sharePdf } from '@/utils/generatePdf';
import Checkbox from 'expo-checkbox';
import { FontAwesome } from '@expo/vector-icons';
import { FontSize } from '@/constants/Typography';
import useProfile from '@/hooks/api/profile/useProfile';
import generateHtml from '@/utils/generateHtml';
import Loader from './Loader';
import { useCustomAlert } from '@/app/context/CustomAlertProvider';
import { useUserProfile } from '@/hooks/useUserProfile';

interface SelectedOptions {
    [key: string]: boolean
}

interface ReportFormProps {
    startDate: string,
    endDate: string,
}

const optionData = [
    {
        title: 'Gula Darah',
        label: 'glucose_log',
        value: false,
    },
    // {
    //     title: 'Obat',
    //     label: 'medicine_log',
    //     value: false
    // },
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
]

export default function LogReportForm({ startDate, endDate }: ReportFormProps) {

    const { profile } = useUserProfile()

    const { getLogReportByDate } = useReport()
    const { fetchUserProfile } = useProfile()
    const { showAlert } = useCustomAlert()

    const [selectedDate, setSelectedDate] = useState<string | string[]>([])
    const [options, setOptions] = useState(optionData)
    const [selectedOptions, setSelectedOptions] = useState(options.reduce((acc, option) => {
        acc[option.label] = option.value
        return acc
    }, {} as SelectedOptions))
    const [disabled, setDisabled] = useState(true)
    const [getProfileLoading, setGetProfileLoading] = useState(false)
    const [downloadLoading, setDownloadLoading] = useState(false)

    const handleGetLogReportByDate = async () => {
        try {
            const payload: GetLogReportByDateReq = {
                start_date: startDate,
                end_date: endDate,
                food_log: selectedOptions['food_log'] ?? false,
                exercise_log: selectedOptions['exercise_log'] ?? false,
                glucose_log: selectedOptions['glucose_log'] ?? false,
                medicine_log: selectedOptions['medicine_log'] ?? false,
            }

            console.log(payload)

            const res = await getLogReportByDate(setDownloadLoading, payload)
            return res.data
        } catch (err) {
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
            return []
        }
    }

    const handleGetUserProfile = async () => {
        try {
            const res = await fetchUserProfile(setGetProfileLoading)
            return res.data
        } catch (err) {
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
            return []
        }
    }

    const handleDownloadOrShare = async (type: string) => {
        const logReports = await handleGetLogReportByDate() as GetLogReportByDateRes[]
        const userProfile = await handleGetUserProfile()

        if (type == 'download') {
            await downloadPdf(generateHtml(logReports, selectedOptions, userProfile, startDate, endDate))
        } else {
            await sharePdf(generateHtml(logReports, selectedOptions, userProfile, startDate, endDate))
        }
    }

    useEffect(() => {
        if (Object.keys(selectedOptions).find(key => selectedOptions[key]) && startDate != '' && endDate != '') {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [selectedOptions, startDate, endDate])

    useEffect(() => {
        if (!profile?.is_diabetes) {
            const filteredOptions = optionData.filter(option => option.title != 'Gula Darah')
            setOptions(filteredOptions)
        } else {
            setOptions(optionData)
        }
    }, [profile])

    return (
        <>
            <Loader visible={downloadLoading} />
            <View style={{ marginVertical: 20 }}>
                <CustomText weight='heavy'>Pilih Data yang Diinginkan</CustomText>
                <View style={styles.checkBoxContainer}>
                    {options.map((option, idx) => (
                        <TouchableOpacity
                            style={[
                                styles.checkboxItemContainer,
                                idx == 0 && { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
                                idx == options.length - 1 && { borderBottomLeftRadius: 20, borderBottomRightRadius: 20, borderBottomWidth: 0 }
                            ]}
                            id={String(idx)}
                            onPress={() => {
                                const temp = { ...selectedOptions }
                                temp[option.label] = !selectedOptions[option.label]
                                setSelectedOptions(temp)
                            }}
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
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <CustomText weight='heavy'>Data Kesehatan</CustomText>
                <FontAwesome name='share' size={FontSize.md} color={disabled ? Colors.light.gray400 : Colors.light.primary} onPress={!disabled ? () => handleDownloadOrShare('share') : undefined} />
            </View>
            <TouchableOpacity style={[
                styles.downloadContainer,
                { borderColor: disabled ? Colors.light.gray400 : Colors.light.primary }
            ]} onPress={!disabled ? () => handleDownloadOrShare('download') : undefined}>
                <FontAwesome name='download' size={FontSize['2xl']} color={disabled ? Colors.light.gray300 : Colors.light.primary} />
                <CustomText size='sm' style={{ color: Colors.light.gray400 }}>Tekan untuk mengunduh data dalam format .pdf</CustomText>
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    checkBoxContainer: {
        backgroundColor: 'white',
        elevation: 3,
        borderRadius: 20,
    },
    checkboxItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: Colors.light.gray300,
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
        borderRadius: 8,
    },
})
