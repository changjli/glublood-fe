import { Colors } from '@/constants/Colors';
import { FontSize, FontFamily } from '@/constants/Typography';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, LayoutAnimation, ActivityIndicator, Image } from 'react-native';
import CustomText from './CustomText';
import { FontAwesome } from '@expo/vector-icons';
import { isGlucoseDanger } from '@/utils/isGlucoseDanger';

interface GlucoseLogListProps {
    data: GetGlucoseLogRes[];
    loading: boolean
    age: number
}

export default function GlucoseLogList({ data, loading, age }: GlucoseLogListProps) {


    const renderItem = ({ item, index }: { item: GetGlucoseLogRes, index: number }) => {
        const isSame = item.time === data[index - 1]?.time;

        return (
            <View style={styles.itemContainer}>
                {/* Time Section */}
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

                <TouchableOpacity style={styles.cardContainer} onPress={() => router.navigate(`/logs/glucose/${item.id}`)}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.glucoseRateText}>{item.glucose_rate} mg/dL</Text>
                        {isGlucoseDanger(age, item.time_selection, item.glucose_rate) && (
                            <FontAwesome name='warning' style={{ color: Colors.light.red500 }} />
                        )}
                    </View>
                    <Text style={styles.timeSelection}>{item.time_selection ?? 'Lainya'}</Text>
                    <Text style={styles.notes}>{item.notes}</Text>
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
}

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
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    glucoseRateText: {
        color: Colors.light.primary,
        fontSize: FontSize.md,
        fontWeight: 'bold',
    },
    editButton: {
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderColor: Colors.light.primary,
        borderWidth: 1,
        borderRadius: 8,
    },
    editText: {
        color: Colors.light.primary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    timeSelection: {
        marginBottom: 5,
        color: Colors.light.primary,
        fontSize: FontSize.sm,
        fontWeight: 'bold',
    },
    notes: {
        marginBottom: 7,
        color: '#666',
        fontSize: FontSize.sm,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    missedButton: {
        marginRight: 10,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#F08080',
        flex: 1,
        alignItems: 'center',
    },
    missedText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    takenButton: {
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
    },
    takenText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    fullWidthButton: {
        width: '100%',
        marginHorizontal: 0,
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
