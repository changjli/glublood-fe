import { View, Text, Alert, TouchableWithoutFeedback, Keyboard, TouchableOpacity, StyleSheet, Image, Modal, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import useProfile from '@/hooks/api/profile/useProfile';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DynamicTextComponent from '@/components/DynamicText';
import { useSession } from "../context/AuthenticationProvider";
import CustomImagePicker from '@/components/CustomImagePicker';
import { FontFamily } from '@/constants/Typography';
import Avatar from '@/components/Avatar';
import { UserProfile, useUserProfile } from '@/hooks/useUserProfile';
import { formatDateToAge } from '@/utils/formatDatetoString';
import useAsyncStorage from '@/hooks/useAsyncStorage';

export default function EditProfilePage() {
    const { signOut, session } = useSession();
    const { saveProfileImage, deleteProfileImage } = useProfile()
    const { profile, setProfile } = useUserProfile()
    const { deleteAllData } = useAsyncStorage()

    const [saveProfileImageLoading, setSaveProfileImageLoading] = useState(false)
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const handleSaveProfileImage = async (image: string) => {
        try {
            const formData = new FormData()
            const fileResponse = await fetch(image);
            const fileBlob = await fileResponse.blob();

            formData.append('profile_image', {
                uri: image,
                name: 'filename.jpeg',
                type: fileBlob.type || 'image/jpeg',
            } as any);
            const res = await saveProfileImage(setSaveProfileImageLoading, formData);
            if (res.status === 200) {
            } else if (res.status === 400) {
                console.log(res.message);
                Alert.alert('Error', res.message);
            }
        } catch (err) {
            console.log('Axios Error:', err);
            Alert.alert('Error', 'Please try again later');
        }
    }

    const handleDeleteProfileImage = async () => {
        try {
            const res = await deleteProfileImage(setSaveProfileImageLoading);
            if (res.status === 200) {
            } else if (res.status === 400) {
                console.log(res.message);
                Alert.alert('Error', res.message);
            }
        } catch (err) {
            console.log('Axios Error:', err);
            Alert.alert('Error', 'Please try again later');
        }
    }

    useEffect(() => {
        if (profile?.profile_image) {
            setProfileImage(profile?.profile_image)
        }
    }, [profile])

    return (
        profile ?
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    style={{
                        backgroundColor: 'white',
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            paddingBottom: 100,
                            display: 'flex',
                        }}
                    >
                        <DynamicTextComponent
                            text='Profil'
                            img={require('@/assets/images/backgrounds/bg-profile.png')}
                            back={true}
                        />

                        {/* Profile Image */}
                        <View
                            style={{
                                position: 'relative',
                                marginTop: -55,
                                marginBottom: 15,
                                marginLeft: 14,
                                width: 130,
                            }}
                        >
                            <CustomImagePicker
                                image={profileImage ?? ''}
                                onChange={(image) => {
                                    if (image == '') {
                                        setProfileImage(null)
                                        handleDeleteProfileImage()
                                    } else {
                                        setProfileImage(image)
                                        setProfile({
                                            ...profile,
                                            profile_image: undefined
                                        })
                                        handleSaveProfileImage(image)
                                    }
                                }}
                            >
                                {(profileImage) ? (
                                    <Image
                                        source={{ uri: profile.profile_image ? process.env.EXPO_PUBLIC_API_URL + profileImage : profileImage }}
                                        style={{
                                            width: 110,
                                            height: 110,
                                            borderRadius: 110 / 2,
                                        }}
                                    />
                                ) : (
                                    <Avatar name={profile?.firstname ? `${profile?.firstname} ${profile?.lastname ?? ''}` : ''} size={110} />
                                )}
                            </CustomImagePicker>
                        </View>

                        {/* general info container */}
                        <View
                            style={{
                                marginHorizontal: 'auto',
                                padding: 15,
                                width: '90%',
                                borderWidth: 1,
                                borderRadius: 6,
                                borderColor: '#DA6E35',
                            }}
                        >
                            <View className='flex flex-row justify-space-between'>
                                <View
                                    style={{
                                        width: '60%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignContent: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            marginRight: 5,
                                            fontSize: 20,
                                            fontFamily: 'Helvetica-Bold',
                                        }}
                                    >
                                        {profile['firstname']} {profile['lastname']}
                                    </Text>
                                    <Ionicons name={profile['gender'] === "male" ? 'male-outline' : 'female-outline'} size={20} className='mt-2' />
                                </View>
                                <TouchableOpacity
                                    style={{
                                        marginLeft: 'auto',
                                        paddingHorizontal: 15,
                                        paddingVertical: 6,
                                        borderWidth: 1,
                                        borderColor: '#DA6E35',
                                        borderRadius: 7,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onPress={() => router.navigate('/profile/edit-profile')}
                                >
                                    <Ionicons name="pencil" color='#DA6E35' size={16} className='text-center' />
                                    <Text
                                        style={{
                                            marginLeft: 5,
                                            color: '#DA6E35',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica-Bold',
                                        }}
                                    >
                                        Edit
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View className='mt-2'>
                                <Text
                                    style={{
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        width: '55%',
                                        backgroundColor: '#FFF8E1',
                                        borderRadius: 6,
                                        color: '#DA6E35',
                                        fontSize: 16,
                                        fontFamily: 'Helvetica-Bold',
                                        textAlign: 'center',
                                    }}
                                >
                                    {
                                        profile['is_diabetes'] ?
                                            profile['diabetes_type'] == 1 ?
                                                'Diabetes Tipe 1'
                                                :
                                                'Diabetes Tipe 2'
                                            :
                                            'Non-Diabetes'
                                    }
                                </Text>
                            </View>
                            <View
                                style={{
                                    marginTop: 20,
                                    paddingHorizontal: 10,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <View>
                                    <View
                                        style={{
                                            display: 'flex',
                                            flexGrow: 1,
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 24,
                                                fontFamily: 'Helvetica-Bold',
                                            }}
                                        >
                                            {formatDateToAge(profile.DOB)}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontFamily: 'Helvetica',
                                            }}
                                        > tahun</Text>
                                    </View>
                                    <Text
                                        style={{
                                            marginTop: -7,
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Umur
                                    </Text>
                                </View>
                                <View>
                                    <View
                                        style={{
                                            display: 'flex',
                                            flexGrow: 1,
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 24,
                                                fontFamily: 'Helvetica-Bold',
                                            }}
                                        >
                                            {Math.floor(profile['height'])}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontFamily: 'Helvetica',
                                            }}
                                        > cm</Text>
                                    </View>
                                    <Text
                                        style={{
                                            marginTop: -7,
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Tinggi
                                    </Text>
                                </View>
                                <View>
                                    <View
                                        style={{
                                            display: 'flex',
                                            flexGrow: 1,
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 24,
                                                fontFamily: 'Helvetica-Bold',
                                            }}
                                        >
                                            {Math.floor(profile['weight'])}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontFamily: 'Helvetica',
                                            }}
                                        > kg</Text>
                                    </View>
                                    <Text
                                        style={{
                                            marginTop: -7,
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Berat
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* button prediction history */}
                        <TouchableOpacity
                            style={{
                                marginTop: 20,
                                paddingHorizontal: 25,
                                backgroundColor: '#FAFAFA',
                            }}
                            onPress={() => router.push('/prediction')}
                        >
                            <View
                                style={{
                                    paddingVertical: 10,
                                    borderBottomColor: '#DBDFEA',
                                    borderBottomWidth: 1,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        padding: 7,
                                        backgroundColor: '#F09F47',
                                        borderRadius: 7,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                    }}
                                >
                                    <Ionicons name="timer-outline" color='#FFFFFF' size={20} className='text-center' />
                                </Text>
                                <Text className='ml-3 text-[16px] font-helvetica'>Histori Prediksi</Text>
                                <Ionicons name="chevron-forward-outline" color='#DA6E35' size={30} className='ml-auto text-center' />
                            </View>
                        </TouchableOpacity>

                        {/* button daftar simpan menu */}
                        <TouchableOpacity
                            style={{
                                paddingHorizontal: 25,
                                backgroundColor: '#FAFAFA',
                            }}
                            onPress={() => router.push('/profile/saved-menus')}
                        >
                            <View
                                style={{
                                    paddingVertical: 10,
                                    borderBottomColor: '#DBDFEA',
                                    borderBottomWidth: 1,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        padding: 7,
                                        backgroundColor: '#4ADE8B',
                                        borderRadius: 7,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                    }}
                                >
                                    <Ionicons name="bookmarks" color='#FFFFFF' size={20} className='text-center' />
                                </Text>
                                <Text className='ml-3 text-[16px] font-helvetica'>Daftar Simpan Menu</Text>
                                <Ionicons name="chevron-forward-outline" color='#DA6E35' size={30} className='ml-auto text-center' />
                            </View>
                        </TouchableOpacity>

                        {/* button ubah kata sandi */}
                        <TouchableOpacity
                            style={{
                                paddingHorizontal: 25,
                                backgroundColor: '#FAFAFA',
                            }}
                            onPress={() => router.push("/change-password/")}
                        >
                            <View
                                style={{
                                    paddingVertical: 10,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        padding: 7,
                                        backgroundColor: '#525252',
                                        borderRadius: 7,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                    }}
                                >
                                    <Ionicons name="lock-closed" color='#FFFFFF' size={20} className='text-center' />
                                </Text>
                                <Text className='ml-3 text-[16px] font-helvetica text-left'>Ubah Kata Sandi</Text>
                                <Ionicons name="chevron-forward-outline" color='#DA6E35' size={30} className='ml-auto text-center' />
                            </View>
                        </TouchableOpacity>

                    </View>

                    <View style={{ paddingBottom: 20 }}>
                        {/* Sign Out Button */}
                        <TouchableOpacity
                            style={{
                                marginHorizontal: 16,
                                paddingVertical: 10,
                                borderWidth: 1,
                                borderColor: '#FE3F11',
                                borderRadius: 10,
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={async () => {
                                signOut()
                                await deleteAllData()
                                router.replace('/(auth)/login')
                            }}
                        >
                            <Ionicons name="log-out-outline" color='#FE3F11' size={26} />
                            <Text
                                style={{
                                    marginLeft: 5,
                                    color: '#FE3F11',
                                    fontSize: 20,
                                    fontFamily: 'Helvetica-Bold',
                                    textAlign: 'center',
                                }}
                            >
                                Keluar
                            </Text>
                        </TouchableOpacity>
                        <Text
                            style={{
                                color: '#969696',
                                fontSize: 16,
                                fontFamily: 'Helvetica',
                                textAlign: 'center',
                            }}
                        >
                            Versi 1.0
                        </Text>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
            :
            null
    )
}