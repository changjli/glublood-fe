import { View, Text, Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '@/components/CustomButton'
import CustomTextInput from '@/components/CustomInput/CustomTextInput'
import useMasterFood from '@/hooks/api/master_food/useMasterFood'
import axios from 'axios'
import { Link } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'
import { FontSize } from '@/constants/Typography'

export default function Search() {

    const { searchMasterFood } = useMasterFood()

    const [search, setSearch] = useState('')
    const [masterFoods, setMasterFoods] = useState<SearchMasterFoodResponse[]>([])

    const [searchLoading, setSearchLoading] = useState(false)

    const handleSearchMasterFood = async (query: string) => {
        try {
            const res = await searchMasterFood(setSearchLoading, query)
            const data: SearchMasterFoodResponse[] = res.data
            setMasterFoods(data)
        } catch (err) {
            setMasterFoods([])
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
        }
    }

    useEffect(() => {
        if (search != '') {
            setTimeout(() => handleSearchMasterFood(search), 300)
        } else {
            setMasterFoods([])
        }
    }, [search])

    const renderItem = ({ item, index }: {
        item: SearchMasterFoodResponse
        index: number
    }) => {
        return (
            <Link href={{
                pathname: '/(notes)/foods/[id]',
                params: { id: item.id }
            }} style={styles.itemContainer}>
                <Text>{item.food_name}</Text>
            </Link>
        );
    };

    return (
        <View>
            <Text>Tambah log nutrisi</Text>
            <CustomTextInput
                placeholder='Cari menu makan'
                value={search}
                onChangeText={setSearch}
                postfix={(
                    <FontAwesome name='search' size={FontSize.md} />
                )}
            />
            {masterFoods.length > 0 ? (
                <FlatList
                    data={masterFoods}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            ) : (
                <Link href={'/(notes)/foods/create'}>Masukkan manual</Link>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'grey',
    }
})