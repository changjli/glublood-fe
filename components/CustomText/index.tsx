import { Text, TextProps } from 'react-native'
import React from 'react'
import { FontFamily, FontSize } from '@/constants/Typography'

export type CustomTextProps = TextProps & {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    weight?: 'light' | 'medium' | 'heavy'
}

export default function CustomText({
    size,
    weight,
    children,
    ...rest
}: CustomTextProps) {

    let fontSize
    switch (size) {
        case 'sm':
            fontSize = FontSize.sm
            break
        case 'md':
            fontSize = FontSize.md
            break
        case 'lg':
            fontSize = FontSize.lg
            break
        case 'xl':
            fontSize = FontSize.xl
            break
        default:
            fontSize = FontSize.md
            break
    }

    let fontFamily
    switch (weight) {
        case 'light':
            fontFamily = FontFamily.light
            break
        case 'medium':
            fontFamily = FontFamily.medium
            break
        case 'heavy':
            fontFamily = FontFamily.heavy
            break
        default:
            fontFamily = FontFamily.medium
            break
    }

    return (
        <Text
            style={{
                fontSize,
                fontFamily,
            }}
            {...rest}
        >
            {children}
        </Text>
    )
}
