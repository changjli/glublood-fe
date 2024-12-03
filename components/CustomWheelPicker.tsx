import { View, Text, FlatList, NativeSyntheticEvent, NativeScrollEvent, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import CustomText from './CustomText';
import { FontFamily, FontSize } from '@/constants/Typography';
import { Colors } from '@/constants/Colors';
import CustomModal from './CustomModal';
import CustomTextInput from './CustomInput/CustomTextInput';
import CustomButton from './CustomButton';
import { FlexStyles } from '@/constants/Flex';

export interface CustomWheelPickerProp<T> {
    data: T[];
    width: number;
    itemHeight: number;
    initialSelectedIndex?: number;
    onValueChange?: (paylaad: { index: number, item: T }) => void;
    others?: boolean;
}

export default function CustomWheelPicker<T>({
    data,
    width,
    itemHeight,
    initialSelectedIndex = 0,
    onValueChange = () => { },
    others = false,
}: CustomWheelPickerProp<T>) {
    const flatListRef = useRef<FlatList<T>>(null)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const listContainerHeight = itemHeight * 3 // visible items

    // modal
    const [modalVisible, setModalVisible] = useState(false)
    const [modalData, setModalData] = useState<string>('')
    const [additionalData, setAdditionalData] = useState<string>('Lainya')

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / itemHeight);
        if (index !== selectedIndex) {
            onValueChange({ index: index, item: data[index] })
        }
    };

    const onViewableItemsChanged = (({ viewableItems, changed }: { viewableItems: any[], changed: any[] }) => {
        if (viewableItems.length > 0) {
            const { index, item } = viewableItems[0];
            if (index !== selectedIndex) {
                if (item == additionalData) {
                    setSelectedIndex(data.length)
                    handleOpenModal()
                }
                setSelectedIndex(index)
                onValueChange({ index: index, item: item });
            }
        }
    });

    const viewabilityConfig = {
        waitForInteraction: true,
        itemVisiblePercentThreshold: 95,
    };

    const handleScrollTo = (index: number) => {
        if (flatListRef.current && index < data.length) {
            flatListRef.current.scrollToIndex({ index, animated: true });
        }
    }

    const handleOpenModal = () => {
        setModalVisible(true)
        if (additionalData != 'Lainya') {
            setModalData(additionalData)
        }
    }

    const handleSubmitModal = () => {
        setAdditionalData(modalData)
        onValueChange({ index: data.length, item: modalData as T });
        setModalVisible(false)
    }

    const handleCloseModal = () => {
        setModalVisible(false)
    }

    // BUG
    // useEffect(() => {
    //     setSelectedIndex(initialSelectedIndex)
    //     setTimeout(() => handleScrollTo(selectedIndex), 500)
    // }, [initialSelectedIndex])

    return (
        <>
            <View style={{ height: listContainerHeight }}>
                <View style={[styles.focusContainer, { width: width, height: itemHeight, top: (listContainerHeight - itemHeight) / 2 }]} />
                <FlatList
                    ref={flatListRef}
                    data={others ? [...data, additionalData as T] : data}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => String(index)}
                    // onScroll={handleScroll}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    // snapToInterval={itemHeight}
                    // onMomentumScrollEnd={handleScroll}
                    snapToOffsets={data.map((x, i) => (i * itemHeight))} // supaya ga stuck diantara 2 item 
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
                    nestedScrollEnabled={true}
                />
            </View>
            <CustomModal
                isVisible={modalVisible}
                toggleModal={handleCloseModal}
            >
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View>
                        <CustomText size='lg' weight='heavy'>Atur Opsi Dosis</CustomText>
                        <CustomTextInput label='Dosis' value={String(modalData)} onChangeText={setModalData} />
                    </View>
                    <CustomButton title='Tambahkan opsi' size='md' onPress={handleSubmitModal} />
                </View>
            </CustomModal>
        </>
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
        fontSize: 16,
        fontFamily: FontFamily.heavy,
        color: Colors.light.secondary,
    },
    itemTextSelected: {
        fontSize: 20,
        color: Colors.light.primary,
    }
})