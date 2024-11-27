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
        <>
            <CustomHeader title='Menu Sehat' />
            <Wrapper style={{ backgroundColor: 'white' }}>
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
                    <CustomText style={{ marginBottom: 8 }}>Terdapat <CustomText weight='heavy'>{foodMenus.length}</CustomText> hasil menu makanan</CustomText>
                    <View style={styles.foodMenuListContainer}>
                        {foodMenus.map((foodMenu, idx) => (
                            <View style={styles.foodItemContainer} id={String(idx)}>
                                <CustomText size='md' weight='heavy' style={{ textAlign: 'center', flex: 1 }}>{foodMenu.title}</CustomText>
                                <CustomText size='sm'>{foodMenu.calories} Kal</CustomText>
                                <Image
                                    source={require('@/assets/images/user-profile/dummy.png')}
                                    style={styles.foodItemImage}
                                />
                            </View>
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