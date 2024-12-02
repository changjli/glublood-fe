import { View, Text, FlatList, NativeSyntheticEvent, NativeScrollEvent, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import CustomText from './CustomText';
import { FontFamily, FontSize } from '@/constants/Typography';
import { Colors } from '@/constants/Colors';

export interface CustomWheelPickerProp<T> {
    data: T[];
    width: number;
    itemHeight: number;
    initialSelectedIndex?: number;
    onValueChange?: (value: T) => void;
}

export default function CustomWheelPicker<T>({
    data,
    width,
    itemHeight,
    initialSelectedIndex = 0,
    onValueChange = () => { },
}: CustomWheelPickerProp<T>) {
    const flatListRef = useRef<FlatList<T>>(null)
    const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex)
    const listContainerHeight = itemHeight * 3 // visible items

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / itemHeight);
        if (index !== selectedIndex) {
            setSelectedIndex(index);
        }
    };

    const handleScrollTo = (index: number) => {
        if (flatListRef.current && index < data.length) {
            flatListRef.current.scrollToIndex({ index, animated: true });
        }
    }

    useEffect(() => {
        setTimeout(() => handleScrollTo(initialSelectedIndex), 500)
    }, [initialSelectedIndex])

    return (
        <View style={{ height: listContainerHeight }}>
            <View style={[styles.focusContainer, { width: width, height: itemHeight, top: (listContainerHeight - itemHeight) / 2 }]} />
            <FlatList
                ref={flatListRef}
                data={data}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => String(index)}
                onScroll={handleScroll}
                snapToInterval={itemHeight} // supaya ga stuck diantara 2 item 
                decelerationRate={'fast'} // supaya snap lebih mulus 
                getItemLayout={(_, index) => ({
                    length: itemHeight,
                    offset: itemHeight * index,
                    index,
                })} // supaya lebih optimal
                renderItem={({ item, index }) => (
                    <View style={[styles.itemContainer, { width: width, height: itemHeight }]}>
                        <Text style={[
                            styles.itemText,
                            index == selectedIndex && styles.itemTextSelected
                        ]}>{String(item)}</Text>
                    </View>
                )}
                contentContainerStyle={{
                    paddingVertical: itemHeight // supaya ga bentrok sama snap
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    focusContainer: {
        backgroundColor: 'rgba(244, 198, 135, 0.30)',
        position: 'absolute',
        borderRadius: 8,
    },
    itemContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemText: {
        fontSize: 14,
        fontFamily: FontFamily.heavy,
        color: Colors.light.secondary,
    },
    itemTextSelected: {
        fontSize: 16,
        color: Colors.light.primary,
    }
})