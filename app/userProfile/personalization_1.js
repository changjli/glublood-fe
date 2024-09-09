import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Button, Pressable, Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyledCustomTextInput } from '@/components/CustomInput/CustomTextInput/userProfile';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { TextInput } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';

// Selection button state (gender)
const isGender = [
    { label: 'Pria', value: 'male' },
    { label: 'Wanita', value: 'female' },
];

// Selection button state (descendant)
const isDescendant = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
];

const Personalization1 = ({ handleChange, setFieldValue, values, errors }) => {
    const [gender, setGender] = useState(values.gender || '');
    const [descendant, setDescendant] = useState(values.descendant || '');
    
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());

    const [focus, setFocus] = useState(false);
    const [image, setImage] = useState();

    const handleOnPressDatePicker = () => {
        setOpenDatePicker(!openDatePicker)
    }

    const handleOnChangeDatePicker = (event, selectedDate) => {
        handleOnPressDatePicker()
        if (selectedDate) {
            dateFormat = dayjs(selectedDate).format('DD/MM/YYYY')
            console.log(dateFormat)
            setFieldValue('birthDate', selectedDate);
        }
    }
    
    return (
        <View className='mt-4'>
            <Text style={styles.title}>Kelengkapan{'\n'}Data Diri</Text>
            <Text style={styles.subTitle}>Berkaitan dengan informasi pribadi Anda</Text>
            <View>
                <View className="mb-2 flex-row justify-between">
                    <StyledCustomTextInput
                        classStyle='mr-2 flex-1'
                        label='Nama depan'
                        placeholder='Type something here'
                        value={values.firstname}
                        onChangeText={handleChange('firstname')}
                        error={errors.firstname}
                    />
                    <StyledCustomTextInput
                        classStyle='ml-2 flex-1'
                        label='Nama belakang'
                        placeholder='Type something here'
                        value={values.lastname}
                        onChangeText={handleChange('lastname')}
                        error={errors.lastname}
                    />
                </View>
                <View className="mb-2 flex-row justify-between">
                    <StyledCustomTextInput
                        classStyle='mr-2 flex-1'
                        label='Berat Badan'
                        placeholder='Dalam Kg'
                        value={values.weight}
                        onChangeText={handleChange('weight')}
                        error={errors.weight}
                    />
                    <StyledCustomTextInput
                        classStyle='ml-2 flex-1'
                        label='Tinggi Badan'
                        placeholder='Dalam Cm'
                        value={values.height}
                        onChangeText={handleChange('height')}
                        error={errors.height}
                    />
                </View>
                <View className="mb-2 flex-row justify-between">
                    <StyledCustomTextInput
                        classStyle='mr-2 flex-1'
                        label='Usia'
                        placeholder='Tahun'
                        value={values.age}
                        onChangeText={handleChange('age')}
                        error={errors.age}
                    />
                    <View className='ml-2 flex-1'>
                        <Text
                            style = {{ 
                                fontSize: 12,
                                fontFamily: 'Helvetica-Bold'
                            }}
                        >
                            Tanggal Lahir
                        </Text>
                        <Pressable
                            style={{ 
                                width: '100%',
                                paddingHorizontal: 14,
                                paddingVertical: 10,
                                borderWidth: 1,
                                borderRadius: 8,
                                borderColor: errors.birthDate ? 'red' : '#969696',
                            }}
                            onPress={handleOnPressDatePicker}
                        >
                            <Text
                                style={{ 
                                    fontFamily: 'Helvetica',
                                    fontSize: 16,
                                }}
                            >
                                {dayjs(values.birthDate).format('DD/MM/YYYY')}
                            </Text>
                        </Pressable>
                        {errors.birthDate &&
                            <View className='flex flex-row items-center gap-1'>
                                <Ionicons name='warning' size={16} color='red' />
                                <Text className='font-helvetica text-red-500'>
                                    {errors.birthDate}
                                </Text>
                            </View>
                        }
                    </View>
                </View>
                <View className="mb-4">
                    <Text style={styles.headerTextInput} >Jenis Kelamin</Text>
                    <View className="flex-row justify-between">
                        {isGender.map((item, index) => (
                            <TouchableOpacity
                                key={item.value}
                                style={[
                                    styles.selectionButton,
                                    { marginRight: index === 0 ? 8 : '' },
                                    { marginLeft: index === 1 ? 8 : '' },
                                    { backgroundColor: gender === item.value ? '#EC8F5E' : 'transparent' },
                                ]}
                                onPress={() => {
                                    setGender(item.value)
                                    setFieldValue('gender', item.value)
                                }}
                            >
                                <Text
                                    className="text-sm font-helvetica-bold text-center"
                                    style={{
                                        color: gender === item.value ? '#ffffff' : '#EC8F5E'
                                    }}
                                >
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {errors.gender &&
                        <View className='flex flex-row items-center gap-1'>
                            <Ionicons name='warning' size={16} color='red' />
                            <Text className='font-helvetica text-red-500'>
                                {errors.gender}
                            </Text>
                        </View>
                    }
                </View>
                <View className="mb-4">
                    <Text style={styles.headerTextInput} >Apakah Anda memiliki keturunan dengan riwayat penyakit diabetes?</Text>
                    <View className="flex-row justify-between">
                        {isDescendant.map((item, index) => (
                            <TouchableOpacity
                                key={item.value}
                                style={[
                                    styles.selectionButton,
                                    { marginRight: index === 0 ? 8 : '' },
                                    { marginLeft: index === 1 ? 8 : '' },
                                    { backgroundColor: descendant === item.value ? '#EC8F5E' : 'transparent' },
                                ]}
                                onPress={() => {
                                    setDescendant(item.value)
                                    setFieldValue('descendant', item.value)
                                }}
                            >
                                <Text
                                    className="text-sm font-helvetica-bold text-center"
                                    style={{
                                        color: descendant === item.value ? '#ffffff' : '#EC8F5E'
                                    }}
                                >
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {errors.descendant &&
                        <View className='flex flex-row items-center gap-1'>
                            <Ionicons name='warning' size={16} color='red' />
                            <Text className='font-helvetica text-red-500'>
                                {errors.descendant}
                            </Text>
                        </View>
                    }
                </View>
                <StyledCustomTextInput
                    label='Riwayat Penyakit'
                    placeholder='Cth: Kolesterol'
                    value={values.diseaseHistory}
                    onChangeText={handleChange('diseaseHistory')}
                    error={errors.diseaseHistory}
                />
            </View>

            {openDatePicker ? 
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="spinner"
                    minimumDate={new Date(1900, 1, 1)}
                    maximumDate={new Date()}
                    onChange={handleOnChangeDatePicker}
                />
                :
                null
            }
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        marginBottom: -5,
        fontSize: 32,
        fontFamily: ['Helvetica-Bold'],
    },
    subTitle: {
        marginBottom: 14,
        color: '#969696',
        fontSize: 14,
        fontFamily: ['Helvetica'],
    },
    headerTextInput: {
        marginVertical: 0,
        paddingVertical: 0,
        fontFamily: ['Helvetica-Bold'],
        fontSize: 12,
    },
    selectionButton: {
        height: 30,
        borderWidth: 1,
        borderColor: '#EC8F5E',
        borderRadius: 5,
        flex: 1,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectionButtonText: {
        color: '#EC8F5E',
        fontSize: 18,
        fontFamily: ['Helvetica-Bold'],
        textAlign: 'center',
    },
    centeredView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        margin: 20,
        padding: 25,
        width: '90%',
        backgroundColor: '#F5FCFF',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    }
});

export default Personalization1;
