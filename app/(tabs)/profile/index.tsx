import { View, Text, Alert, TouchableWithoutFeedback, Keyboard, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import useProfile from '@/hooks/api/profile/useProfile';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function index() {
    const { fetchUserProfile } = useProfile()
    const [fetchLoading, setFetchLoading] = useState(false)
    const [profileData, setProfileData] = useState(null)
    const [visibleModal, setVisibleModal] = useState(true)
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

    const saveImage = async(image: string) => {
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
                        paddingHorizontal: 16,
                        paddingVertical: 16,
                        display: 'flex',
                        backgroundColor: 'bg',
                    }}
                >
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
                                        <Ionicons name={'close-outline'} size={30} className='text-center'/>
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
                                        <Ionicons name={'camera'} size={30} className='mt-2' color={'#DA6E35'}/>
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
                                        <Ionicons name={'image'} size={30} className='mt-2' color={'#DA6E35'}/>
                                        <Text>Image</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <View
                        style={{ 
                            position: 'relative',
                            marginBottom: 30, 
                            width: 130,
                        }}
                    >
                        <Image
                            source={image ? { uri: image } : require('@/assets/images/user-profile/dummy.png')}
                            style={{ 
                                width: 130,
                                height: 130,
                                borderColor: '#EEEEEE',
                                borderWidth: 4,
                                borderRadius: 75,
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
                            <Ionicons name="camera-outline" color='#DD6A19' size={26} className='text-center'/>
                        </TouchableOpacity>
                    </View>
                    {/* general info container */}
                    <View
                        style={{ 
                            padding: 15,
                            width: '100%',
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
                                <Ionicons name={profileData['gender'] === "male"? 'male-outline' : 'female-outline'} size={20} className='mt-2'/>
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
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                }}
                                onPress={() => router.navigate('profile/edit-profile')}
                            >
                                <Text
                                    style={{ 
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
                                    paddingHorizontal: 15,
                                    paddingVertical: 10,
                                    backgroundColor: '#F4C687',
                                    color: '#DA6E35',
                                    fontSize: 16,
                                    fontFamily: 'Helvetica-Bold',
                                    textAlign: 'center',
                                }}
                            >
                                {profileData['is_diabetes'] ? 'Diabetes' : 'Non-Diabetes'}
                            </Text>
                        </View>
                        <View
                            style={{ 
                                marginTop: 20,
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
                                        {profileData['height']}
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
                                        {profileData['weight']}
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
                            paddingHorizontal: 8,
                            paddingVertical: 10,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{ 
                                padding: 10,
                                backgroundColor: '#F9DCAF',
                                borderRadius: 100,
                                display: 'flex',
                                justifyContent: 'center',
                                alignContent: 'center',
                            }}
                        >
                            <Ionicons name="timer-outline" color='#DD6A19' size={24} className='text-center'/>
                        </Text>
                        <Text className='ml-3 text-[16px] font-helvetica-bold'>Histori prediksi</Text>
                        <Ionicons name="chevron-forward-outline" color='#000000' size={30} className='ml-auto text-center'/>
                    </TouchableOpacity>
                    {/* button daftar dimpan menu */}
                    <TouchableOpacity
                        style={{ 
                            marginTop: 5,
                            paddingHorizontal: 8,
                            paddingVertical: 10,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{ 
                                padding: 10,
                                backgroundColor: '#BBF7D4',
                                borderRadius: 100,
                                display: 'flex',
                                justifyContent: 'center',
                                alignContent: 'center',
                            }}
                        >
                            <Ionicons name="bookmarks-outline" color='#16A354' size={24} className='text-center'/>
                        </Text>
                        <Text className='ml-3 text-[16px] font-helvetica-bold'>Daftar simpan menu</Text>
                        <Ionicons name="chevron-forward-outline" color='#000000' size={30} className='ml-auto text-center'/>
                    </TouchableOpacity>
                    {/* button ubah kata sandi */}
                    <TouchableOpacity
                        style={{ 
                            marginTop: 5,
                            paddingHorizontal: 8,
                            paddingVertical: 10,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{ 
                                padding: 10,
                                backgroundColor: '#BDBDBD',
                                borderRadius: 100,
                                display: 'flex',
                                justifyContent: 'center',
                                alignContent: 'center',
                            }}
                        >
                            <Ionicons name="lock-closed-outline" color='#525252' size={24} className='text-center'/>
                        </Text>
                        <Text className='ml-3 text-[16px] font-helvetica-bold text-left'>Ubah kata sandi</Text>
                        <Ionicons name="chevron-forward-outline" color='#000000' size={30} className='ml-auto text-center'/>
                    </TouchableOpacity>
                    {/* button FAQ */}
                    <TouchableOpacity
                        style={{ 
                            marginTop: 5,
                            paddingHorizontal: 8,
                            paddingVertical: 10,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{ 
                                padding: 10,
                                backgroundColor: '#f2e0ac',
                                borderRadius: 100,
                                display: 'flex',
                                justifyContent: 'center',
                                alignContent: 'center',
                            }}
                        >
                            <Ionicons name="reader-outline" color='#A27906' size={24} className='text-center'/>
                        </Text>
                        <Text className='ml-3 text-[16px] font-helvetica-bold'>FAQ</Text>
                        <Ionicons name="chevron-forward-outline" color='#000000' size={30} className='ml-auto text-center'/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ 
                            marginTop: 'auto',
                            paddingVertical: 10,
                            borderWidth: 1,
                            borderColor: '#DA6E35',
                            borderRadius: 10,
                        }}
                    >
                        <Text
                            style={{ 
                                color: '#DA6E35',
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
            </TouchableWithoutFeedback>
            :
            null
            
    )
}