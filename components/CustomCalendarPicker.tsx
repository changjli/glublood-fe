import { View, Text } from 'react-native'
import React, { useState } from 'react'
import CalendarPicker from "react-native-calendar-picker"
import { Colors } from '@/constants/Colors'
import CustomTextInput from './CustomInput/CustomTextInput'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { FontSize } from '@/constants/Typography'
import CustomModal from './CustomModal'
import { formatDateStringToDmy, formatDatetoStringYmd, } from '@/utils/formatDatetoString'
import CustomButton from './CustomButton'

interface CustomCalendarPickerProps {
    value: string | string[]
    setValue: (value: string | string[]) => void
    enableRangeInput: boolean
}

export default function CustomCalendarPicker({ value, setValue, enableRangeInput = false }: CustomCalendarPickerProps) {
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedDate, setSelectedDate] = useState<string | string[]>(enableRangeInput ? [] : '')

    return (
        <View>
            <CustomTextInput
                label='Tanggal'
                prefix={(
                    <Ionicons name='calendar' size={FontSize.lg} />
                )}
                value={enableRangeInput ? `${value[0] ? formatDateStringToDmy(value[0]) : 'dd-MM-YYYY'} ~ ${value[1] ? formatDateStringToDmy(value[1]) : 'dd-MM-YYYY'}` : value == '' ? 'dd-MM-YYYY' : formatDateStringToDmy(value as string)}
                onPress={() => setModalVisible(true)}
            />
            <CustomModal
                isVisible={modalVisible}
                toggleModal={() => setModalVisible(false)}
            >
                {enableRangeInput && (<Text>{`${selectedDate[0] ?? 'dd-MM-YYYY'} ~ ${selectedDate[1] ?? 'dd-MM-YYYY'}`}</Text>)}
                <CalendarPicker
                    allowRangeSelection={enableRangeInput}
                    allowBackwardRangeSelect={enableRangeInput}
                    onDateChange={(date, type) => {
                        if (date != null) {
                            if (enableRangeInput) {
                                const temp = [...selectedDate]
                                if (type === 'END_DATE') {
                                    temp[1] = formatDatetoStringYmd(date)
                                } else {
                                    temp[0] = formatDatetoStringYmd(date)
                                }
                                setSelectedDate(temp)
                            } else {
                                setSelectedDate(formatDatetoStringYmd(date))
                            }
                        }
                    }}
                    selectedDayColor={Colors.light.primary}
                    selectedDayTextColor='white'
                />
                <CustomButton
                    title='Pilih tanggal'
                    onPress={() => {
                        setValue(selectedDate)
                        setModalVisible(false)
                    }}
                    size='md'
                />
            </CustomModal>
        </View>
    )
}