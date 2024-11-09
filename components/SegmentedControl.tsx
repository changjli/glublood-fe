import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/Colors'
import CustomFoodLogStatisticPage from '@/app/(statistic)/food-logs/custom'

interface SegmentedControlDataProps {
    title: string,
    page: () => React.JSX.Element,
}

interface SegmentedControlProps {
    segmentedControls: SegmentedControlDataProps[]
}

export default function SegmentedControl({ segmentedControls }: SegmentedControlProps) {
    const [selectedSegment, setSelectedSegment] = useState<SegmentedControlDataProps>(segmentedControls[0])

    return (
        <>
            <View style={styles.container}>
                {segmentedControls.map((segmentedControl, idx) => (
                    <TouchableOpacity
                        style={[styles.itemContainer, selectedSegment.title == segmentedControl.title && styles.selectedItemContainer]}
                        onPress={() => setSelectedSegment(segmentedControl)}
                        id={String(idx)}
                    >
                        <Text style={[styles.itemText, selectedSegment.title == segmentedControl.title && styles.selectedItemText]}>{segmentedControl.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            {selectedSegment.page && <selectedSegment.page />}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: Colors.light.primary,
    },
    itemContainer: {
        flexGrow: 1,
        alignItems: 'center'
    },
    itemText: {
        color: Colors.light.gray300,
        padding: 8,
    },
    selectedItemContainer: {
        borderRadius: 10,
    },
    selectedItemText: {
        color: 'white'
    }
})