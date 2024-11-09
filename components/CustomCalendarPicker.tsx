import { View, Text } from 'react-native'
import React, { useState } from 'react'
import CalendarPicker from "react-native-calendar-picker"
import { Colors } from '@/constants/Colors'
import CustomTextInput from './CustomInput/CustomTextInput'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { FontSize } from '@/constants/Typography'
import CustomModal from './CustomModal'
import { formatDatetoString } from '@/utils/formatDatetoString'
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
                value={enableRangeInput ? `${value[0] ?? 'YYYY-MM-dd'} ~ ${value[1] ?? 'YYYY-MM-dd'}` : value}
                onPress={() => setModalVisible(true)}
            />
            <CustomModal
                isVisible={modalVisible}
                toggleModal={() => setModalVisible(false)}
            >
                {enableRangeInput && (<Text>{`${selectedDate[0] ?? 'YYYY-MM-dd'} ~ ${selectedDate[1] ?? 'YYYY-MM-dd'}`}</Text>)}
                <CalendarPicker
                    allowRangeSelection={enableRangeInput}
                    allowBackwardRangeSelect={enableRangeInput}
                    onDateChange={(date, type) => {
                        if (date != null) {
                            if (enableRangeInput) {
                                const temp = [...selectedDate]
                                if (type === 'END_DATE') {
                                    temp[1] = formatDatetoString(date)
                                } else {
                                    temp[0] = formatDatetoString(date)
                                }
                                setSelectedDate(temp)
                            } else {
                                setSelectedDate(formatDatetoString(date))
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