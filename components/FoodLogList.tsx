import { Colors } from '@/constants/Colors';
import { FontSize, FontFamily } from '@/constants/Typography';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import CustomText from './CustomText';

type FoodLogListProps = {
    data: GetFoodLogResponse[]
    loading: boolean
}

export default function FoodLogList({ data, loading }: FoodLogListProps) {
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

                <TouchableOpacity style={styles.cardContainer} onPress={() => router.navigate(`/logs/food/${item.id}`)}>
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
        <View style={styles.container}>
            {loading ? (
                <View>
                    <ActivityIndicator color={Colors.light.primary} size={30} />
                </View>
            ) : data.length < 1 ? (
                <View style={styles.notFoundContainer}>
                    <Image source={require('@/assets/images/characters/not-found.png')} />
                    <CustomText style={{ textAlign: 'center', color: Colors.light.gray400 }}>Belum ada nutrisi yang kamu tambahkan</CustomText>
                </View>
            ) : (
                data.map((item, index) => (
                    renderItem({ item, index })
                ))
            )}
        </View>
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
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 20,
        backgroundColor: Colors.light.darkOrange50,
        elevation: 1,
    },
    cardHeaderText: {
        fontSize: FontSize.md,
        color: Colors.light.primary,
        fontFamily: FontFamily.heavy,
    },
    cardBodyText: {
        fontSize: FontSize.sm,
        color: Colors.light.primary,
    },
    notFoundContainer: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        gap: 8,
    }
});

