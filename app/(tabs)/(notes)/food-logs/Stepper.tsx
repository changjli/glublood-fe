import { View, Text, TextInput } from 'react-native'
import React, { useRef, useState } from 'react'
import CustomButton from '@/components/CustomButton'

type StepperProps = {
  value: number
  onChange: (value: number) => void
}

export default function Stepper({ value, onChange }: StepperProps) {

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleDecrement = () => {
    intervalRef.current = setInterval(() => {
      onChange(value - 1)
    }, 1000)
  }

  const handlePressOut = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

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
        onLongPress={handleDecrement}
        onPressOut={handlePressOut}
      />
      <TextInput style={{
        width: 72,
        height: 36,
        borderRadius: 4,
        borderWidth: 1,
        textAlign: 'center',
        color: 'black',
      }}
        value={String(value)}
        keyboardType='number-pad'
        onChangeText={(v) => onChange(Number(v))}
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