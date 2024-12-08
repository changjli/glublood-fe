import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import React from 'react'
import CustomButton from '@/components/CustomButton'
import { FontSize, FontFamily } from '@/constants/Typography'
import { Colors } from '@/constants/Colors'
import CustomText from '@/components/CustomText'

type DiabetesPedigreeProps = {
    question: string,
    value: number | string,
    description?: string,
    onChange: (e: number) => void,
}

export default function DiabetesPedigree({ question, value, description = '', onChange }: DiabetesPedigreeProps) {
    return (
        <View>
            <Text style={[styles.question, description == '' && { marginBottom: 16 }]}>
                {question}
            </Text>

            {description != '' && (
                <View style={{ marginBottom: 16 }}>
                    <View>
                        <CustomText size='sm'>{description}</CustomText>
                    </View>
                </View>
            )}

            <View className='flex-row justify-between gap-4'>
                <Pressable
                    style={[
                        styles.answerContainer,
                        value == 1 && styles.answerContainerActive,
                    ]}
                    onPress={() => {
                        onChange(1)
                    }}
                >
                    <Text
                        style={[
                            styles.answerText,
                            value == 1 && styles.answerTextActive,
                        ]}
                    >Ya</Text>
                    <Image
                        source={require('@/assets/images/characters/character-success.png')}
                        style={{
                            width: 100,
                            height: 100,
                            resizeMode: 'contain',
                        }}
                    />
                </Pressable>

                <Pressable
                    style={[
                        styles.answerContainer,
                        value == 0 && styles.answerContainerActive,
                    ]}
                    onPress={() => {
                        onChange(0)
                    }}
                >
                    <Text
                        style={[
                            styles.answerText,
                            value == 0 && styles.answerTextActive,
                        ]}
                    >Tidak</Text>
                    <Image
                        source={require('@/assets/images/characters/character-false.png')}
                        style={{
                            width: 100,
                            height: 100,
                            resizeMode: 'contain',
                        }}
                    />
                </Pressable>
            </View>

            {/* <CustomButton
                title='Ya'
                size='lg'
                type='outline'
                style={[
                    styles.answer,
                    value == 1 && styles.answerActive
                ]}
                textStyle={[
                    value == 1 && { color: 'white' }
                ]}
                onPress={() => {
                    onChange(1)
                }}
            />
            <CustomButton
                title='Tidak'
                size='lg'
                type='outline'
                style={[
                    styles.answer,
                    value == 0 && styles.answerActive
                ]}
                textStyle={[
                    value == 0 && { color: 'white' }
                ]}
                onPress={() => {
                    onChange(0)
                }}
            /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    question: {
        fontSize: FontSize.xl,
        fontFamily: FontFamily.heavy,
    },
    answerContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 11,
        borderWidth: 2,
        borderColor: Colors.light.primary,
        borderRadius: 12,
        paddingVertical: 20,
    },
    answerText: {
        fontSize: FontSize.md,
        fontFamily: FontFamily.heavy,
    },
    answerTextActive: {
        color: 'white',
    },
    answerContainerActive: {
        backgroundColor: Colors.light.primary
    },
    answer: {
        marginBottom: 12,
    },
    answerActive: {
        backgroundColor: Colors.light.primary,
    },
})