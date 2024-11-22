import { View, Text, Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '@/components/CustomButton'
import CustomTextInput from '@/components/CustomInput/CustomTextInput'
import useMasterFood from '@/hooks/api/master_food/useMasterFood'
import axios from 'axios'
import { Link, router } from 'expo-router'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { FontSize } from '@/constants/Typography'
import CustomText from '@/components/CustomText'
import Wrapper from '@/components/Layout/Wrapper'
import { Colors } from '@/constants/Colors'
import { FlexStyles } from '@/constants/Flex'

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
            <Link
                href={{
                    pathname: '/logs/food/create/[id]',
                    params: { id: item.id }
                }}
                style={styles.itemContainer}
            >
                <Text>{item.food_name}</Text>
            </Link>
        );
    };

    return (
        <>
            <View style={styles.topContainer}>
                <CustomText size='xl' weight='heavy' style={{ color: 'white' }}>Tambah log nutrisi</CustomText>
                <CustomTextInput
                    placeholder='Cari menu makan'
                    value={search}
                    onChangeText={setSearch}
                    postfix={search != '' ? (
                        <TouchableOpacity onPress={() => setSearch('')}>
                            <FontAwesome name='close' size={FontSize.md} color={'white'} />
                        </TouchableOpacity>
                    ) : (
                        <Link href={`/logs/food/create/barcode`}>
                            <FontAwesome name='barcode' size={FontSize.md} color={'white'} />
                        </Link>
                    )}
                    containerStyle={{ borderColor: 'white' }}
                    style={{ color: 'white' }}
                    placeholderTextColor={'white'}
                />
            </View>
            <Wrapper>
                {search != '' && (
                    <FlatList
                        data={masterFoods}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />)
                }
                {/* <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <View style={styles.orContainer}>
                        <View style={styles.hr} />
                        <CustomText weight='heavy'>Atau</CustomText>
                        <View style={styles.hr} />
                    </View>

                    <Link href={'/logs/food/create'}>Masukkan manual</Link>
                </View> */}
                <TouchableOpacity style={[FlexStyles.flexRow, { justifyContent: 'center', gap: 8 }, search != '' && { paddingVertical: 8 }]} onPress={() => router.push('/logs/food/create')}>
                    <View style={styles.iconContainer} >
                        <FontAwesome name='plus' size={12} color="white" />
                    </View>
                    <CustomText style={{ color: Colors.light.primary }}>Tambahkan menu makan secara manual</CustomText>
                </TouchableOpacity>
            </Wrapper>
        </>

    )
}

const styles = StyleSheet.create({
    topContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: Colors.light.primary,
    },
    itemContainer: {
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'grey',
    },
    orContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    hr: {
        borderBottomColor: 'black',
        borderWidth: 2,
        borderBottomWidth: 1,
        width: 100,
    },
    iconContainer: {
        ...FlexStyles.flexRow,
        justifyContent: 'center',
        backgroundColor: Colors.light.primary,
        width: 16,
        height: 16,
        borderRadius: 8
    }
})