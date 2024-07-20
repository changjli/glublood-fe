import { View, Text, TextProps } from 'react-native'
import React from 'react'
import { tv } from 'tailwind-variants'
import { cssInterop } from 'nativewind'

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
    return (
        <Text
            style={rest.style}
            className={textStyles({
                size,
                weight,
            })}
        >
            {children}
        </Text>
    )
}

export const StyledCustomText = cssInterop(CustomText, {
    style: true
})

const textStyles = tv({
    variants: {
        size: {
            sm: 'text-[12px]',
            md: 'text-[16px]',
            lg: 'text-[20px]',
            xl: 'text-[24px]',
        },
        weight: {
            light: 'font-helvetica-light',
            medium: 'font-helvetica',
            heavy: 'font-helvetica-bold',
        }
    },
    defaultVariants: {
        size: 'md',
        weight: 'medium',
    }
})