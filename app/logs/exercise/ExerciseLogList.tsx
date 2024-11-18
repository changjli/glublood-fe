import CustomText from '@/components/CustomText';
import { Colors } from '@/constants/Colors';
import { FontSize, FontFamily } from '@/constants/Typography';
import { getDuration } from '@/utils/formatDatetoString';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

interface ExerciseLogListProps {
    data: GetExerciseLogRes[]
}

export default function ExerciseLogList({ data }: ExerciseLogListProps) {
    const renderItem = ({ item, index }: {
        item: GetExerciseLogRes
        index: number
    }) => {
        const isSame = item.start_time == data[index - 1]?.start_time

        return (
            <View style={styles.itemContainer}>
                <View style={styles.timeSection}>
                    {!isSame && (
                        <Text style={styles.timeText}>{item.start_time}</Text>
                    )}
                    {(index < data.length - 1 || isSame) && (
                        <View style={styles.verticalLine}>
                            {!isSame && (
                                <View style={styles.dot} />
                            )}
                        </View>
                    )}
                </View>

                <TouchableOpacity style={styles.cardContainer} onPress={() => router.navigate(`/(notes)/exercise-logs/${item.id}`)}>
                    <View>
                        <Text style={styles.cardHeaderText}>{item.exercise_name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <FontAwesome name='clock-o' style={{ color: Colors.light.primary, fontSize: FontSize.md }} />
                        <Text style={[styles.cardBodyText, { fontFamily: FontFamily.heavy }]}>{getDuration(item.start_time, item.end_time)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <Text style={{ fontSize: FontSize.sm }}>Estimasi kalori terbakar</Text>
                        <Text style={[styles.cardBodyText, { fontFamily: FontFamily.heavy }]}>{item.burned_calories} Kkal</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#FFF4E6', // Light background color
    },
    itemContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    timeSection: {
        width: 80, // Fixed width for time section
        alignItems: 'center',
    },
    timeText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    verticalLine: {
        flex: 1,
        width: 1,
        borderStyle: 'dashed',
        borderColor: '#E85C32',
        borderWidth: 1,
    },
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#E85C32',
        position: 'absolute',
        top: -5,
        left: -5,
    },
    cardContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.light.primary,
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 20,
    },
    cardHeaderText: {
        fontSize: FontSize.md,
        color: Colors.light.primary,
        fontFamily: FontFamily.heavy,
    },
    cardBodyText: {
        fontSize: FontSize.sm,
        color: Colors.light.primary,
    }
});

