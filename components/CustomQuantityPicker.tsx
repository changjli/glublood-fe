import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import WheelPickerExpo from 'react-native-wheel-picker-expo'
import { FontAwesome } from '@expo/vector-icons'
import { FontFamily, FontSize } from '@/constants/Typography'
import { Colors } from '@/constants/Colors'
import CustomText from '@/components/CustomText'

type CustomQuantityPickerProps = {
    widthQty?: number
    widthSize?: number
    qty?: number
    size: string
    qtyData?: number[]
    typeData?: string[]
    onChangeQty?: (qty: string) => void
    onChangeSize: (size: string) => void
    label?: string
    showQtyPicker?: boolean
} & (
        | { showFirstPicker: true; qty: number; onChangeQty: (qty: string) => void }
        | { showFirstPicker?: false }
    )

export default function CustomQuantityPicker({
    widthQty,
    widthSize,
    qty,
    size,
    qtyData = [1, 2, 3],
    typeData = ['asu', 'lala'],
    onChangeQty = () => { },
    onChangeSize,
    label,
    showQtyPicker = true
}: CustomQuantityPickerProps) {
    return (
        <View>
            {label &&
                <CustomText size='md' weight='heavy'>
                    {label}
                </CustomText>
            }
            {showQtyPicker ?
                <View style={styles.container}>
                    {/* left */}
                    <FontAwesome name='play' style={styles.arrow} />
                    <WheelPickerExpo
                        initialSelectedIndex={0}
                        onChange={({ index }) => onChangeQty(String(qtyData[index]))}
                        items={qtyData.map(data => ({ label: String(data), value: data }))}
                        renderItem={({ label }) => (
                            <View style={[
                                styles.pickerContainer,
                                label == String(qty) && styles.pickerSelected,
                            ]}>
                                <Text style={[
                                    styles.pickerText,
                                    label == String(qty) && styles.pickerTextSelected
                                ]}>
                                    {label}
                                </Text>
                            </View>
                        )}
                        flatListProps={{
                            nestedScrollEnabled: true,
                        }}
                        width={75}
                    />
                    {/* right */}
                    <FontAwesome name='play' style={styles.arrow} />
                    <WheelPickerExpo
                        initialSelectedIndex={0}
                        onChange={({ index }) => onChangeSize(typeData[index])}
                        items={typeData.map(data => ({ label: data, value: data }))}
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
                    />
                </View>
                :
                <View style={styles.container}>
                    {/* right */}
                    <FontAwesome name='play' style={styles.arrow} />
                    <WheelPickerExpo
                        initialSelectedIndex={0}
                        onChange={({ index }) => onChangeSize(typeData[index])}
                        items={typeData.map(data => ({ label: data, value: data }))}
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
                    />
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
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