import { View, Text, StyleSheet, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Colors } from '@/constants/Colors'

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
            <Text>{data.consumed_calories} Kkal / {data.target_calories} Kkal</Text>
            <View style={styles.progressContainer}>
                <Animated.View style={[styles.innerProgressContainer, { width: widthInterpolated, borderRadius: progress == 1 ? 100 : 0 }]}></Animated.View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    progressContainer: {
        height: 40,
        backgroundColor: 'grey',
        borderRadius: 100,
        overflow: 'hidden',
    },
    innerProgressContainer: {
        width: '50%',
        height: 40,
        backgroundColor: Colors.light.primary,
        borderTopLeftRadius: 100,
        borderBottomLeftRadius: 100,
    }
})