import { View, Text, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomText, { StyledCustomText } from '@/components/CustomText'
import useAsyncStorage from '@/hooks/useAsyncStorage'
import { router } from 'expo-router'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field'
import { Colors } from '@/constants/Colors'

export default function VerifyCode() {

    const { getObjectData } = useAsyncStorage()

    const [credentials, setCredentials] = useState<{
        email: string,
        password: string,
    }>({
        email: '',
        password: '',
    })

    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: 6 });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const handleGetCredentials = async () => {
        try {
            const value = await getObjectData('credentials')
            setCredentials(value)
        } catch (err) {
            console.log('AsyncStorage Error:', err)
        }
    }

    useEffect(() => {
        handleGetCredentials()
    }, [])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className='flex-1 p-[16px]'>
                <StyledCustomText style='text-[32px] text-primary' weight='heavy' >Verifikasi kode</StyledCustomText>
                <StyledCustomText size='md' >Masukkan 6 kode yang telah dikirim</StyledCustomText>
                <CodeField
                    ref={ref}
                    {...props}
                    value={value}
                    onChangeText={setValue}
                    cellCount={6}
                    rootStyle={styles.codeFieldRoot}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    renderCell={({ index, symbol, isFocused }) => (
                        <Text
                            key={index}
                            style={[styles.cell, isFocused && styles.focusCell]}
                            onLayout={getCellOnLayoutHandler(index)}>
                            {symbol || (isFocused ? <Cursor /> : null)}
                        </Text>
                    )}
                />
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    root: { padding: 20, minHeight: 300 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFieldRoot: { marginTop: 20 },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 2,
        borderColor: Colors.light.primary,
        textAlign: 'center',
        borderRadius: 8,
    },
    focusCell: {
        backgroundColor: Colors.light.primary,
        color: 'white',
    },
});