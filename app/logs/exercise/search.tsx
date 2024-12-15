import { View, Text, Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '@/components/CustomButton'
import CustomTextInput from '@/components/CustomInput/CustomTextInput'
import useMasterFood from '@/hooks/api/master_food/useMasterFood'
import axios from 'axios'
import { Link } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'
import { FontSize } from '@/constants/Typography'
import CustomText from '@/components/CustomText'
import Wrapper from '@/components/Layout/Wrapper'
import { Colors } from '@/constants/Colors'
import useMasterExercise from '@/hooks/api/master/exercises/useMasterExercise'
import { useCustomAlert } from '@/app/context/CustomAlertProvider'

export default function SearchExerciseLogPage() {

    const { getMasterExercises } = useMasterExercise()
    const { showAlert } = useCustomAlert()

    const [search, setSearch] = useState('')
    const [masterExercises, setMasterExercises] = useState<GetMasterExerciseRes[]>([])

    const [searchLoading, setSearchLoading] = useState(false)

    const handleGetMasterExercises = async (query: string) => {
        try {
            const res = await getMasterExercises(setSearchLoading, query)
            const data: GetMasterExerciseRes[] = res.data
            setMasterExercises(data)
        } catch (err) {
            setMasterExercises([])
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
        }
    }

    useEffect(() => {
        if (search != '') {
            setTimeout(() => handleGetMasterExercises(search), 300)
        } else {
            setMasterExercises([])
        }
    }, [search])

    const renderItem = ({ item, index }: {
        item: GetMasterExerciseRes
        index: number
    }) => {
        return (
            <Link href={{
                pathname: '/(notes)/food-logs/create/[id]',
                params: { id: item.id }
            }} style={styles.itemContainer}>
                <Text>{item.exercise_name}</Text>
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
                    postfix={search == '' ? (
                        <FontAwesome name='search' size={FontSize.md} color={'white'} />
                    ) : (
                        <FontAwesome name='close' size={FontSize.md} color={'white'} />
                    )}
                    containerStyle={{ borderColor: 'white' }}
                    style={{ color: 'white' }}
                    placeholderTextColor={'white'}
                />
            </View>
            <Wrapper>
                {search != '' ? (
                    <FlatList
                        data={masterExercises}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                ) : (
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <CustomText weight='heavy'>Atau</CustomText>
                        <Link href={'/(notes)/food-logs/create'}>Masukkan manual</Link>
                    </View>
                )}
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
    }
})