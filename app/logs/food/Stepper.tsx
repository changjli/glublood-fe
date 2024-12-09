import { View, Text, TextInput } from 'react-native'
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import CustomButton from '@/components/CustomButton'

type StepperProps = {
  value: number
  onChange: (value: number) => void
}

export default function Stepper({ value, onChange }: StepperProps) {

  const valueRef = useRef<number>(value)
  const increaseIntervalRef = useRef<any>(null)
  const decreaseIntervalRef = useRef<any>(null)
  const timerIntervalRef = useRef<any>(null)
  const incrementRef = useRef(1)

  const handlePressIncrease = () => {
    let duration = 1
    timerIntervalRef.current = setInterval(() => {
      duration += 1

      if (duration >= 3) {
        incrementRef.current = 10
      }
    }, 1000)

    increaseIntervalRef.current = setInterval(() => {
      const newValue = valueRef.current + incrementRef.current
      onChange(newValue)
      valueRef.current = newValue
    }, 100)
  }

  const handlePressDecrease = () => {
    let duration = 1
    timerIntervalRef.current = setInterval(() => {
      duration += 1

      if (duration >= 3) {
        incrementRef.current = 10
      }
    }, 1000)

    decreaseIntervalRef.current = setInterval(() => {
      const newValue = valueRef.current > 0 ? valueRef.current - incrementRef.current : 0
      onChange(newValue)
      valueRef.current = newValue
    }, 100)
  }

  const handlePressOut = (interval: MutableRefObject<any>) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
      incrementRef.current = 1
    }
    if (interval.current) {
      clearInterval(interval.current)
      interval.current = null
    }
  }

  useEffect(() => {
    valueRef.current = value
  }, [value])

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
          paddingVertical: 0,
          paddingHorizontal: 0,
        }}
        onPress={() => onChange(value != 0 ? value - 1 : 0)}
        onLongPress={handlePressDecrease}
        onPressOut={() => handlePressOut(decreaseIntervalRef)}
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
          paddingVertical: 0,
          paddingHorizontal: 0,
        }}
        onPress={() => onChange(value + 1)}
        onLongPress={handlePressIncrease}
        onPressOut={() => handlePressOut(increaseIntervalRef)}
      />
    </View>
  )
}