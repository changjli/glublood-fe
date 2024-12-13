import { View, Text, Alert, ImageBackground, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import axios from 'axios'
import useFoodMenu from '@/hooks/api/food_menu/useFoodMenu'
import Wrapper from '@/components/Layout/Wrapper'
import CustomText from '@/components/CustomText'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { FontFamily, FontSize } from '@/constants/Typography'
import { Colors } from '@/constants/Colors'
import Collapsible from 'react-native-collapsible';
import { useCustomAlert } from '../context/CustomAlertProvider'

export default function FoodMenuDetailPage() {
    const { id } = useLocalSearchParams()
    const { getFoodMenuDetail } = useFoodMenu()
    const { showAlert } = useCustomAlert()

    const [foodMenu, setFoodMenu] = useState<FoodMenu>()
    const [getFoodMenuDetailLoading, setGetFoodMenuDetailLoading] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState({
        ingredients: true,
        steps: true,
    })

    const handleGetFoodMenuDetail = async () => {
        try {

            const res = await getFoodMenuDetail(setGetFoodMenuDetailLoading, Number(id))
            setFoodMenu(res.data)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    showAlert('Invalid request. Please check your input.', 'error');
                } else if (status === 500) {
                    showAlert('A server error occurred. Please try again later.', 'error');
                } else {
                    showAlert(`An error occurred: ${status}. Please try again later.`, 'error');
                }
            } else {
                console.log('Unexpected Error:', err);
                showAlert('Please check your internet connection.', 'error');
            }
            return []
        }
    }

    useEffect(() => {
        handleGetFoodMenuDetail()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground
                source={{
                    uri: 'https://placehold.jp/300x400.png'
                }}
                style={{ flex: 1 }}
            >
                <Wrapper style={{ justifyContent: 'flex-end', paddingBottom: 50 }}>
                    <View style={styles.foodMenuOuterContainer}>
                        <ScrollView style={styles.foodMenuContainer}>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <CustomText size='lg' weight='heavy' style={{ color: 'white' }}>{foodMenu?.title}</CustomText>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Ionicons name='time' size={FontSize.lg} color={'white'} />
                                    <CustomText style={{ color: 'white' }}>{foodMenu?.duration}</CustomText>
                                </View>
                            </View>
                            <View style={styles.nutrientAutoOuterContainer}>
                                <View style={[styles.nutrientAutoContainer, { width: '100%' }]}>
                                    <Image source={require('@/assets/images/foods/calorie_icon.png')} style={styles.nutrientAutoIcon} />
                                    <Text style={styles.nutrientAutoTitle}>Kalori</Text>
                                    <Text style={styles.nutrientAutoText}>{foodMenu?.calories} Kkal/Porsi</Text>
                                </View>
                                <View style={[styles.nutrientAutoContainer, { width: '30%' }]}>
                                    <Image source={require('@/assets/images/foods/protein_icon.png')} style={styles.nutrientAutoIcon} />
                                    <CustomText size='sm' weight='heavy'>Protein</CustomText>
                                    <CustomText size='sm'>{foodMenu?.protein} g</CustomText>
                                </View>
                                <View style={[styles.nutrientAutoContainer, { width: '30%' }]}>
                                    <Image source={require('@/assets/images/foods/carbohydrate_icon.png')} style={styles.nutrientAutoIcon} />
                                    <CustomText size='sm' weight='heavy'>Karbohidrat</CustomText>
                                    <CustomText size='sm'>{foodMenu?.carbohydrate} g</CustomText>
                                </View>
                                <View style={[styles.nutrientAutoContainer, { width: '30%' }]}>
                                    <Image source={require('@/assets/images/foods/fat_icon.png')} style={styles.nutrientAutoIcon} />
                                    <CustomText size='sm' weight='heavy'>Lemak</CustomText>
                                    <CustomText size='sm'>{foodMenu?.fat} g</CustomText>
                                </View>
                            </View>
                            <View style={styles.informationContainer}>
                                <TouchableOpacity style={styles.informationHeaderContainer} onPress={() => setIsCollapsed({ ...isCollapsed, ingredients: !isCollapsed.ingredients })}>
                                    <CustomText size='md' weight='heavy' style={{ color: 'white' }}>Bahan-bahan masak</CustomText>
                                    <Ionicons name='chevron-down-outline' size={FontSize.lg} color={'white'} />
                                </TouchableOpacity>
                                <Collapsible collapsed={isCollapsed.ingredients}>
                                    <View>
                                        {foodMenu?.ingredients.split("|").map(ingredient => (
                                            <View style={styles.informationItemContainer}>
                                                <View style={styles.dot} />
                                                <CustomText style={{ color: 'white' }}>{ingredient}</CustomText>
                                            </View>
                                        ))}
                                    </View>
                                </Collapsible>
                            </View>
                            <View style={styles.informationContainer}>
                                <TouchableOpacity style={styles.informationHeaderContainer} onPress={() => setIsCollapsed({ ...isCollapsed, steps: !isCollapsed.steps })}>
                                    <CustomText size='md' weight='heavy' style={{ color: 'white' }}>Cara membuat</CustomText>
                                    <Ionicons name='chevron-down-outline' size={FontSize.lg} color={'white'} />
                                </TouchableOpacity>
                                <Collapsible collapsed={isCollapsed.steps}>
                                    <View>
                                        {foodMenu?.steps.split("|").map(step => (
                                            <View style={styles.informationItemContainer}>
                                                <View style={styles.dot} />
                                                <CustomText style={{ color: 'white' }}>{step}</CustomText>
                                            </View>
                                        ))}
                                    </View>
                                </Collapsible>
                            </View>
                        </ScrollView>
                    </View>
                </Wrapper>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    foodMenuOuterContainer: {
        height: '70%',
    },
    foodMenuContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.24)',
        padding: 8,
        borderRadius: 12,
    },
    nutrientAutoOuterContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    nutrientAutoContainer: {
        padding: 8,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        borderRadius: 12,
        backgroundColor: 'white',
        elevation: 3,
    },
    nutrientAutoIcon: {
        width: 32,
        height: 32,
    },
    nutrientAutoTitle: {
        fontSize: FontSize.md,
        fontFamily: FontFamily.heavy,
    },
    nutrientAutoText: {
        fontSize: FontSize.md,
        fontFamily: FontFamily.medium,
    },
    informationHeaderContainer: {
        backgroundColor: Colors.light.primary,
        padding: 8,
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    informationContainer: {
        backgroundColor: 'rgba(244, 198, 135, 0.2)',
        borderRadius: 12,
        marginBottom: 12,
    },
    informationItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 8
    },
    dot: {
        width: 4,
        height: 4,
        backgroundColor: 'white',
        borderRadius: 2,
        marginTop: 12,
    }
})