import { View, Text, Modal, StyleSheet, Pressable, FlatList, Alert, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSession } from '../context/AuthenticationProvider'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import Wrapper from '@/components/Layout/Wrapper'
import CustomText from '@/components/CustomText'
import { Colors } from '@/constants/Colors'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { formatDatetoString } from '@/utils/formatDatetoString'
import { FlexStyles } from '@/constants/Flex'
import useFoodMenu from '@/hooks/api/food_menu/useFoodMenu'
import axios from 'axios'

export default function index() {
    const { signOut, session } = useSession()
    const { getAllFoodMenu } = useFoodMenu()

    const [foodMenus, setFoodMenus] = useState<FoodMenu[]>([])
    const [getAllFoodMenuLoading, setGetAllFoodMenuLoading] = useState(false)

    const handleGetAllFoodMenu = async () => {
        try {
            const res = await getAllFoodMenu(setGetAllFoodMenuLoading, '', 3)
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
        handleGetAllFoodMenu()
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                <View style={styles.headerContainer} />
                <Wrapper>
                    <View style={{ marginBottom: 12 }}>
                        <CustomText size='xl' weight='heavy' style={{ color: 'white' }}>Glublood</CustomText>
                        <CustomText style={{ color: 'white', maxWidth: '70%' }}>Hai, Jonathan jaga kesehatan dan perbanyak aktivitas tubuh</CustomText>
                    </View>
                    <View style={styles.summaryContainer}>
                        <AnimatedCircularProgress
                            size={170}
                            width={20}
                            fill={50}
                            tintColor={Colors.light.red}
                            onAnimationComplete={() => console.log('onAnimationComplete')}
                            backgroundColor={Colors.light.gray300}
                            rotation={0}
                            lineCap='round'
                            children={() => (
                                <AnimatedCircularProgress
                                    size={130}
                                    width={20}
                                    fill={50}
                                    tintColor={Colors.light.primary}
                                    onAnimationComplete={() => console.log('onAnimationComplete')}
                                    backgroundColor={Colors.light.gray300}
                                    rotation={0}
                                    lineCap='round'
                                />
                            )}
                        />

                        <View style={styles.summaryInnerContainer}>
                            <View style={styles.todayContainer}>
                                <CustomText>{formatDatetoString(new Date())}</CustomText>
                            </View>
                            <View>
                                <View style={[FlexStyles.flexRow, { gap: 8 }]}>
                                    <View style={{ width: 12, height: 12, backgroundColor: Colors.light.primary }} />
                                    <CustomText size='sm' style={{ color: Colors.light.primary }}>Asupan kalori</CustomText>
                                </View>
                                <View style={[FlexStyles.flexRow, { gap: 8 }]}>
                                    <View style={{ width: 12, height: 12, backgroundColor: Colors.light.red }} />
                                    <CustomText size='sm' style={{ color: Colors.light.red }}>Pembakaran kalori</CustomText>
                                </View>
                            </View>
                        </View>
                    </View>
                    <CustomText size='lg' weight='heavy'>Remainder</CustomText>
                    <TouchableOpacity style={styles.reportContainer} onPress={() => router.push('/report')}>
                        <Image source={require('@/assets/images/characters/character-report.png')} style={{ width: 50, height: 50 }} />
                        <CustomText size='sm' style={{ color: Colors.light.gray400, textAlign: 'center' }}>Kamu belum tambah pengigat</CustomText>
                    </TouchableOpacity>

                    <View>
                        <View style={[FlexStyles.flexRow, { justifyContent: 'space-between' }]}>
                            <CustomText size='lg' weight='heavy'>Menu Sehat</CustomText>
                            <TouchableOpacity onPress={() => router.push('/food-menus')}>
                                <CustomText size='sm' weight='heavy' style={{ color: Colors.light.primary }}>Lihat Selengkapnya</CustomText>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={foodMenus}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity style={styles.foodItemContainer} id={String(index)} onPress={() => router.push(`/food-menus/${item.id}`)}>
                                    <CustomText size='sm' weight='heavy' style={{ textAlign: 'center' }}>{item.title}</CustomText>
                                    <CustomText size='sm'>{item.calories} Kal</CustomText>
                                    <Image
                                        source={require('@/assets/images/user-profile/dummy.png')}
                                        style={styles.foodItemImage}
                                    />
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal
                            contentContainerStyle={{ gap: 12 }}
                        />
                    </View>
                    <CustomText size='lg' weight='heavy'>Rekam Data Kesehatan</CustomText>
                    <TouchableOpacity style={styles.reportContainer} onPress={() => router.push('/report')}>
                        <Image source={require('@/assets/images/characters/character-report.png')} style={{ width: 50, height: 50 }} />
                        <CustomText size='sm' style={{ color: Colors.light.gray400, textAlign: 'center' }}>Laporan kesehatanmu mengenai diabetes dan aktivitas yang dilakukan</CustomText>
                    </TouchableOpacity>
                </Wrapper>
                <View style={{ height: 20 }} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: Colors.light.primary,
        width: '100%',
        height: 150,
        position: 'absolute',
    },
    summaryContainer: {
        backgroundColor: 'white',
        elevation: 5,
        padding: 16,
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16
    },
    summaryInnerContainer: {
        gap: 32
    },
    todayContainer: {
        borderWidth: 1,
        borderColor: Colors.light.gray300,
        borderRadius: 8,
        padding: 8,
    },
    foodItemContainer: {
        backgroundColor: 'white',
        marginBottom: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
        gap: 10,
        borderRadius: 10,
        elevation: 5,
    },
    foodItemImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    reportContainer: {
        ...FlexStyles.flexCol,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.light.primary,
        padding: 8,
    },
})

