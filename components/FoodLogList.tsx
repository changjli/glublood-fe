import { Colors } from '@/constants/Colors';
import { FontSize, FontFamily } from '@/constants/Typography';
import { router } from 'expo-router';
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

                <TouchableOpacity style={styles.cardContainer} onPress={() => router.navigate(`/food-logs/${item.id}`)}>
                    <View>
                        <Text style={styles.cardHeaderText}>{item.food_name}</Text>
                    </View>
                    <Text style={styles.cardBodyText}>{item.calories} Kkal</Text>
                    <Text style={styles.cardBodyText}>{item.serving_qty} {item.serving_size}</Text>
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
        paddingVertical: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    timeSection: {
        width: '20%',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 14,
        marginBottom: 5,
        fontFamily: FontFamily.heavy,
    },
    verticalLine: {
        flex: 1,
        width: 1,
        borderStyle: 'dashed',
        borderColor: Colors.light.primary,
        borderWidth: 1.5,
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

