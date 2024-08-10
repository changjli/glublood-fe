import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyledCustomTextInput } from '@/components/CustomInput/CustomTextInput/userProfile'

// Selection button state (gender)
const isGender = [
    { label: 'Pria', value: 'pria' },
    { label: 'Wanita', value: 'wanita' },
];

// Selection button state (descendant)
const isDescendant = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
];

const Personalization1 = ({ handleChange, setFieldValue, values, errors }) => {
    const [gender, setGender] = useState(values.gender || '');
    const [descendant, setDescendant] = useState(values.descendant || '');

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
                    <StyledCustomTextInput
                        classStyle='ml-2 flex-1'
                        label='Tanggal lahir'
                        placeholder='DD/MM/YYYY'
                        value={values.birthDate}
                        onChangeText={handleChange('birthDate')}
                        error={errors.birthDate}
                    />
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
});

export default Personalization1;
