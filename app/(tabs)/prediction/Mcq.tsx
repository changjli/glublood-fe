import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import CustomButton from '@/components/CustomButton'
import { Size, Weight } from '@/constants/Typography'
import { Colors } from '@/constants/Colors'

type McqProps = {
    question: string,
    answers: {
        label: string,
        value: number,
    }[],
    value: number,
    onChange: (e: number) => void,
}

export default function Mcq({ question, answers, value, onChange }: McqProps) {
    return (
        <View>
            <Text style={styles.question}>
                {question}
            </Text>

            {
                answers!.map((answer, index) => (
                    <CustomButton
                        title={answer.label}
                        key={index}
                        size='lg'
                        type='outline'
                        style={[
                            styles.answer,
                            answer.value == value && styles.answerActive
                        ]}
                        textStyle={[
                            answer.value == value && { color: 'white' }
                        ]}
                        onPress={() => {
                            onChange(answer.value)
                        }}
                    />
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({
    question: {
        fontSize: Size.xl,
        fontFamily: Weight.heavy,
        marginBottom: 36,
    },
    answer: {
        marginBottom: 12,
    },
    answerActive: {
        backgroundColor: Colors.light.primary,
    },
})