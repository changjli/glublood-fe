import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/Colors'
import CustomFoodLogStatisticPage from '@/app/(statistic)/food-logs/custom'

interface TabControlDataProps {
    title: string,
    page: () => React.JSX.Element,
}

interface TabControlProps {
    tabControls: TabControlDataProps[]
}

export default function TabControl({ tabControls }: TabControlProps) {
    const [selectedTab, setSelectedTab] = useState<TabControlDataProps>(tabControls[0])

    return (
        <>
            <View style={{ padding: 16, backgroundColor: 'white' }}>
                <View style={styles.container}>
                    {tabControls.map((tabControl, idx) => (
                        <TouchableOpacity
                            style={[
                                styles.itemContainer,
                                selectedTab.title == tabControl.title && styles.selectedItemContainer,
                                idx == 0 && { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
                                idx == tabControls.length - 1 && { borderTopRightRadius: 20, borderBottomRightRadius: 20, borderRightWidth: 0 }
                            ]}
                            onPress={() => setSelectedTab(tabControl)}
                            id={String(idx)}
                        >
                            <Text style={[styles.itemText, selectedTab.title == tabControl.title && styles.selectedItemText]}>{tabControl.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            {selectedTab.page && <selectedTab.page />}
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