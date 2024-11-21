import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/Colors'
import CustomFoodLogStatisticPage from '@/app/(statistic)/food-logs/custom'
import { FontFamily, FontSize } from '@/constants/Typography'

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
                                idx == 0 && { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 },
                                idx == segmentedControls.length - 1 && { borderTopRightRadius: 8, borderBottomRightRadius: 8, borderRightWidth: 0 }
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
        backgroundColor: Colors.light.gray200,
        borderRadius: 8,
    },
    itemContainer: {
        flexGrow: 1,
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: Colors.light.gray300,
        padding: 8,
    },
    itemText: {
        color: 'black',
        fontSize: FontSize.sm,
        lineHeight: FontSize.sm,
    },
    selectedItemContainer: {
        backgroundColor: Colors.light.primary,
    },
    selectedItemText: {
        color: 'white',
        fontFamily: FontFamily.heavy,
    }
})