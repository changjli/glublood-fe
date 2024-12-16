import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomTextInput from '@/components/CustomInput/CustomTextInput'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { FontSize } from '@/constants/Typography'
import Wrapper from '@/components/Layout/Wrapper'
import CustomText from '@/components/CustomText'
import useFoodMenu from '@/hooks/api/food_menu/useFoodMenu'
import axios from 'axios'
import { Colors } from '@/constants/Colors'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'
import CustomHeader from '@/components/CustomHeader'
import { useCustomAlert } from '../context/CustomAlertProvider'
import { slugify } from '@/utils/slugify'

export default function SavedMenuPage() {

    const { getSavedMenu } = useFoodMenu()

    const [foodMenus, setFoodMenus] = useState<FoodMenu[]>([])
    const [getAllFoodMenuLoading, setGetAllFoodMenuLoading] = useState(false)
    const [debounceSearch, setDebounceSearch] = useState('')
    const { showAlert } = useCustomAlert()

    const handleGetAllFoodMenu = async () => {
        try {
            const res = await getSavedMenu(setGetAllFoodMenuLoading)
            setFoodMenus(res.data)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    showAlert('Invalid request. Please check your input.', 'error');
                } else if (status === 500) {
                    showAlert('A server error occurred. Please try again later.', 'error');
                } else {
                    // showAlert(`An error occurred: ${status}. Please try again later.`, 'error');
                }
            } else {
                console.log('Unexpected Error:', err);
                showAlert('Please check your internet connection.', 'error');
            }
            return []
        }
    }

    useEffect(() => {
        handleGetAllFoodMenu()
    }, [debounceSearch, router])

    return (
        <>
            <CustomHeader title='Menu Sehat' />
            <Wrapper style={{ backgroundColor: 'white' }}>
                <ScrollView>
                    <CustomText style={{ marginBottom: 8 }}>Terdapat <CustomText weight='heavy'>{foodMenus.length}</CustomText> hasil menu makanan</CustomText>
                    <View style={styles.foodMenuListContainer}>
                        {foodMenus.map((foodMenu, idx) => (
                            <TouchableOpacity style={styles.foodItemContainer} id={String(idx)} onPress={() => router.push(`/food-menus/${foodMenu.id}`)}>
                                <CustomText size='md' weight='heavy' style={{ textAlign: 'center', flex: 1 }}>{foodMenu.title}</CustomText>
                                <CustomText size='sm'>{foodMenu.calories} Kal</CustomText>
                                <Image
                                    source={{
                                        uri: `${process.env.EXPO_PUBLIC_API_URL}${foodMenu.image}`
                                    }}
                                    style={styles.foodItemImage}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </Wrapper>
        </>
    )
}

const styles = StyleSheet.create({
    foodMenuListContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 1,
    },
    foodItemContainer: {
        backgroundColor: 'white',
        width: '48%',
        marginBottom: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
        gap: 10,
        borderRadius: 10,
        elevation: 3,
    },
    foodItemImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    }
})