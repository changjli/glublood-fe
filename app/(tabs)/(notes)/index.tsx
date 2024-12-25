import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, router } from 'expo-router';
import Wrapper from '@/components/Layout/Wrapper';
import { Colors } from '@/constants/Colors';
import SegmentedControl from '@/components/SegmentedControl';
import FoodLogPage from './food';
import ExerciseLogPage from './exercise';
import GlucoseLogPage from './glucose';
import MedicineLogPage from './medicine';
import TabControl from '@/components/TabControl';
import CustomText from '@/components/CustomText';
import { FontSize } from '@/constants/Typography';
import CustomButton from '@/components/CustomButton';
import { FlexStyles } from '@/constants/Flex';
import { useUserProfile } from '@/hooks/useUserProfile';

const tabs = [
    { title: 'Gula Darah', page: GlucoseLogPage, image: require('@/assets/images/characters/tracking-nutrisi.png') },
    { title: 'Nutrisi', page: FoodLogPage, image: require('@/assets/images/characters/tracking-nutrisi.png') },
    { title: 'Olahraga', page: ExerciseLogPage, image: require('@/assets/images/characters/tracking-nutrisi.png') },
    { title: 'Obat', page: MedicineLogPage, image: require('@/assets/images/characters/tracking-nutrisi.png') },
]

export default function LogPage() {

    const { profile } = useUserProfile()

    const [tabList, setTabList] = useState(tabs)
    const [selectedTab, setSelectedTab] = useState<any>({})

    useEffect(() => {
        if (!profile?.is_diabetes) {
            const filteredTabs = tabs.filter(tab => tab.title != 'Gula Darah')
            setTabList(filteredTabs)
            if (Object.keys(selectedTab).length == 0) {
                setSelectedTab(filteredTabs[0])
            }
        } else {
            setTabList(tabs)
            if (Object.keys(selectedTab).length == 0) {
                setSelectedTab(tabs[0])
            }
        }
    }, [profile])

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                <ImageBackground source={require('@/assets/images/backgrounds/bg-tracking.png')} style={{ width: '100%' }}>
                    <View style={styles.headerContainer}>
                        <View style={styles.headerInnerContainer}>
                            <View>
                                <CustomText size='2xl' weight='heavy' space={false} style={{ color: 'white' }}>Tracking</CustomText>
                                <CustomText size='2xl' weight='heavy' space={false} style={{ color: 'white', marginBottom: 16 }}>{selectedTab.title}</CustomText>
                            </View>
                            {/* <Image source={selectedTab.image} style={{ height: 50 }} resizeMode='contain' /> */}
                        </View>
                        <View style={styles.tabContainer}>
                            {tabList.map((tab, idx) => (
                                <CustomButton
                                    title={tab.title}
                                    style={styles.tabItemContainer}
                                    type={selectedTab.title == tab.title ? 'primary' : 'outline'}
                                    size='sm'
                                    onPress={() => setSelectedTab(tab)}
                                />
                            ))}
                        </View>
                    </View>
                </ImageBackground>
                {selectedTab.page && <selectedTab.page />}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        padding: 16,
    },
    headerInnerContainer: {
        ...FlexStyles.flexRow,
        justifyContent: 'space-between',
    },
    tabContainer: {
        ...FlexStyles.flexRow,
        gap: 8,
    },
    tabItemContainer: {
        flex: 1,
    }
})