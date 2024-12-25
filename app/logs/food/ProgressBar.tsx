import { View, Text, StyleSheet, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Colors } from '@/constants/Colors'
import { formatDecimalToFixed } from '@/utils/formatNumber'
import CustomText from '@/components/CustomText'

type ProgressBarProps = {
    data: GetDailyCaloriesResponse
}

export default function ProgressBar({ data }: ProgressBarProps) {
    const [progress, setProgress] = useState(data.consumed_calories / data.target_calories)

    useEffect(() => {
        setProgress(data.consumed_calories / data.target_calories)
    }, [data])


    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        animation.setValue(0)
        Animated.timing(animation, {
            toValue: progress,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [animation, progress])

    const widthInterpolated = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View>
            <CustomText>
                <CustomText style={[{ color: Number(data.consumed_calories) > Number(data.target_calories) ? Colors.light.red500 : 'black' }]}>{formatDecimalToFixed(data.consumed_calories)}</CustomText> Kkal / {data.target_calories} Kkal
            </CustomText>
            <View style={styles.progressContainer}>
                <Animated.View
                    style={[styles.innerProgressContainer, {
                        width: widthInterpolated,
                        borderRadius: progress == 1 ? 100 : 0,
                        backgroundColor: Number(data.consumed_calories) > Number(data.target_calories) ? Colors.light.red500 : Colors.light.primary,
                    }]}
                >
                </Animated.View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    progressContainer: {
        height: 40,
        backgroundColor: Colors.light.gray300,
        borderRadius: 100,
        overflow: 'hidden',
    },
    innerProgressContainer: {
        width: '50%',
        height: 40,
        borderTopLeftRadius: 100,
        borderBottomLeftRadius: 100,
    }
})