import { View, Text } from 'react-native'
import React from 'react'
import CustomButton from '@/components/CustomButton'
import useNotification from '@/hooks/useNotification'
import useReminder from '@/hooks/useReminder'

export default function CreateReminderPage() {
    const { createReminder, clearAllReminder } = useReminder()

    return (
        <View>
            <CustomButton title='add' onPress={() => createReminder({
                reminderTypes: [1, 2, 3],
                time: "22:39",
                repeatDays: [1, 2, 3],
                notes: '',
                isEnabled: true
            })} />

            <CustomButton title='delete' onPress={clearAllReminder} />
        </View>
    )
}