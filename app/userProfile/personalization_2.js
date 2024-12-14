import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Personalization2 = ({ setFieldValue, setFieldTouched, values, touched, errors }) => {
    const [selectedPatient, setSelectedPatient] = useState(values.selectPatient || '');

    return (
        <View className='mt-4'>
            <Text style={styles.title}>Apakah Anda{'\n'}terkena diabetes?</Text>
            <Text style={styles.subTitle}>Pilih yang sesuai dirimu</Text>
            <View className='mt-2'>
                <TouchableOpacity
                    style={[
                        styles.selectionButton,
                        { backgroundColor: selectedPatient == 0 ? '#EC8F5E' : 'transparent' },
                    ]}
                    onPress={() => {
                        setFieldTouched("selectPatient", true);
                        setSelectedPatient(0);
                        setFieldValue('selectPatient', 0);
                    }}
                >
                    <Text
                        style={[
                            styles.selectionButtonText,
                            { color: selectedPatient == 0 ? '#ffffff' : '#EC8F5E' }
                        ]}
                    >
                        Pasien Non-Diabetes
                    </Text>
                    <Image
                        source={require('@/assets/svgs/userProfile/Non-Diabetes.png')}
                        style={ styles.img }
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.selectionButton,
                        { backgroundColor: selectedPatient === 1 ? '#EC8F5E' : 'transparent' },
                    ]}
                    onPress={() => {
                        setFieldTouched("selectPatient", true);
                        setSelectedPatient(1);
                        setFieldValue('selectPatient', 1);
                    }}
                >
                    <Text
                        style={[
                            styles.selectionButtonText,
                            { color: selectedPatient === 1 ? '#ffffff' : '#EC8F5E' }
                        ]}
                    >
                        Pasien Diabetes
                    </Text>
                    <Image
                        source={require('@/assets/svgs/userProfile/Diabetes.png')}
                        style={ styles.img }
                    />
                </TouchableOpacity>
                {touched.selectPatient && errors.selectPatient &&
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
                            {errors.selectPatient}
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
        fontFamily: ['Helvetica-Bold'],
    },
    subTitle: {
        marginBottom: 14,
        color: '#969696',
        fontSize: 14,
        fontFamily: ['Helvetica'],
    },
    selectionButton: {
        marginBottom: 20,
        paddingVertical: 20,
        borderWidth: 2,
        borderColor: '#EC8F5E',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectionButtonText: {
        marginBottom: 5,
        color: '#EC8F5E',
        fontSize: 18,
        fontFamily: ['Helvetica-Bold'],
        textAlign: 'center',
    },
    img: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    }
});

export default Personalization2;
