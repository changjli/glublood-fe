import { Colors } from '@/constants/Colors';
import { FontSize, FontFamily } from '@/constants/Typography';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, LayoutAnimation } from 'react-native';

interface GlucoseLogListProps {
    data: GetGlucoseLogRes[];
}

export default function GlucoseLogList({ data }: GlucoseLogListProps) {
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

                <View style={styles.cardContainer}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.doseText}>{item.glucose_rate} mg/dL</Text>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => router.navigate(`/logs/glucose/${item.id}`)}
                        >
                            <Text style={styles.editText}>✎ Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.timeSelection}>{item.time_selection}</Text>
                    <Text style={styles.notes}>{item.notes}</Text>
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
    dashedLine: {
        width: 1,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#E85C32',
        flex: 1,
    },
    cardContainer: {
        padding: 10,
        flex: 1,
        height: 100,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.light.primary,
        borderRadius: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    doseText: {
        color: Colors.light.primary,
        fontSize: FontSize.sm,
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
        fontSize: FontSize.md,
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
});
