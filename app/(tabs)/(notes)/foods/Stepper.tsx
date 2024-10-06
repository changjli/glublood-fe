import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import CustomButton from '@/components/CustomButton'

type StepperProps = {
  value: number
  onChange: (value: number) => void
}

export default function Stepper({ value, onChange }: StepperProps) {

  return (
    <View style={{
      flexDirection: 'row',
      gap: 6,
    }}>
      <CustomButton
        title='-'
        style={{
          width: 36,
          height: 36,
        }}
        onPress={() => onChange(value - 1)}
      />
      <TextInput style={{
        width: 36,
        height: 36,
        borderRadius: 4,
        borderWidth: 1,
        textAlign: 'center',
        color: 'black',
      }}
        readOnly
        value={String(value)}

      />
      <CustomButton
        title='+'
        style={{
          width: 36,
          height: 36,
        }}
        onPress={() => onChange(value + 1)}
      />
    </View>
  )
}