import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import WheelPickerExpo from 'react-native-wheel-picker-expo'
import { FontAwesome } from '@expo/vector-icons'
import { FontFamily, FontSize } from '@/constants/Typography'
import { Colors } from '@/constants/Colors'
import CustomText from '@/components/CustomText'
import CustomWheelPicker from './CustomWheelPicker'

type CustomQuantityPickerProps = {
    widthQty?: number
    widthSize?: number
    qty?: number
    size: string
    qtyData: number[]
    sizeData: string[]
    onChangeQty?: (qty: string) => void
    onChangeSize: (size: string) => void
    label?: string
    showQty?: boolean
    isDecimal?: boolean
}

const DECIMAL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

export default function CustomQuantityPicker({
    widthQty,
    widthSize,
    qty = 1.0,
    size,
    qtyData,
    sizeData,
    onChangeQty = () => { },
    onChangeSize,
    label,
    showQty = true,
    isDecimal = false,
}: CustomQuantityPickerProps) {
    const [qtyInteger, setQtyInteger] = useState(String(qty).split('.')[0])
    const [qtyDecimal, setQtyDecimal] = useState(String(qty).split('.')[1] ?? '0')

    const qtyIntegerInitial = qtyData.findIndex(data => String(data) == qtyInteger) > 0 ? qtyData.findIndex(data => String(data) == qtyInteger) : 0
    const qtyDecimalInitial = DECIMAL.findIndex(data => String(data) == qtyDecimal) > 0 ? DECIMAL.findIndex(data => String(data) == qtyDecimal) : 0
    const sizeInitial = sizeData.findIndex(data => data == size) > 0 ? sizeData.findIndex(data => data == size) : 0

    useEffect(() => {
        setQtyInteger(String(qty).split('.')[0])
        setQtyDecimal(String(qty).split('.')[1] ?? '0')
    }, [qty])

    return (
        <View>
            {label &&
                <CustomText size='md' weight='heavy'>
                    {label}
                </CustomText>
            }
            <View style={styles.container}>
                {/* {showQty && (
                    <>
                        <FontAwesome name='play' style={styles.arrow} />
                        <WheelPickerExpo
                            initialSelectedIndex={qtyIntegerInitial}
                            onChange={({ index }) => {
                                setQtyInteger(String(qtyData[index]))
                                onChangeQty(isDecimal ? qtyInteger + '.' + qtyDecimal : qtyInteger)
                            }}
                            items={qtyData.map(data => ({ label: String(data), value: data }))}
                            renderItem={({ label }) => (
                                <View style={[
                                    styles.pickerContainer,
                                    label == qtyInteger && styles.pickerSelected,
                                ]}>
                                    <Text style={[
                                        styles.pickerText,
                                        label == qtyInteger && styles.pickerTextSelected
                                    ]}>
                                        {label}
                                    </Text>
                                </View>
                            )}
                            flatListProps={{
                                nestedScrollEnabled: true,
                            }}
                            width={30}
                        />
                        {isDecimal && (
                            <>
                                <View style={{ width: 5, height: 5, backgroundColor: Colors.light.primary, marginTop: 24 }} />
                                <WheelPickerExpo
                                    initialSelectedIndex={qtyDecimalInitial}
                                    onChange={({ index }) => {
                                        setQtyDecimal(String(DECIMAL[index]))
                                        onChangeQty(isDecimal ? qtyInteger + '.' + qtyDecimal : qtyInteger)
                                    }}
                                    items={DECIMAL.map(d => ({ label: String(d), value: d }))}
                                    renderItem={({ label }) => (
                                        <View style={[
                                            styles.pickerContainer,
                                            label == qtyDecimal && styles.pickerSelected,
                                        ]}>
                                            <Text style={[
                                                styles.pickerText,
                                                label == qtyDecimal && styles.pickerTextSelected
                                            ]}>
                                                {label}
                                            </Text>
                                        </View>
                                    )}
                                    flatListProps={{
                                        nestedScrollEnabled: true,
                                    }}
                                    width={30}
                                />
                            </>
                        )}
                    </>
                )}

                <FontAwesome name='play' style={styles.arrow} />
                <WheelPickerExpo
                    initialSelectedIndex={sizeInitial}
                    onChange={({ index }) => onChangeSize(sizeData[index])}
                    items={sizeData.map(data => ({ label: data, value: data }))}
                    renderItem={({ label }) => (
                        <View style={[
                            styles.pickerContainer,
                            label == String(size) && styles.pickerSelected,
                        ]}>
                            <Text style={[
                                styles.pickerText,
                                label == String(size) && styles.pickerTextSelected
                            ]}>
                                {label}
                            </Text>
                        </View>
                    )}
                    flatListProps={{
                        nestedScrollEnabled: true,
                    }}
                    width={175}
                /> */}

                <CustomWheelPicker
                    data={DECIMAL}
                    width={50}
                    itemHeight={30}
                    initialSelectedIndex={2}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        overflow: 'hidden',
        elevation: 1,
        borderRadius: 12,
        gap: 8,
    },
    arrow: {
        color: Colors.light.primary,
    },
    pickerContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerText: {
        fontSize: FontSize.md,
        fontFamily: FontFamily.heavy,
        color: Colors.light.primary,
    },
    pickerSelected: {
        backgroundColor: 'rgba(244, 198, 135, 0.30)',
        borderRadius: 4,
    },
    pickerTextSelected: {
        fontSize: FontSize.lg,
        fontFamily: FontFamily.heavy,
        color: Colors.light.primary,
    },
})