import { View, Text, Alert, TouchableWithoutFeedback, Keyboard, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import useProfile from '@/hooks/api/profile/useProfile';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DynamicTextComponent from '@/components/DynamicText';
import { useSession } from "../context/AuthenticationProvider";

export default function EditProfilePage() {
    const { signOut, session } = useSession();
    const { fetchUserProfile } = useProfile()
    const [fetchLoading, setFetchLoading] = useState(false)
    const [profileData, setProfileData] = useState(null)
    const [visibleModal, setVisibleModal] = useState(false)
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchUserProfile(setFetchLoading);
                if (res.status === 200) {
                    console.log(res.data);
                    setProfileData(res.data);
                    Alert.alert('Success', res.message);
                } else if (res.status === 400) {
                    console.log(res.message);
                    Alert.alert('Error', res.message);
                }
            } catch (err) {
                console.log('Axios Error:', err);
                Alert.alert('Error', 'Please try again later');
            }
        };

        fetchData();
    }, []);

    const uploadImage = async () => {
        try {
            await ImagePicker.requestCameraPermissionsAsync();
            let result = await ImagePicker.launchCameraAsync();

            if (!result.canceled) {
                await saveImage(result.assets[0].uri)
            }
        } catch (error) {

        }
    }

    const saveImage = async (image: string) => {
        try {
            setImage(image);
            console.log("Image URI: ", image)
            setVisibleModal(false);
        } catch (error) {

        }
    }

    return (
        profileData ?
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'white',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            display: 'flex',
                        }}
                    >
                        <DynamicTextComponent
                            text='Profil'
                            img={require('@/assets/images/backgrounds/bg-profile.png')}
                            back={true}
                            style={{ height: 220 }}
                        />
                        <Modal
                            transparent={true}
                            visible={visibleModal}
                            animationType="fade"
                            style={{
                                backgroundColor: 'black'
                            }}
                        >
                            <View
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                }}
                            >
                                <View
                                    style={{
                                        margin: 'auto',
                                        paddingHorizontal: 10,
                                        width: 250,
                                        borderRadius: 20,
                                        backgroundColor: 'white',
                                    }}
                                >
                                    <View
                                        style={{
                                            marginTop: 10,
                                            marginBottom: 15,
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            alignContent: 'center',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                marginRight: 35,
                                                paddingTop: 10,
                                                fontSize: 20,
                                                fontFamily: 'Helvetica-Bold',
                                                textAlign: 'center'
                                            }}
                                        >
                                            Foto Profil
                                        </Text>
                                        <TouchableOpacity onPress={() => setVisibleModal(false)}>
                                            <Ionicons name={'close-outline'} size={30} className='text-center' />
                                        </TouchableOpacity>
                                    </View>
                                    <View
                                        style={{
                                            marginBottom: 20,
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-around',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                marginLeft: 20,
                                                paddingHorizontal: 15,
                                                paddingBottom: 10,
                                                backgroundColor: '#FFF8E1',
                                                borderRadius: 10,
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                            onPress={() => uploadImage()}
                                        >
                                            <Ionicons name={'camera'} size={30} className='mt-2' color={'#DA6E35'} />
                                            <Text>Camera</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{
                                                marginRight: 20,
                                                paddingHorizontal: 15,
                                                paddingBottom: 10,
                                                backgroundColor: '#FFF8E1',
                                                borderRadius: 10,
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Ionicons name={'image'} size={30} className='mt-2' color={'#DA6E35'} />
                                            <Text>Image</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>

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
                            <Image
                                source={image ? { uri: image } : require('@/assets/images/user-profile/dummy.png')}
                                style={{
                                    width: 110,
                                    height: 110,
                                    borderColor: '#EEEEEE',
                                    borderWidth: 4,
                                    borderRadius: 70,
                                }}
                            />
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: 'white',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={() => setVisibleModal(true)}
                            >
                                <Ionicons name="camera-outline" color='#DD6A19' size={26} className='text-center' />
                            </TouchableOpacity>
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
                                        {profileData['firstname']} {profileData['lastname']}
                                    </Text>
                                    <Ionicons name={profileData['gender'] === "male" ? 'male-outline' : 'female-outline'} size={20} className='mt-2' />
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
                                        marginRight: '60%',
                                        paddingHorizontal: 13,
                                        paddingVertical: 8,
                                        backgroundColor: '#FFF8E1',
                                        borderRadius: 12,
                                        color: '#DA6E35',
                                        fontSize: 16,
                                        fontFamily: 'Helvetica-Bold',
                                        textAlign: 'center',
                                    }}
                                >
                                    {profileData['is_diabetes'] ? 'Terindikasi' : 'Non-Diabetes'}
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
                                            {profileData['age']}
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
                                            {Math.floor(profileData['height'])}
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
                                            {Math.floor(profileData['weight'])}
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
                            onPress={() => {
                                signOut()
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
                </View>
            </TouchableWithoutFeedback>
            :
            null
    )
}