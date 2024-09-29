import { Colors } from '@/constants/Colors';
import { Size, Weight } from '@/constants/Typography';
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

type FoodLogListProps = {
    data: GetFoodLogResponse[]
}

export default function FoodLogList({ data }: FoodLogListProps) {
    const renderItem = ({ item, index }: {
        item: GetFoodLogResponse
        index: number
    }) => {
        const isSame = item.time == data[index - 1]?.time

        return (
            <View style={styles.itemContainer}>
                <View style={styles.timeSection}>
                    {!isSame && (
                        <Text style={styles.timeText}>{item.time}</Text>
                    )}
                    {(index < data.length - 1 || isSame) && (
                        <View style={styles.verticalLine}>
                            {!isSame && (
                                <View style={styles.dot} />
                            )}
                        </View>
                    )}
                </View>

                <View style={styles.cardContainer}>
                    <View>
                        <Text style={styles.cardHeaderText}>{item.food_name}</Text>
                    </View>
                    <Text style={styles.cardBodyText}>{item.calorie}</Text>
                    <Text style={styles.cardBodyText}>{item.serving}</Text>
                </View>
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
        fontSize: Size.md,
        color: Colors.light.primary,
        fontFamily: Weight.heavy,
    },
    cardBodyText: {
        fontSize: Size.sm,
        color: Colors.light.primary,
    }
});

