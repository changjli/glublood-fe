import { ActivityIndicator, Pressable, PressableProps, StyleProp, StyleSheet, Text, TextInput, TextInputProps, TextProps, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import React, { useContext, useState } from 'react'
import { tv } from 'tailwind-variants'
import { cssInterop } from 'nativewind'
import { Ionicons } from '@expo/vector-icons'
import { FontFamily, FontSize } from '@/constants/Typography'
import { useTheme } from '@/app/context/ThemeProvider'
import { Colors } from '@/constants/Colors'

export type CustomTextInputProps = TextInputProps & {
    label?: string,
    error?: string,
    labelStyle?: TextProps['style']
    prefix?: React.ReactNode
    postfix?: React.ReactNode
    containerStyle?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
}

export default function CustomTextInput({
    label,
    error,
    labelStyle,
    prefix,
    postfix,
    containerStyle,
    style,
    onChangeText,
    ...rest
}: CustomTextInputProps) {
    const isError = error != null && error != ''

    const { colors } = useTheme()

    const [isFocus, setIsFocus] = useState(false)

    return (
        <View>
            {label &&
                <Text
                    style={[
                        styles.labelText,
                        labelStyle,
                    ]}
                >
                    {label}
                </Text>
            }
            <View
                style={[
                    styles.inputContainer,
                    isFocus && styles.focusInputContainer,
                    rest.readOnly && styles.disabledInputContainer,
                    isError && styles.errorInputContainer,
                    containerStyle,
                ]}
            >
                {
                    prefix &&
                    <View>
                        {prefix}
                    </View>
                }
                <TextInput
                    placeholderTextColor='gray'
                    onFocus={() => setIsFocus(!isFocus)}
                    onBlur={() => setIsFocus(!isFocus)}
                    onChangeText={onChangeText}
                    style={[styles.innerContainer, style]}
                    {...rest}
                />
                {
                    postfix &&
                    <View>
                        {postfix}
                    </View>
                }
            </View>
            {
                isError &&
                <View style={styles.errorContainer}>
                    <Ionicons name='warning' size={16} color='red' />
                    <Text style={styles.errorText}>
                        {error}
                    </Text>
                </View>
            }
        </View >
    )
}

export const StyledCustomTextInput = cssInterop(CustomTextInput, {
    style: true,
    labelStyle: true,
})

const styles = StyleSheet.create({
    labelText: {
        fontFamily: FontFamily.heavy,
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'nowrap',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 2,
        borderRadius: 8,
        borderColor: Colors.light.gray300,
        gap: 4,
    },
    focusInputContainer: {
        borderColor: Colors.light.primary,
    },
    disabledInputContainer: {
        backgroundColor: Colors.light.darkOrange50,
        borderColor: Colors.light.darkOrange50,
    },
    errorInputContainer: {
        borderColor: Colors.light.danger,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    errorText: {
        fontFamily: FontFamily.medium,
        color: Colors.light.danger,
    },
    innerContainer: {
        flex: 1,
        fontFamily: FontFamily.medium,
        fontSize: FontSize.md,
    },
})

// const styles = {
//     inputContainerStyles: tv({
//         base: 'py-[12px] px-[16px] border-2 border-gray-300 rounded-[8px] font-helvetica text-[16px] focus:border-primary',
//         variants: {
//             disabled: {
//                 true: 'bg-secondary border-secondary'
//             },
//             error: {
//                 true: 'border-red-500'
//             }
//         }
//     }),
// }


