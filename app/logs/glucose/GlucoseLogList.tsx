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
        const isSameTime = item.time === data[index - 1]?.time;

        return (
            <View style={styles.itemContainer}>
                {/* Time Section */}
                <View style={styles.timeSection}>
                    {!isSameTime && (
                        <Text style={styles.timeText}>{item.time}</Text>
                    )}
                    {(index < data.length - 1 || isSameTime) && (
                        <View style={styles.verticalLineContainer}>
                            {!isSameTime && <View style={styles.dot} />}
                            <View style={styles.dashedLine} />
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
        padding: 20,
    },
    itemContainer: {
        marginBottom: 20,
        height: 100,
        flexDirection: 'row',
    },
    timeSection: {
        marginRight: 20,
        width: 50,
        alignItems: 'center',
    },
    timeText: {
        marginBottom: 5,
        color: '#333',
        fontSize: 14,
    },
    verticalLineContainer: {
        alignItems: 'center',
    },
    dot: {
        marginBottom: 5,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#E85C32',
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
