import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Personalization3_1 = ({ setFieldValue, setFieldTouched, values, touched, errors }) => {
    const [selectedDiabetesType, setSelectedDiabetesType] = useState(values.selectDiabetesType || '');

    return (
        <View className='mt-4'>
            <Text style={styles.title}>Diabetes apa yang{'\n'}diidap Anda?</Text>
            <Text style={styles.subTitle}>Berkaitan dengan informasi pribadi Anda</Text>
            <View className='mt-4'>
                <TouchableOpacity
                    style={[
                        { marginBottom: 25 },
                        styles.selectionButton,
                        { backgroundColor: selectedDiabetesType === 1 ? '#EC8F5E' : 'transparent' },
                    ]}
                    onPress={() => {
                        setFieldTouched("selectDiabetesType", true);
                        setSelectedDiabetesType(1);
                        setFieldValue('selectDiabetesType', 1);
                    }}
                >
                    <Image
                        source={require('@/assets/svgs/userProfile/DiabetesTipe1.png')}
                        style={{
                            width: 100,
                            height: 100,
                            resizeMode: 'contain',
                        }}
                    />
                    <Text
                        style={[
                            styles.selectionButtonText,
                            { color: selectedDiabetesType === 1 ? '#ffffff' : '#EC8F5E' }
                        ]}
                    >
                        Kondisi dimana tubuh tidak menghasilkan insulin
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        { marginBottom: 25 },
                        styles.selectionButton,
                        { backgroundColor: selectedDiabetesType === 2 ? '#EC8F5E' : 'transparent' },
                    ]}
                    onPress={() => {
                        setFieldTouched("selectDiabetesType", true);
                        setSelectedDiabetesType(2);
                        setFieldValue('selectDiabetesType', 2);
                    }}
                >
                    <Image
                        source={require('@/assets/svgs/userProfile/DiabetesTipe2.png')}
                        style={{
                            width: 100,
                            height: 100,
                            resizeMode: 'contain',
                        }}
                    />
                    <Text
                        style={[
                            styles.selectionButtonText,
                            { color: selectedDiabetesType === 2 ? '#ffffff' : '#EC8F5E' }
                        ]}
                    >
                        Kondisi dimana insulin dalam tubuh tidak bekerja efektif atau tidak cukup
                    </Text>
                </TouchableOpacity>
                {touched.selectDiabetesType && errors.selectDiabetesType &&
                    <View
                        className="gap-1"
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Ionicons name='warning' size={16} color='red' />
                        <Text
                            style={{
                                color: '#EF4444',
                                fontFamily: 'Helvetica',
                            }}
                        >
                            {errors.selectDiabetesType}
                        </Text>
                    </View>
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        marginBottom: -5,
        fontSize: 32,
        fontFamily: 'Helvetica-Bold',
    },
    subTitle: {
        marginBottom: 14,
        color: '#969696',
        fontSize: 14,
        fontFamily: 'Helvetica',
    },
    selectionButton: {
        height: 140,
        borderWidth: 3,
        borderColor: '#EC8F5E',
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    selectionButtonText: {
        width: 230,
        color: '#EC8F5E',
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
    },
});

export default Personalization3_1;
