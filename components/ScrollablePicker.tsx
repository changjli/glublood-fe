import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
} from 'react-native';

interface ScrollablePickerProps {
    selectedValue: number | string;
    setFieldValue: (field: string, value: any) => void;
    numberdata?: number[];
    stringData?: string[];
    fieldName: string;
    type: 'number' | 'string';
    itemHeight?: number;
    pickerHeight?: number;
    pickerWidth?: number;
}

const ScrollablePicker: React.FC<ScrollablePickerProps> = ({
    selectedValue,
    setFieldValue,
    numberdata = [],
    stringData = [],
    fieldName,
    type,
    itemHeight = 40,
    pickerHeight = 60,
    pickerWidth = 80,
}) => {
    const flatListRef = useRef<FlatList>(null);
    const data = type === 'number' ? numberdata : stringData;

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / itemHeight);
        const selectedItem = data[index];
        setFieldValue(fieldName, selectedItem);
    };

    useEffect(() => {
        if (flatListRef.current && type === 'number') {
            flatListRef.current.scrollToOffset({
                offset: (Number(selectedValue) - 1) * itemHeight,
                animated: true,
            });
        }
    }, [selectedValue]);

    return (
        <View style={[styles.scrollPicker, { height: pickerHeight, width: pickerWidth }]}>
            <FlatList
                ref={flatListRef}
                data={data}
                keyExtractor={(item) => item.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.dosisItem, { height: itemHeight, width: pickerWidth }]}>
                        <Text style={item === selectedValue ? styles.selectedText : styles.text}>
                            {item}
                        </Text>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                snapToInterval={itemHeight}
                onScroll={handleScroll}
                decelerationRate="fast"
                contentContainerStyle={{
                    paddingTop: pickerHeight / 2 - itemHeight / 2,
                    paddingBottom: pickerHeight / 2 - itemHeight / 2,
                }}
            />
        </View>
    );
};

// Styles for the component
const styles = StyleSheet.create({
    scrollPicker: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    dosisItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: '#DA6E35',
    },
    selectedText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#DA6E35',
    },
});

export default ScrollablePicker;
