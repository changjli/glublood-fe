import { View, Text, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router'

export default function AuthLayout() {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className='flex-1 px-[16px] py-[22px] bg-background'>
                <Slot />
            </View>
        </TouchableWithoutFeedback>

    )
}