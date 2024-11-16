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
            <View style={{ padding: 16, backgroundColor: 'white' }}>
                <View style={styles.container}>
                    {segmentedControls.map((segmentedControl, idx) => (
                        <TouchableOpacity
                            style={[
                                styles.itemContainer,
                                selectedSegment.title == segmentedControl.title && styles.selectedItemContainer,
                                idx == 0 && { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
                                idx == segmentedControls.length - 1 && { borderTopRightRadius: 20, borderBottomRightRadius: 20, borderRightWidth: 0 }
                            ]}
                            onPress={() => setSelectedSegment(segmentedControl)}
                            id={String(idx)}
                        >
                            <Text style={[styles.itemText, selectedSegment.title == segmentedControl.title && styles.selectedItemText]}>{segmentedControl.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            {selectedSegment.page && <selectedSegment.page />}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: Colors.light.primary,
        borderRadius: 20,
    },
    itemContainer: {
        flexGrow: 1,
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: Colors.light.primary,
    },
    itemText: {
        color: 'black',
        padding: 8,
    },
    selectedItemContainer: {
        backgroundColor: Colors.light.primary,
    },
    selectedItemText: {
        color: 'white'
    }
})