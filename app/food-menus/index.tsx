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

export default function FoodMenuPage() {

    const { getAllFoodMenu } = useFoodMenu()

    const [searchKeyword, setSearchKeyword] = useState('')
    const [foodMenus, setFoodMenus] = useState<FoodMenu[]>([])
    const [getAllFoodMenuLoading, setGetAllFoodMenuLoading] = useState(false)
    const [debounceSearch, setDebounceSearch] = useState('')

    const handleGetAllFoodMenu = async () => {
        try {

            const res = await getAllFoodMenu(setGetAllFoodMenuLoading, searchKeyword)
            setFoodMenus(res.data)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    Alert.alert('Bad Request', 'Invalid request. Please check your input.');
                } else if (status === 500) {
                    Alert.alert('Server Error', 'A server error occurred. Please try again later.');
                } else {
                    // Alert.alert('Error', `An error occurred: ${status}. Please try again later.`);
                }
            } else {
                console.log('Unexpected Error:', err);
                Alert.alert('Network Error', 'Please check your internet connection.');
            }
            return []
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounceSearch(searchKeyword)
        }, 500)

        return () => clearTimeout(timeout)
    }, [searchKeyword])

    useEffect(() => {
        handleGetAllFoodMenu()
    }, [debounceSearch])

    return (
        <Wrapper>
            <CustomTextInput
                placeholder='Cari menu makanan'
                value={searchKeyword}
                postfix={searchKeyword == '' ? (
                    <Ionicons name='search' size={FontSize.md} />
                ) : (
                    <TouchableOpacity onPress={() => setSearchKeyword('')}>
                        <Ionicons name='close' size={FontSize.md} />
                    </TouchableOpacity>
                )}
                onChangeText={setSearchKeyword}
            />

            <ScrollView>
                <CustomText>Terdapat <CustomText weight='heavy'>100</CustomText> hasil menu makanan</CustomText>
                <View style={styles.foodMenuListContainer}>
                    {foodMenus.map((foodMenu, idx) => (
                        <View style={styles.foodItemContainer} id={String(idx)}>
                            <CustomText size='sm' weight='heavy' style={{ textAlign: 'center' }}>{foodMenu.title}</CustomText>
                            <CustomText size='sm'>{foodMenu.calories} Kal</CustomText>
                            <Image
                                source={require('@/assets/images/user-profile/dummy.png')}
                                style={styles.foodItemImage}
                            />
                            <CustomButton title='Lihat menu' size='sm' type='outline' style={{ paddingHorizontal: 10 }} onPress={() => router.push(`/food-menus/${foodMenu.id}`)} />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </Wrapper>
    )
}

const styles = StyleSheet.create({
    foodMenuListContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    foodItemContainer: {
        backgroundColor: Colors.light.ternary,
        width: '48%',
        marginBottom: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
        gap: 10,
        borderRadius: 10
    },
    foodItemImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    }
})