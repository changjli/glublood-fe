import { ActivityIndicator, Pressable, PressableProps, Text, TextInput, TextInputProps, TextProps, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { tv } from 'tailwind-variants'
import { cssInterop } from 'nativewind'
import { Ionicons } from '@expo/vector-icons'

export type CustomTextInputProps = TextInputProps & {
    label?: string,
    error?: string,
    labelStyle?: TextProps['style']
}

export default function CustomTextInput({
    label,
    error,
    labelStyle,
    ...rest
}: CustomTextInputProps) {
    const isError = error != null && error != ''

    return (
        <View>
            {label ?
                <Text
                    className='font-helvetica-bold text-[12px]'
                    style={labelStyle}
                >
                    {label}
                </Text>
                : null
            }
            <TextInput
                className={styles.inputContainerStyles({
                    disabled: rest.readOnly,
                    error: isError,
                })}
                placeholderTextColor='gray'
                {...rest}
            />
            {
                isError ?
                    <View className='flex flex-row items-center gap-1'>
                        <Ionicons name='warning' size={16} color='red' />
                        <Text className='font-helvetica text-red-500'>
                            {error}
                        </Text>
                    </View>
                    : null
            }
        </View >
    )
}

export const StyledCustomTextInput = cssInterop(CustomTextInput, {
    style: true,
    labelStyle: true,
})

const styles = {
    inputContainerStyles: tv({
        base: 'py-[12px] px-[16px] border-2 border-gray-300 rounded-[8px] font-helvetica text-[16px] focus:border-primary',
        variants: {
            disabled: {
                true: 'bg-secondary border-secondary'
            },
            error: {
                true: 'border-red-500'
            }
        }
    }),
}


