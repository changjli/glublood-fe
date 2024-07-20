import { ActivityIndicator, Pressable, PressableProps, Text, TextProps, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { tv } from 'tailwind-variants'
import { CustomTextProps, StyledCustomText } from '../CustomText'
import { cssInterop } from 'nativewind'

export type CustomButtonProps = PressableProps & {
  title: string
  size?: 'sm' | 'md',
  type?: 'primary' | 'outline',
  textStyle?: TextProps['style']
  loading?: string,
}

export default function CustomButton({
  title,
  size,
  type,
  textStyle,
  loading,
  ...rest
}: CustomButtonProps) {
  return (
    <Pressable
      className={buttonStyles({
        size,
        type,
        disabled: rest.disabled!,
      })}
      {...rest}
    >
      {loading == null || loading == '' ?
        <Text
          style={textStyle}
          className={textStyles({
            size,
            type,
            disabled: rest.disabled!,
          })}
        >
          {title}
        </Text>
        :
        <ActivityIndicator color='white' />
      }
    </Pressable>
  )
}

export const StyledCustomButton = cssInterop(CustomButton, {
  style: true,
  textStyle: true,
})

const buttonStyles = tv({
  base: 'flex flex-row justify-center items-center rounded-[8px]',
  variants: {
    size: {
      sm: 'px-[20px] py-[12px]',
      md: 'px-[30px] py-[16px]',
    },
    type: {
      primary: 'bg-primary border-2 border-primary',
      outline: 'bg-white border-2 border-primary'
    },
    disabled: {
      true: 'bg-secondary border-secondary',
    }
  },
  defaultVariants: {
    size: 'sm',
    type: 'primary'
  }
})

const textStyles = tv({
  base: 'font-helvetica-bold',
  variants: {
    size: {
      sm: 'text-[12px]',
      md: 'text-[16x]',
    },
    type: {
      primary: 'text-white',
      outline: 'text-primary'
    },
    disabled: {
      true: 'text-gray-300',
    }
  },
  defaultVariants: {
    size: 'sm',
    type: 'primary',
  }
})

