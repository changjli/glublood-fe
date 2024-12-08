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
    qtyData?: number[]
    sizeData: string[]
    onChangeQty?: (qty: string) => void
    onChangeSize: (size: string) => void
    label?: string
    showQty?: boolean
    isDecimal?: boolean
    others?: boolean
}

const DECIMAL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

export default function CustomQuantityPicker({
    widthQty = 40,
    widthSize = 100,
    qty = 1.0,
    size,
    qtyData = [],
    sizeData,
    onChangeQty = () => { },
    onChangeSize,
    label,
    showQty = true,
    isDecimal = false,
    others = false,
}: CustomQuantityPickerProps) {
    const [qtyInteger, setQtyInteger] = useState<string>(String(qty).split('.')[0])
    const [qtyDecimal, setQtyDecimal] = useState<string>(String(qty).split('.')[1] ?? '0')

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
                {showQty && (
                    <>
                        <FontAwesome name='play' style={[styles.arrow, { marginRight: 8 }]} />
                        <CustomWheelPicker
                            data={qtyData}
                            width={widthQty}
                            itemHeight={40}
                            initialSelectedIndex={qtyIntegerInitial}
                            onValueChange={({ index, item }) => {
                                setQtyInteger(String(item))
                                onChangeQty(isDecimal ? String(item) + '.' + qtyDecimal : String(item))
                            }}
                        />
                        {isDecimal && (
                            <>
                                <View style={{ width: 5, height: 5, backgroundColor: Colors.light.primary, marginTop: 24, marginHorizontal: 3 }} />
                                <CustomWheelPicker
                                    data={DECIMAL}
                                    width={widthQty}
                                    itemHeight={40}
                                    initialSelectedIndex={qtyDecimalInitial}
                                    onValueChange={({ index, item }) => {
                                        setQtyDecimal(String(item))
                                        onChangeQty(isDecimal ? qtyInteger + '.' + String(item) : qtyInteger)
                                    }}
                                />
                            </>
                        )}
                    </>
                )}

                <FontAwesome name='play' style={[styles.arrow, { marginLeft: 40, marginRight: 8 }]} />
                <CustomWheelPicker
                    data={sizeData}
                    width={widthSize}
                    itemHeight={40}
                    initialSelectedIndex={sizeInitial}
                    onValueChange={({ index, item }) => {
                        onChangeSize(item)
                    }}
                    others={others}
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