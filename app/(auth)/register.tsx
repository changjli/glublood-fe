import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { StyledCustomText } from '@/components/CustomText'

export default function Register() {
    return (
        <View>
            <Text>Register</Text>
            <Pressable onPress={() => router.replace('(auth)/login')}>
                <StyledCustomText size='sm' weight='heavy' style='text-primary'>
                    Balik ke login
                </StyledCustomText>
            </Pressable>
        </View>
    )
}